# Design system

The values LORIS styles itself with live in [`htdocs/css/tokens.css`](../htdocs/css/tokens.css),
which every page loads. This document says what is in there and how to use it. See
[CodingStandards.md](CodingStandards.md) for language conventions.

## Never hardcode a value

Colours, spacing and radii come from `tokens.css`. If no token fits, add one.

```css
/* No */
.thing { background: #eaf1f8; border-radius: 4px; padding: 8px; }

/* Yes */
.thing {
    background: var(--accent-fill);
    border-radius: var(--radius);
    padding: var(--space-md);
}
```

## Names

Every token is named for the job it does (`--accent`, `--border`, `--text-muted`). Repointing one
restyles everything that plays that part. The colours below are the ones the tokens draw from, and
a value outside them means LORIS has a new colour.

Every hue has three steps, and the token names say which:

| Strength | What it is | Used for |
|---|---|---|
| **solid** | The colour itself | A border, an icon, a filled button, text |
| **fill** | A tint you can see is coloured | The ground something sits on: a selected row, a tag |
| **highlight** | Barely there | Hover |

The blue carries two more than the others, a pressed step and a border step, because it is the only
hue with a border of its own. The red carries a pressed step too.

## Colour

`htdocs/bootstrap/css/custom-css.css` carries a header called "Loris color palette v.0.1" declaring
two blues and an orange, in a comment where no code can reference it. These are those values, with
the steps the interface needs around them.

### Blue, the primary

| | Token | Hex | Used for |
|---|---|---|---|
| ![](images/palette/blue-900.svg) | `--accent-strong` | `#042d54` | Pressed |
| ![](images/palette/blue-700.svg) | `--accent` | `#064785` | Navigation, panel headings |
| ![](images/palette/blue-500.svg) | `--accent-border`, `--info-edge` | `#246eb6` | Borders, the focus ring, the edge of a sky control |
| ![](images/palette/blue-100.svg) | `--accent-fill` | `#e4ebf2` | Fill, selected row |
| ![](images/palette/blue-50.svg) | `--accent-highlight` | `#f3f6f9` | Highlight, hovered row |

### Sky, the information colour

The navy's hue carried light and saturated.

| | Token | Hex | Used for |
|---|---|---|---|
| ![](images/palette/sky.svg) | `--info` | `#a6d3f5` | Help, notices, a standing rule, a switch that is on |
| ![](images/palette/sky-100.svg) | `--info-fill` | `#d4eafa` | Information ground |
| ![](images/palette/sky-50.svg) | — | `#ecf6fd` | Information highlight |

### Orange, the secondary

Marks a state the interface is passing through, or one governing what other actions will do.

| | Token | Hex | Used for |
|---|---|---|---|
| ![](images/palette/orange.svg) | `--secondary`, `--warning` | `#e89a0c` | Active border, warning |
| ![](images/palette/orange-100.svg) | `--secondary-fill` | `#fcf3e2` | Active ground |
| ![](images/palette/orange-50.svg) | — | `#fefaf2` | Active highlight |

### Purple, categorical

Carries no fixed meaning, so it is what tells categories apart where blue and orange are spoken for.

| | Token | Hex | Used for |
|---|---|---|---|
| ![](images/palette/purple.svg) | — | `#690096` | Categorical |
| ![](images/palette/purple-100.svg) | — | `#f2e9f6` | Categorical ground |
| ![](images/palette/purple-50.svg) | — | `#f9f5fb` | Categorical highlight |

### Fixed meanings

| | Token | Hex | Meaning |
|---|---|---|---|
| ![](images/palette/green.svg) | `--success` | `#0f9d58` | Success |
| ![](images/palette/green-100.svg) | — | `#e5f4ed` | Success ground |
| ![](images/palette/green-50.svg) | — | `#f3faf7` | Success highlight |
| ![](images/palette/red-700.svg) | `--danger-strong` | `#963221` | Danger, pressed |
| ![](images/palette/red.svg) | `--danger` | `#c0402a` | Error, danger |
| ![](images/palette/red-100.svg) | — | `#f8eae8` | Error ground |
| ![](images/palette/red-50.svg) | — | `#fcf6f4` | Error highlight |
| ![](images/palette/orange.svg) | `--secondary`, `--warning` | `#e89a0c` | Warning |
| ![](images/palette/sky.svg) | `--info` | `#a6d3f5` | Information |

### Grey

| | Token | Hex | Used for |
|---|---|---|---|
| ![](images/palette/grey-800.svg) | `--text` | `#333333` | Text |
| ![](images/palette/grey-600.svg) | `--text-muted` | `#666666` | Muted text |
| ![](images/palette/grey-500.svg) | `--text-faint`, `--control-off` | `#999999` | Faint text |
| ![](images/palette/grey-300.svg) | `--border`, `--text-disabled` | `#cccccc` | Borders and dividers |
| ![](images/palette/grey-150.svg) | `--border-subtle` | `#efefef` | Subtle border |
| ![](images/palette/grey-50.svg) | `--surface-sunken` | `#f8f8f8` | Sunken ground |
| ![](images/palette/white.svg) | `--surface` | `#ffffff` | Surface |

## The three states

| State | Role | Says |
|---|---|---|
| **Hover** | `--state-hover` | Where the pointer is |
| **Selected** | `--state-selected`, `--state-selected-solid` | What is chosen |
| **Active** | `--state-active`, `--state-active-solid` | Something being passed through, about to change on release |

Selected is a settled choice: a ticked row in a dropdown. Active is a state the interface passes
through, such as the run a drag is sweeping over before the pointer comes up. A rule that is merely
standing is neither, it is information and takes the sky.

A button has no selected state. Its hover moves the outline and the label and leaves the ground where
it is.

## Colour that carries meaning

**Never let colour be the only difference.** The state grounds sit close together on purpose, and
they work only because something else carries the meaning: a bar down the left edge of a selected or
active row, a ticked control, a thumb at the other end of a track. Remove the colour and the
interface still says the same thing.

**A light solid is not a text colour.** Text goes on the pale fills, which is what keeps it
readable. The orange and the sky are grounds and marks.

**A pale control needs an edge.** A control drawn in the sky or a light grey cannot be found against
a white page on its own, so it carries an edge in a colour that can: `--info-edge`,
`--control-off-edge`. Draw the ring with `inset` so turning a control on moves nothing.

**Two states must never differ in hue alone.** The sky and the light grey it replaced are the same
brightness, so on and off said nothing to a reader who cannot separate the hues. Change the lightness
too.

If a value cannot meet these, change it in `tokens.css` so everything moves together.

## Type

| Token | Face | Used for |
|---|---|---|
| --font-family | The operating system's own interface face | Labels, descriptions, buttons, headings |
| --font-family-mono | The system monospace | Identifiers |

Monospace marks a value someone might copy or transcribe: PSCIDs, DCCIDs, visit labels, barcodes,
filenames and paths. Not field names, not counts, not anything read as a sentence.

## Where styles live

| What | Where |
|---|---|
| Values shared by more than one component | `htdocs/css/tokens.css` |
| A component's own appearance | A stylesheet beside it, imported by it |
| A module's own layout | `modules/<module>/css/`, imported by the JSX |
| Anything with a `:hover`, `:focus` or `:disabled` state | A stylesheet, never an inline style |

Inline styles cannot express states or media queries. Use them for values computed at runtime.

## Bootstrap

LORIS is built on Bootstrap 3, which has had no security patches since 2019. It stays, because
removing it touches every module, but new components do not build on it. Give a new component its own
appearance from tokens.

Borrowing a bootstrap class and laying it out differently also puts you in a specificity fight:
`.form-control` sets `display: block`, `.input-group` sets `display: table` and
`.list-group-item.active` sets `z-index: 2`, each beating an equally specific rule of your own on
source order. Qualify with the element, as in `button.my-trigger`, rather than reaching for
`!important`.

## Still open

1. Whether the blue's role is the primary or the accent. The palette calls it the primary, and
   `tokens.css` names it `--accent`.
2. A density scale. Control heights are inherited at 34px rather than chosen.
3. Whether the information colour is right for help text and notices as well as for standing rules.
4. Whether the purple takes anything beyond categories.
5. The hardcoded orange hover in the navbar dropdowns at the top of `custom-css.css`. It is right on
   the dark navbar, but those menus open on white where it has too little contrast to read.
