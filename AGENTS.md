# Quarto Presentation — Agent Instructions

Quarto revealjs presentation template. Source file is `*.qmd`. Rendered output
goes to `_output/` (or `docs/` if publishing to GitHub Pages).

This file is the entry point for any agent (Claude Code, OpenCode, Qwen Code,
Aider, etc.) working in this repo. `CLAUDE.md` is a symlink to this file so
Claude Code reads the same content natively.

---

## Where to look for what

Two reference files sit alongside this one. Load each only when a task
actually needs it — they're long enough that preemptive loading wastes
context on small models.

- **`slide-patterns.md`** — Layout palette, CSS classes, components, brand
  colors, heading icons. Load when authoring or modifying slide structure
  or visuals.
- **`content-design.md`** — What to actually *write* on slides: narrative
  arc, writing rules, anti-patterns, deck review. Load when designing slide
  content from scratch, critiquing a deck, or rewriting prose.

This file (`AGENTS.md`) stays loaded and covers: project orientation,
rendering, the intent → pattern dispatch table, guardrails, and known gotchas.

---

## Rendering

```bash
# Live preview (opens browser, auto-refreshes on save)
quarto preview presentation.qmd

# One-shot render + PDF
./build.sh                  # auto-detects *.qmd
./build.sh my-talk.qmd      # explicit

# Screenshots for review (run from project dir)
mkdir -p _screenshots/check
npx decktape reveal --screenshots --screenshots-format png \
  --screenshots-directory /abs/path/_screenshots/check \
  --size 1280x720 "_output/file.html" slides.pdf
# Note: screenshots-directory MUST be absolute; PDF name MUST be relative
```

For batch visual QA without filling the main context with PNGs, delegate to the
**`slide-reviewer`** sub-agent (`.claude/agents/`): it renders, screenshots the
slides you name, reads them, and returns a terse per-slide pass/clip report. It
returns text, not images — so screenshot directly yourself when you or the user
need to actually see a slide.

### Verifying a CSS / visual change actually landed

Two traps when confirming a `custom.scss` edit reached the output:

- **The compiled theme CSS is URL-encoded inside a `<link href="data:text/css,…">`,
  not a plain `<style>` block.** Grepping `_output/*.html` for a selector or rule
  fails — `{` is `%7B`, spaces are `%20`, etc. To search it, decode the data URI
  first, e.g.
  `python3 -c "import re,urllib.parse;h=open('_output/template.html').read();css=''.join(urllib.parse.unquote(x) for x in re.findall(r'data:text/css,([^\"]*)',h));print('rule' in css)"`.
  Don't conclude a rule "didn't compile" from a raw grep — that's a false negative,
  not a stale cache.
- **decktape screenshots are a print/export context.** Hover-only affordances and
  overlay scrollbars may not appear in them even when they work live. Confirm those
  in `quarto preview` in a real browser, not from a PNG.

## Environment

Use the conda env matching the project directory name, or the `quarto` env
if present. Quarto must be available on `PATH`.

## Publishing to GitHub Pages (optional)

If the talk should be served from GitHub Pages, two changes:

1. In `_quarto.yml`, set `output-dir: docs` (Pages serves from `/docs` on `main`).
2. In `build.sh`, after `quarto render`, copy the rendered HTML to `index.html`
   so the root URL works:
   ```bash
   cp "${HTML_FILE}" "${OUTPUT_DIR}/index.html"
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch:
   `main` / `/docs`**.

The rendered HTML is `self-contained: true`, so a plain copy is sufficient —
no asset wrangling needed.

---

## File structure

| File                  | Purpose                                                         |
|-----------------------|-----------------------------------------------------------------|
| `AGENTS.md`           | This file — entry point for agents                              |
| `CLAUDE.md`           | Symlink → `AGENTS.md` (so Claude Code loads it natively)        |
| `slide-patterns.md`   | Layouts, CSS, components, brand colors — loaded when authoring  |
| `content-design.md`   | Writing rules, narrative, deck review — loaded when writing     |
| `template.qmd`        | Starting point — copy via `new-presentation.sh`, then edit      |
| `custom.scss`         | All styles — only file to edit for visual changes               |
| `_quarto.yml`         | Quarto config — rarely needs editing                            |
| `build.sh`            | Render HTML + produce PDF in one command (`./build.sh`)         |
| `new-presentation.sh` | Scaffold a new talk (`./new-presentation.sh <dir> "Title"`)     |

`template.qmd` includes one example of every key slide pattern. Keep the slides
you need, replace placeholder content.

### Starting a new talk

This repo is a **GitHub template repository**. The primary way to start a talk is:

```bash
gh repo create my-talk \
  --template charliecpeterson/presentation-template \
  --private --clone
cd my-talk
# edit the title/subtitle in template.qmd's YAML header, then write
```

That makes a fresh repo with its own clean history (not the template's), the
remote already set, and every template file — including `.claude/agents/`,
`assets/personal/`, and these docs — copied in. Do NOT `git clone` the template
and repoint the remote: that drags the template's entire commit history into the
talk.

`new-presentation.sh` remains as an offline/local fallback (it also substitutes
the title/subtitle), but it creates the talk as a sibling directory and you must
`git init` and create the remote yourself.

### Extra slides / appendix

The deck ends with an `# Extra Slides` section: a parking lot for slides that
aren't in the main flow but shouldn't be deleted — backup detail, answers to
likely questions, or material the audience can browse/download afterward. When
the user says they have more slides than time, want to "hold," "park," "stash,"
or "keep for later/afterward" a slide, or want to cut something without losing
it — move it into this section rather than deleting it.

Mark every appendix slide (and the section divider) `{visibility="uncounted"}`.
Uncounted slides fully render and ship in the HTML/PDF and stay navigable, but
they don't count toward the main talk's `c/t` slide number. To promote one back
into the talk, move it up into the right section and drop the attribute.

Do NOT use `{visibility="hidden"}` for this — hidden slides render blank in the
PDF (see gotchas). `uncounted` is the one to use.

---

## Slide-type catalog — intent → pattern

When the user describes a slide, match it here, then load `slide-patterns.md`
for the markup detail.

| Goal / User says…                                  | Pattern to use                              |
|----------------------------------------------------|---------------------------------------------|
| "Introduce the talk / agenda"                      | Overview slide (60/40, topics + note)       |
| "Show where materials are / links"                 | Resources & Materials slide                 |
| "Wrap up / final slide"                            | Summary slide (takeaways + contact callout) |
| "Explain a concept with two sides"                 | Two-Column 50/50                            |
| "Main content + a callout on the side"             | Two-Column 60/40                            |
| "Compare two options / before vs after"            | Comparison slide (highlight/accent box)     |
| "Compare three options / show a spectrum"          | Three-Column 33/33/33 (`.text-sm`)          |
| "Show several A-vs-B examples on one slide"        | Stacked Comparisons (multiple A/B rows)     |
| "Quick numbered list of steps"                     | `.steps` list, `{.slide-flow}` heading      |
| "Walk through a process with descriptions"         | Step-by-Step prose slide, `{.slide-flow}`   |
| "Show a diagram / screenshot with notes"           | Image + Caption (60/40)                     |
| "Walk through a real screenshot of a tool / demo"  | Big Screenshot + Bullets (55/45, `.text-sm`)|
| "Tall portrait screenshot (terminal, chat, mobile)"| Image — constrained for screenshots         |
| "Quote a finding / cite a paper"                   | `.pull-quote` block (65/35)                 |
| "Show Python / R / code example"                   | Code block — language auto-labeled          |
| "Show a shell command"                             | Code block `.bash` — teal header            |
| "Show a command AND its output"                    | Code block + ` ```{.output} ` block         |
| "Walk through code line-by-line on click"          | Code block + `code-line-numbers="1\|3-5\|8"` |
| "Morph code/box/diagram between two slides"        | Two `##` slides, both `{auto-animate=true}`  |
| "Compare code in two languages"                    | Two-column 50/50 with code blocks           |
| "Display key numbers / metrics"                    | `.stat-row` + `.stat-card`                  |
| "Feature comparison table"                         | Table + `.pill-yes/partial/no`              |
| "Dense matrix / 20+ row table"                     | `.table-compact` wrapper (inside `.text-xs`)|
| "Long code / transcript / SKILL.md to scroll"      | `.scroll-box` (or `.scroll-box.prose`)      |
| "Screenshot with callout labels on it"             | `.annotated-shot` + `.shot-label` chips      |
| "Highlight a single key result"                    | `.key-finding` box                          |
| "Highlight a takeaway"                             | `.highlight-box`                            |
| "Warn about a gotcha"                              | `.callout-warning` or `.accent-box`         |
| "Cite a source on just this slide"                 | `::: footer` div at bottom of slide         |
| "Cite the paper a figure/result came from"         | `::: footer` citation (repeat per section)   |
| "Chemistry / math: sub/superscript, equations"     | `~x~` `^x^`, `$…$` inline, `$$…$$` display   |
| "Acknowledgments / contributors + funding"         | Acknowledgments slide (60/40 columns)        |
| "Reveal bullets one at a time"                     | `. . .` fragments between bullet groups     |
| "Toggle two images/versions in the same spot"      | `.r-stack` + fade fragments (swap in place) |
| "Add speaker notes / presenter cues"               | `::: {.notes}` div (presenter view only)    |
| "Scatter logos / place things at exact spots"      | `.absolute` (top/left/right/bottom + width)  |
| "Cat / personal photo on the closing slide"        | `assets/personal/` (see its README)          |
| "Start a new major section"                        | `# Title {background-color="#1C6D72"}`      |

If the user is asking what to *say* (not how to render), load
`content-design.md` instead.

---

## What NOT to change

- `.reveal::before` (left sidebar stripe) — core brand element
- `.reveal::after` (bottom rule) — styling is a core brand element. Position
  (`bottom: 52px`) is intentional: the rule sits *above* the footer metadata
  row (Quarto's footer text, per-slide `::: footer` citations, slide number —
  all at ~10–18px from bottom) and acts as the visual divider between them.
  Per-slide `::: footer` citations render below the rule, overriding the
  default footer for that slide. Keep the styling; do not move the rule
  back over the footer text.
- The `$brand-*` color variables in `custom.scss`
- The `footer:` value in `_quarto.yml` without asking
- `controls: false` in `_quarto.yml` — navigation arrows are disabled intentionally
- Global `scrollable` is intentionally OFF — do not re-add `scrollable: true`. It puts a
  second scrollbar on the *slide* on top of any `.scroll-box`'s inner one (the "two sliders"
  problem). For a slide that genuinely must scroll as a whole, add `{.scrollable}` to that one
  `##` heading. Long code wraps via `code-overflow: wrap`, so it doesn't need slide scroll either.

## Known gotchas — do not reintroduce these bugs

- **Never add `background-image` to `.reveal section.has-dark-background`** — any gradient on section
  break slides creates a visible rectangular artifact in rendered output (root cause: gradient layer
  boundaries interact with the sidebar stripe pseudo-element)
- **`{footer="..."}` on headings does NOT work** — use `::: footer ... :::` div inside the slide body
- **`{visibility="hidden"}` sections create blank slides in PDF** — accepted; do not try to hide them
  with CSS (decktape uses the revealjs JS API, not DOM visibility)
- **Nested `em` font sizes compound** — only set `font-size` on the outermost wrapper div; inner
  elements should use `font-size: 1em` to inherit without multiplying
- **Terminal chrome uses `pre.bash` not `:has(code.bash)`** — decktape's Chromium doesn't support
  the `:has()` selector; always target the `<pre>` element's class directly
- **Brand bottom rule must sit ABOVE the footer row** — Quarto's default footer text is at
  `bottom: 18px` with a line-height that extends up to ~40px. If `.reveal::after` is positioned
  anywhere between ~10–45px, the rule collides with the footer text's ascenders and appears to
  overlap. Keep the rule at `bottom: 52px` (or higher). Do not "fix" by pushing the footer up
  into the slide content — push the rule up instead.
- **`. . .` fragment marker can render as literal text** — when surrounded by certain block types
  (callouts, highlight-boxes, image divs) without enough whitespace, the `. . .` paragraph renders
  as visible dots instead of acting as a fragment break. Always put blank lines on both sides, and
  if it still renders literally, drop the fragment — the slide usually reads fine without it.
- **Never inline `<svg>` in the `.qmd`** — Quarto runs inline HTML through a parser that lowercases
  case-sensitive SVG attributes (`viewBox`→`viewbox`) and drops camelCase elements (`markerWidth`,
  `feDropShadow`, `stdDeviation`). The coordinate system dies and every `<text>` reflows as plain
  paragraphs. Put the diagram in its own file under `assets/*.svg` and reference it with
  `<img src="assets/foo.svg">`; `self-contained: true` inlines it at render.
- **Tall images overflow without a height constraint** — `<img width="95%">` only constrains
  width, so portrait or tall screenshots blow past the bottom of the slide. Use
  `style="max-width: 100%; max-height: 540px; width: auto; height: auto;"` (or similar) to cap
  both dimensions. See the "Image — constrained for screenshots" pattern in `template.qmd`.
- **Dense slides need `.text-sm`** — `.text-md` (default) is sized for 4–6 bullets. If you find
  yourself adding a 5th or 6th column, a third short paragraph, or a callout *and* a stat-row,
  switch the slide's outermost wrapper to `.text-sm` (0.65em) before trying to compress content.
  Cheaper than rewording.

---

## Common tasks
- **New slide**: "Add a slide about X after slide Y" — pick the matching pattern from the intent
  table above, then load `slide-patterns.md` for the markup detail
- **Rewrite content**: "Rewrite the overview slide to cover A, B, C" — load `content-design.md`
- **Add code example**: "Add a Python example showing X"
- **SCSS changes**: "Add a new utility class for X" — modify `custom.scss` only
- **Restructure**: "Move the resources slide to the end"
- **Render + review**: "Render and show me how slide N looks" — run `./build.sh`, screenshot
  with decktape, read the PNG images
- **Plan a new talk from scratch**: load `content-design.md` and run the quick-start prompts
