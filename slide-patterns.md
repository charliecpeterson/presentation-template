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
