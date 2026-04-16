# Quarto Presentation — Claude Instructions

## Project type
Quarto revealjs presentation. Source file is `*.qmd`. Rendered output goes to `_output/`.

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

## Environment
Use the conda env matching the project directory name, or the `quarto` env if present.
Quarto must be available on PATH.

---

## Style & layout rules

### Font sizes — always use CSS classes, never inline styles
| Class      | Size   | When to use                             |
|------------|--------|-----------------------------------------|
| `.text-xs` | 0.55em | Dense tables, fine print, attribution   |
| `.text-sm` | 0.65em | Supporting detail on busy slides        |
| `.text-md` | 0.75em | **Default** for most content-heavy slides |
| `.text-lg` | 0.90em | Slides with less content                |
| `.text-xl` | 1.10em | Emphasis or key statements              |

**Never** write `{style="font-size: 0.70em"}`. Use `{.text-md}` instead.

### Columns
Standard two-column pattern:
```
:::: {.columns}
::: {.column width="60%"}
...
:::
::: {.column width="40%"}
...
:::
::::
```
Common splits: 60/40, 50/50, 40/60. Don't use more than 3 columns.

### Callouts
Use `appearance="simple"` on **all** callouts. Four types:
- `.callout-note` — general info (cyan border)
- `.callout-tip` — best practice / shortcut (green border)
- `.callout-warning` — gotcha or prerequisite (red border)
- `.callout-important` — critical requirement

### Highlight boxes
- `.highlight-box` — teal left border, light cyan background — key takeaways
- `.accent-box` — red left border, light red background — warnings/caveats (use sparingly)

### Section breaks
Use `# Section Title {background-color="#1C6D72"}` for section dividers.

`# Overview {visibility="hidden"}` and `# Closing {visibility="hidden"}` ARE used at the top of
the Overview and Closing sections — these are structurally required by revealjs to group `##` slides.
They appear as blank slides in PDF export; this is an accepted limitation.

### Code blocks
Always specify the language: ` ```{.python} `, ` ```{.bash} `, ` ```{.r} `

The terminal chrome header bar (e.g. `$ _  BASH`, `>>>  PYTHON`) is automatic — no extra markup needed.
Language labels come from the code fence class.

For terminal output (dark background, green text), use ` ```{.output} `. This signals "what the user
sees in the terminal", not code to type.

### Per-slide footer override
To replace the default footer on a single slide with a citation or URL:

```markdown
## My Slide

Content here.

::: footer
Smith et al. (2024). *A Great Paper*. [doi:10.1234](https://doi.org)
:::
```

Do NOT use `{footer="..."}` as a heading attribute — it doesn't work in Quarto.

---

## CSS components

### Pull quote
```markdown
::: {.pull-quote}
"The most important finding in one punchy sentence."

— Author et al. (2024), *Journal Name*
:::
```
Renders with a large decorative `"` mark, italic body with cyan left border, small attribution line.

### Numbered steps
```markdown
::: {.steps}
1. First step — brief description
2. Second step — brief description
3. Third step — brief description
:::
```
Renders as `01 / 02 / 03` teal counters in a grid layout. Use with `{.slide-flow}` heading class.

### Stat cards
```markdown
::: {.stat-row}
::: {.stat-card}
**80 GB**
VRAM (A100)
:::
::: {.stat-card}
**~10x**
speedup
:::
:::
```
Lays out horizontally. The `**bold**` text becomes the large metric; plain text is the label.

### Status pills (for tables)
```markdown
| Feature | Tool A | Tool B |
|---------|--------|--------|
| GPU support | [Yes]{.pill-yes} | [No]{.pill-no} |
| Partial feature | [Partial]{.pill-partial} | [Yes]{.pill-yes} |
```
Three classes: `.pill-yes` (green), `.pill-partial` (amber), `.pill-no` (red).

### Key finding box
```markdown
::: {.key-finding}
Tool A achieves **~10x** speedup at comparable accuracy.
:::
```
Teal left border, light background, `KEY FINDING` label auto-prepended. Bold text renders in teal.

---

## Brand colors (do not change these)
| Variable       | Hex       | Use                             |
|----------------|-----------|---------------------------------|
| `$brand-cyan`  | `#6AD1E3` | Sidebar gradient, callout-note  |
| `$brand-green` | `#21A364` | Sidebar gradient, callout-tip   |
| `$brand-teal`  | `#1C6D72` | Section BG, h3, highlight-box   |
| `$brand-dark`  | `#2a2a2a` | Body text                       |
| `$brand-accent`| `#E35B6A` | Warnings only (accent-box)      |
| `$brand-link`  | `#0066cc` | Hyperlinks                      |

---

## Slide authoring guidelines

- Keep bullets to 4–6 items max per column
- Pair a list with a callout or image on most slides — avoid full-width bullet dumps
- **Never use emoji in `##` headings** — use the custom SVG icon classes below instead, or no class
- Emoji are acceptable in bullet list items only when genuinely semantic (e.g. ✅ for done)
- Wrap most slide content in `{.text-md}` unless the slide is sparse

### Heading icon classes — append to `## Title {.class}`

| Class            | Icon           | Use for                                         |
|------------------|----------------|-------------------------------------------------|
| `{.slide-code}`  | `>_` terminal  | CLI commands, code examples, API usage          |
| `{.slide-data}`  | bar chart      | results, benchmarks, performance tables         |
| `{.slide-compute}` | CPU chip     | hardware, resource allocation, GPU specs        |
| `{.slide-flow}`  | `>>` chevrons  | workflow, setup steps, numbered process         |
| `{.slide-cluster}` | node triangle | distributed, multi-node, parallel computing   |
| *(none)*         | vertical bar   | general content — default for anything else     |

Assign the icon by content type. Most slides use the default (no class).

---

## What NOT to change
- `.reveal::before` (left sidebar stripe) — core brand element
- `.reveal::after` (bottom rule) — core brand element
- The `$brand-*` color variables in `custom.scss`
- The `footer:` value in `_quarto.yml` without asking
- `controls: false` in `_quarto.yml` — navigation arrows are disabled intentionally

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

---

## File structure

| File                  | Purpose                                                         |
|-----------------------|-----------------------------------------------------------------|
| `template.qmd`        | Starting point — copy via `new-presentation.sh`, then edit      |
| `custom.scss`         | All styles — only file to edit for visual changes               |
| `_quarto.yml`         | Quarto config — rarely needs editing                            |
| `build.sh`            | Render HTML + produce PDF in one command (`./build.sh`)         |
| `new-presentation.sh` | Scaffold a new talk (`./new-presentation.sh <dir> "Title"`) |

`template.qmd` includes one example of every key slide pattern. When building a new presentation,
copy via `new-presentation.sh`, keep the slides you need, replace placeholder content.

---

## Slide-type catalog — intent → pattern

| Goal / User says…                                  | Pattern to use                              |
|----------------------------------------------------|---------------------------------------------|
| "Introduce the talk / agenda"                      | Overview slide (60/40, topics + note)       |
| "Show where materials are / links"                 | Resources & Materials slide                 |
| "Wrap up / final slide"                            | Summary slide (takeaways + contact callout) |
| "Explain a concept with two sides"                 | Two-Column 50/50                            |
| "Main content + a callout on the side"             | Two-Column 60/40                            |
| "Compare two options / before vs after"            | Comparison slide (highlight/accent box)     |
| "Quick numbered list of steps"                     | `.steps` list, `{.slide-flow}` heading      |
| "Walk through a process with descriptions"         | Step-by-Step prose slide, `{.slide-flow}`   |
| "Show a diagram / screenshot with notes"           | Image + Caption (60/40)                     |
| "Quote a finding / cite a paper"                   | `.pull-quote` block (65/35)                 |
| "Show Python / R / code example"                   | Code block — language auto-labeled          |
| "Show a shell command"                             | Code block `.bash` — teal header            |
| "Show a command AND its output"                    | Code block + ` ```{.output} ` block         |
| "Compare code in two languages"                    | Two-column 50/50 with code blocks           |
| "Display key numbers / metrics"                    | `.stat-row` + `.stat-card`                  |
| "Feature comparison table"                         | Table + `.pill-yes/partial/no`              |
| "Highlight a single key result"                    | `.key-finding` box                          |
| "Highlight a takeaway"                             | `.highlight-box`                            |
| "Warn about a gotcha"                              | `.callout-warning` or `.accent-box`         |
| "Cite a source on just this slide"                 | `::: footer` div at bottom of slide         |
| "Reveal bullets one at a time"                     | `. . .` fragments between bullet groups     |
| "Start a new major section"                        | `# Title {background-color="#1C6D72"}`      |

---

## Common tasks Claude can help with
- **New slide**: "Add a slide about X after slide Y" — pick the matching pattern above
- **Rewrite content**: "Rewrite the overview slide to cover A, B, C"
- **Add code example**: "Add a Python example showing X"
- **SCSS changes**: "Add a new utility class for X" — modify `custom.scss` only
- **Restructure**: "Move the resources slide to the end"
- **Render + review**: "Render and show me how slide N looks" — run `./build.sh`, screenshot
  with decktape, read the PNG images
