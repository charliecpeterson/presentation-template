# Slide Content Design

How to design the *content* of a presentation: what goes on each slide, the
narrative arc, and what makes a slide actually worth reading. Load this file
when designing slide content, critiquing a deck, rewriting prose, or starting
a new presentation from a blank outline.

See `AGENTS.md` for project orientation and rendering. See `slide-patterns.md`
for markup, CSS classes, and layout palette — this file does not cover visual
implementation.

---

## Core philosophy

The goal is slides that have real substance. Every slide should earn its
place. If a slide doesn't add something the audience couldn't have inferred
from the slides before and after it, it shouldn't exist.

**What this guide produces:**
- Slide-by-slide content with actual specifics
- A narrative arc across the whole deck
- Honest feedback about where content is thin or padded
- Concrete suggestions for what the user could add to strengthen weak slides

**What this guide avoids:**
- Corporate filler ("In today's fast-paced world…")
- AI-sounding constructions (see anti-patterns below)
- Padding to hit a slide count
- Slides that sound like a mission statement rather than a point

---

## The content standard

Every slide must meet this bar: **a reader who skims the slide should walk
away knowing something specific.**

Not a vibe. Not a category. A specific thing.

Bad slide: "Our platform is built for scale and reliability."
Good slide: "Handles 40M events/day on 3 nodes. No database. No message queue."

Bad bullet: "Improved developer experience"
Good bullet: "Cut onboarding time from 3 days to 4 hours by replacing the config system"

If a slide can't be made specific because the user doesn't have the data yet,
flag it explicitly and ask what they know. Don't invent specifics. Don't pad.

---

## Writing rules

These apply to all slide content.

**Voice:**
- Write the way a sharp person actually talks when they know their material
- Direct subject-verb-object sentences. Cut filler words.
- First person or second person is fine. Third person corporate narration ("The team leverages…") is not.
- Contractions are fine

**Punctuation:**
- No em dashes as a stylistic device. Use a period or a colon instead.
- Standard punctuation for slide content (periods, commas, colons, semicolons)
- Ellipses only if quoting someone

**Emoji:**
- Default to no emoji in slide content. Slides are not Slack messages.
- If the user's context makes emoji appropriate (casual internal talk, developer conference with a light tone), one per slide at most, and only where it's doing real work, not decorating.
- Never use emoji as bullet markers or to open a section header. That's visual noise, not design.
- Never use emoji to signal enthusiasm ("🚀 We're launching…", "✅ Key takeaway"). If the content is good, it doesn't need decoration.

**Structural anti-patterns to avoid:**
- Lists of three for rhythm ("fast, reliable, and scalable" — what does this mean?)
- Rhetorical question payoffs ("So what does this mean for you?")
- Fake dramatic fragments ("The result? Unprecedented growth.")
- Soft intensifiers ("quite", "really", "very", "fairly", "somewhat")
- Hedging openers ("It's worth noting that…", "It's important to understand…")
- "Not X, it's Y" constructions
- "Seamless", "robust", "leverage", "synergy", "unlock value", "move the needle"
- "Game-changer", "revolutionize", "transformative", "cutting-edge"
- Numbered insights ("3 Key Takeaways")

**Bullet rules:**
- Bullets must be substantive. Each bullet should contain a claim or a fact, not a category label.
- If a bullet can't be written without being vague, it means the underlying content isn't ready. Flag this.
- Parallel structure is fine if it's natural, not forced.
- 3–5 bullets per slide max. If you have more, split the slide or cut.

---

## Workflow

### Step 1 — Understand the presentation

Before writing any slide content, ask or extract:

1. **Topic and audience** — What is this about, and who is sitting in the room?
2. **Goal** — What should the audience think, feel, or do differently after seeing this?
3. **Format** — Conference talk? Internal team update? Customer pitch? Demo?
4. **Length** — How many slides or how many minutes?
5. **What they already have** — An outline? A rough draft? Just a topic?

If the user has already provided this context, don't re-ask. Use it.

### Step 2 — Build or review the structure

Before writing slide content, get the structure right:

- An opening that establishes why the audience should care (not "About Me" slides that run for 5 minutes)
- A logical narrative arc (not a list of disconnected topics)
- A clear landing point — what is the last thing the audience hears/reads?

If the user already has a structure, critique it. Flag slides that are
redundant, out of order, or missing.

### Step 3 — Write slide content

For each slide, produce:

**Slide title** — A declarative statement, not a noun phrase.
- Good: "Latency dropped 60% after we dropped the ORM"
- Bad: "Performance Improvements"

**Slide body** — The actual content: bullets, a key stat, a quote, a diagram description, code snippet description, or a single strong sentence.

**Layout assignment** — A pattern from the intent table in `AGENTS.md`. Don't default to full-width bullets on every slide. Varying layouts across the deck keeps the audience visually engaged.

**Substance check** — After each slide or section, note honestly whether the content is solid or relying on vague claims.

**What to add** — If a slide is thin, say so directly and list what specific information would make it stronger. Don't pad to compensate. Ask.

### Step 4 — Flag and prompt for missing substance

This is the most important step. When content is thin:

- Say it plainly: "This slide is making a claim without evidence. Do you have a specific number, example, or case that backs this up?"
- Suggest what kind of evidence would work: "A before/after metric, a specific user quote, or a concrete example would make this land."
- Never invent the missing content. Never soften the critique.

### Step 5 — Deck-level review

Once all slide content exists, do a full pass across the whole deck. This is
separate from the per-slide substance check. Look at the deck as a sequence,
not a collection.

**Flow:** Does each slide follow logically from the one before it? If you removed a slide, would the audience notice the gap? Flag any slides that feel disconnected or could be reordered without changing anything.

**Engagement arc:** Where does attention peak? Where does it sag? A deck that stays at the same energy level throughout loses the room. There should be a build, at least one payoff moment, and a clean landing. Identify where the deck is flat and suggest what type of content (a concrete example, a visual, a surprising stat, a demo moment) would re-engage.

**Transitions:** Flag slide pairs where the jump is abrupt. A transition problem usually means one of three things: a slide is missing in between, the order is wrong, or the title of one of the slides isn't doing its job. Suggest the fix specifically, not generically ("add a transition slide" is not useful — say what that slide should say).

**Redundancy:** Flag any slides that are making the same point twice in different words. Pick the stronger one. Cut the other or merge them.

**Pacing:** For timed talks, flag sections that look too dense for the time allocated. A technical deep-dive that would take 8 minutes crammed into a 2-minute slot is a structural problem, not a content problem.

Output the deck review as a separate section after the slide content:

```
## Deck Review

**Flow:** [What works, what doesn't, specific slide numbers]
**Engagement:** [Where it's strong, where it sags, what to try]
**Transitions:** [Specific pairs that are abrupt, suggested fixes]
**Redundancy:** [Any slides making the same point, recommendation]
**Pacing:** [If timing is relevant, any density issues]

**Priority fixes:** [Ranked list of the 2-3 changes that would most improve the deck as a whole]
```

If the deck is in good shape, say so. Don't manufacture critique. But if there are real problems, name them clearly with slide numbers and specific suggestions.

### Step 6 — Visual QA after rendering

When the deck has been rendered (see `AGENTS.md` for the screenshot command),
review each slide's PNG and check:

- Does all text fit inside the slide without overflow? If not: reduce bullet count, drop font size class one level, or split the slide.
- Is the image/figure/table large enough to read from the back of a room? If not: increase `width` or `max-height`, or move to a full-column layout.
- Do columns look balanced? A 60/40 with the 60 nearly empty and the 40 overflowing means the split is wrong.
- Does the callout or box fit without clipping?
- Is code readable? Blocks with more than ~12 lines need to be split or font-dropped to `.text-sm`.

**Suggest fixes, don't silently adjust.** If something doesn't fit, tell the user specifically what the problem is and offer options:

- "The image on slide 8 is too small to read in the 40% column. Options: move the image to 60% and the bullets to 40%, or use the Big Screenshot layout (55/45) instead."
- "Slide 12 has 8 bullets. It's overflowing the slide. Suggest: cut to the 4 most important, or split into two slides — first covering X, second covering Y."
- "The three-column layout on slide 6 is cramped. If the content can't be cut, consider splitting it into two 50/50 comparison slides instead."

Never make layout changes silently. Always present the issue and ask the user how they want to handle it.

---

## Slide templates by type

These are patterns for *content*, not visual layout. For visual markup, see `slide-patterns.md`.

### Problem slide
State the problem in concrete terms. Not "teams struggle with X" — describe what actually happens when the problem occurs. Symptoms. Costs. Who feels it.

### Solution slide
Lead with the mechanism, not the benefit. What does it actually do, and how? Benefits follow from that.

### Results / proof slide
Specific numbers, real comparisons, before/after. If you don't have numbers, use a specific customer story with a named outcome.

### Technical deep-dive slide
Pick one thing to explain. Don't try to show the whole system. Show the interesting part. A good diagram description or annotated code excerpt beats a wall of bullets.

### Call to action slide
One ask. Concrete. With a clear next step (link, email, repo, sign-up, etc.)

---

## Anti-patterns reference

| Pattern | Why it's bad | Fix |
|---|---|---|
| "It's important to note…" | Implies the rest isn't important | Just say the thing |
| "Seamless integration" | Meaningless without specifics | Describe the actual integration |
| Em dash as a stylistic pause | AI tell, reads as performed writing | Use a period or colon |
| Three-word list for rhythm | Sounds like marketing copy | One strong specific beats three vague ones |
| Rhetorical question setup | Lazy structure | State the answer directly |
| "Not X, it's Y" | Overused contrast device | Just say Y |
| Dramatic fragment | "The result?" | Roll it into the preceding sentence |
| Soft intensifier | "quite significant" | "significant" or give the number |
| Category bullet | "Improved performance" | "Query time: 800ms to 120ms" |
| Emoji as bullet markers | Visual noise, not design | Use plain bullets with substantive text |
| Emoji for enthusiasm | "🚀 We're launching" | Let the content carry the energy |

---

## Output format

When producing slide content, use this format:

```
## Slide N: [Declarative title] {.optional-icon-class}

**Layout:** [Name from the intent table in AGENTS.md, e.g. "Two-column 60/40 with callout-tip"]

[Body content for that layout]

**Substance check:** [Honest, specific assessment]
**Could add:** [What would make it stronger, if anything]
```

Group slides into sections if the deck has a natural arc. After all slides, append the `## Deck Review` block from Step 5.

---

## Tone calibration by audience

**Technical audience (engineers, researchers):**
- Mechanism first, benefits second
- Specifics over summaries
- It's fine to leave things unexplained if the audience knows them

**Executive / business audience:**
- Outcome first, then evidence
- Still specific — just use business metrics instead of technical ones
- Cut jargon, not substance

**Mixed audience:**
- Lead with the outcome
- One slide of technical proof, clearly labeled
- Avoid assuming shared vocabulary

---

## Quick-start prompts

If the user is starting from scratch, run through these four questions:

1. What's the one-sentence version of what you want the audience to know by the end?
2. What do they probably believe right now that you want to change?
3. What's the most surprising or counterintuitive thing you're going to say?
4. What's the single strongest piece of evidence you have?

The answers to these four questions contain the skeleton of a good talk.
