# Slide Patterns Reference

Layout palette, CSS classes, components, and brand colors for the Quarto
presentation template. Load this file when authoring or modifying slide
structure or visuals.

See `AGENTS.md` for project orientation, rendering, and the intent → pattern
dispatch table. See `content-design.md` for what to *write* on slides
(narrative arc, anti-patterns).

This file is the source of truth for slide markup. Keep it in sync with
`template.qmd` and `custom.scss` — when a class is added, renamed, or
removed there, update this file in the same commit.

---

## Style & layout rules

### Font sizes — always use CSS classes, never inline styles

| Class      | Size   | When to use                             |
|------------|--------|-----------------------------------------|
| `.text-xs` | 0.62em | Dense tables, fine print, attribution   |
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

For an appendix/parking-lot of slides kept out of the main flow but still
shippable, use `{visibility="uncounted"}` instead (on both the `#` divider and
each `##` slide). Uncounted slides render, stay navigable, and ship in the PDF —
they just don't count toward the `c/t` slide number. See the `# Extra Slides`
section at the end of `template.qmd`.

### Code blocks

Always specify the language: ` ```{.python} `, ` ```{.bash} `, ` ```{.r} `

The terminal chrome header bar (e.g. `$ _  BASH`, `>>>  PYTHON`) is automatic — no extra markup needed.
Language labels come from the code fence class.

For terminal output (dark background, green text), use ` ```{.output} `. This signals "what the user
sees in the terminal", not code to type.

Long lines **wrap** at word boundaries rather than scrolling sideways — no horizontal scrollbar to
fight on a slide (reveal's own `white-space: pre` is overridden in `custom.scss`; `code-overflow: wrap`
alone doesn't win). The copy button is always-on (`code-copy: true`), styled as a white chip with a
teal clipboard icon sitting just below the language-header bar — visible on both light code blocks and
the dark `.output` block.

**Progressive highlight** — walk a block one region per click instead of splitting it across slides:

````markdown
```{.bash code-line-numbers="1-2|4|6-9"}
...
```
````

`|` separates click steps; `1-2` is a range, `5` a single line, `8,10` a list. The whole block stays
visible while you spotlight one part.

**Auto-animate** — put `{auto-animate=true}` on two consecutive `##` slides and reveal *morphs*
matching elements (code, boxes, images, text) from the first into the second — e.g. a command that
grows line by line, a box that moves/resizes. Keep the two titles identical so only the body animates.
In PDF export the two slides render as separate start/end frames.

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

For a **research talk**, this is the citation pattern: put the paper a figure or
result came from in `::: footer` and repeat the same citation on every slide of
that section, so the source is always visible where the figure is. It renders
below the brand rule, small, and overrides the global footer for that slide.

### Scientific notation & math

No setup needed — MathJax ships with revealjs and sub/superscript are on by default
(with `self-contained: true` it all renders offline):

```markdown
Water is H~2~O; the actinyl ion is AnO~2~^2+^.          <!-- ~sub~  ^super^ -->

Inline: the gap is $\Delta G = 8$ kcal/mol.            <!-- $…$ -->
Arrow: An^3+^ + 3 R^-^ $\rightarrow$ AnR~3~.

$$ M_{ij} = \frac{Z_i Z_j}{R_{ij}} \quad (i \neq j) $$  <!-- $$…$$ display -->
```

### Acknowledgments slide

A 60/40 columns slide near the end: collaborators (with affiliations) on the left,
funding/grants on the right, a one-line thanks above. Standard close for a research
talk, before the Questions slide. See the example in `template.qmd`.

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

Renders as `01 / 02 / 03` teal counters beside each step. Use with `{.slide-flow}` heading class.

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

### Scroll box (long code / transcripts)

```markdown
::: {.scroll-box}
` ```python
# a long file the audience can scroll through and copy
... `
:::
```

Caps the block at a fixed height and scrolls inside it, so a full `SKILL.md`,
a long transcript, or a big output block stays on one slide. Variants:
`.scroll-box.tall` (600px), `.short` (340px), `.shorter` (265px). For content
shown as *rendered markdown* (headings, tables) rather than a code fence, use
`.scroll-box.prose` — the box itself scrolls and gets a bordered card.

The box has exactly one scrollbar (vertical, branded teal): code wraps instead
of scrolling sideways, and global slide-scroll is off, so there's no second bar.
Keep a scroll-box slide sparse — title + box, little else — so the box is the
only thing that needs to scroll. If a slide genuinely needs the *whole* slide to
scroll, add `{.scrollable}` to that `##` heading (it's off by default).

### Compact table (dense matrices)

```markdown
::: {.text-xs}
::: {.table-compact}
| App | Feat A | Feat B | ... |
|-----|--------|--------|-----|
...
:::
:::
```

For ~20+ row tables that overflow at normal size. Wrap inside a `.text-xs`
div; `.table-compact` tightens padding and font further.

### Annotated screenshot

```markdown
::: {.annotated-shot}
<img src="assets/screenshot.png" style="max-width:100%; max-height:540px;">
[Step 1: open the panel]{.shot-label style="left:8%; top:18%;"}
[**Result** appears here]{.shot-label style="left:55%; top:70%;"}
:::
```

Positions teal label chips in percent coordinates over an image so they track
it as it scales. Use `**bold**` inside a label for a cyan-highlighted key term.

### Swap in place (r-stack)

```markdown
::: {.r-stack}
::: {.fragment .fade-out fragment-index=0}
<img src="assets/before.png">
:::
::: {.fragment .fade-in-then-out fragment-index=0}
<img src="assets/after.png">
:::
:::
```

Stacks its children in the same spot; the fade fragments toggle between them on
click (A fades out as B fades in, same `fragment-index`). Use for before/after,
A-vs-B comparisons, or layering diagram steps. Works with images, cards, or
`.scroll-box` code blocks. All reveal.js built-ins — no custom CSS. For more
than two states, give each a successive `fragment-index` and the matching
`.fade-in-then-out`. Note: fragments inside an r-stack flatten in PDF export
(decktape shows the layers overlapping), so keep the swap optional to the point.

### Speaker notes

```markdown
::: {.notes}
What to say here — not shown on the slide.
:::
```

Visible only in presenter view (press `s` during the talk); hidden on the slide
and in PDF. Use for delivery cues, not content the audience needs to see.

### Free-form placement (.absolute)

```markdown
![](assets/personal/cat-padfoot.jpg){.absolute top=120 right=40 width="300"}
![](logo.png){.absolute bottom=20 left=40 width="200"}
```

Places an element at exact slide coordinates (`top`/`bottom`/`left`/`right` in px,
plus `width`/`height`), independent of the normal flow. Use for a logo/ecosystem
wall (several logos scattered across a slide), overlapping elements, or pinning a
small photo in a corner. reveal.js built-in — no custom CSS. Coordinates are on
the 1280×720 canvas; keep elements clear of the sidebar stripe (left ~45px) and
the bottom rule (below ~52px).

### Reusable personal photos

Cats, hedgehog, and a photo of me live in `assets/personal/` (see its README).
Reference with `<img src="assets/personal/cat-orange.jpg" ...>`. The closing
slide pattern uses one by default — the running joke is a cat on the final slide.

---

## Slide authoring guidelines

- Keep bullets to 4–6 items max per column
- Pair a list with a callout or image on most slides — avoid full-width bullet dumps
- **Never use emoji in `##` headings** — use the custom SVG icon classes below instead, or no class
- Emoji are acceptable in bullet list items only when genuinely semantic (e.g. ✅ for done)
- Wrap most slide content in `{.text-md}` unless the slide is sparse

### Heading icon classes — append to `## Title {.class}`

| Class              | Icon           | Use for                                       |
|--------------------|----------------|-----------------------------------------------|
| `{.slide-code}`    | `>_` terminal  | CLI commands, code examples, API usage        |
| `{.slide-data}`    | bar chart      | results, benchmarks, performance tables       |
| `{.slide-compute}` | CPU chip       | hardware, resource allocation, GPU specs      |
| `{.slide-flow}`    | `>>` chevrons  | workflow, setup steps, numbered process       |
| `{.slide-cluster}` | node triangle  | distributed, multi-node, parallel computing   |
| *(none)*           | vertical bar   | general content — default for anything else   |

Assign the icon by content type. Most slides use the default (no class).

---

## Brand colors (do not change these)

| Variable        | Hex       | Use                             |
|-----------------|-----------|---------------------------------|
| `$brand-cyan`   | `#6AD1E3` | Sidebar gradient, callout-note  |
| `$brand-green`  | `#21A364` | Sidebar gradient, callout-tip   |
| `$brand-teal`   | `#1C6D72` | Section BG, h3, highlight-box   |
| `$brand-dark`   | `#2a2a2a` | Body text                       |
| `$brand-accent` | `#E35B6A` | Warnings only (accent-box)      |
| `$brand-link`   | `#0066cc` | Hyperlinks                      |

---

## Layout variety — engagement rule

Don't use the same layout more than two slides in a row. A monotonous deck
loses the room even if the content is good. When writing slide content, note
the suggested layout for each slide and flag if the deck has a long run of
the same pattern.

Good layout variety across a 10-slide section: 60/40 content → comparison A/B
→ code slide → image + bullets → pull quote → metrics → steps → 60/40 content
→ full-width statement → 50/50.
