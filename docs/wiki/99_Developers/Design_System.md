# Design System

## Overview

This document describes the design tokens used to style LORIS and the conventions
for using them. The tokens are defined in [`htdocs/css/tokens.css`](../../../htdocs/css/tokens.css),
which is loaded on every page. For language conventions, see
[CodingStandards.md](../../CodingStandards.md).

## Tokens

Colours, spacing and border radii should come from `tokens.css` rather than being
hardcoded. If no existing token fits, a new one should be added to `tokens.css`.

```css
/* Avoid */
.thing { background: #eaf1f8; border-radius: 4px; padding: 8px; }

/* Prefer */
.thing {
    background: var(--primary-fill);
    border-radius: var(--radius);
    padding: var(--space-md);
}
```

Components use roles, which are named for what they are used for (`--primary`,
`--border`, `--text-muted`) rather than for their value, so changing a role restyles
everything that uses it. Each role points at a step of a numbered scale, described
under Colours.

## Colours

Colour comes in two layers. The scales are the palette: the brand, two notice
colours (amber for warnings, sky for information), nine hues and grey, each with
five numbered steps. The roles say what a colour means (`--primary`, `--danger`,
`--state-selected`) and each one points at a step.
Components use the roles. A colour that means a state, such as an error or a
selected row, uses a role; a colour that only tells categories apart, such as one
tag per project, uses a hue directly.

Visualizations take their colours from the same hues, such as the electrode and
sensor colours in the electrophysiology browser, so a chart reads the same in every
module. A visualization that needs a colour the hues do not have, even a slight
variation, gets it added to the palette so other modules can use it too.

### Steps

Every scale runs from light to dark. Each step has one job in every scale, and the
contrast that job needs:

| Step | Used for | Contrast |
|---|---|---|
| 1 | Backgrounds: a notice, a tag | `--text` on it is at least 4.5:1 |
| 2 | Row states: a selected, active or open row | `--text` and the scale's step 5 on it are at least 4.5:1, and it shows against white |
| 3 | Decoration: tag outlines, decorative borders, chart marks on a dark background | None, so a light hue shows here at its brightest |
| 4 | Anything that must be seen on white: icons, filled buttons, navigation, field borders, chart marks on a light background | At least 3:1 against white and against step 1 |
| 5 | Text in that colour, pressed states | At least 6:1 against white, and 4.5:1 against steps 1 and 2 |

To pick a step, find what is being drawn and where:

| Drawing | On | Step |
|---|---|---|
| A tag | Any surface | 1 background, 3 outline, 5 text |
| A notice | Any surface | 1 background, 4 border, 5 heading |
| A row in a state | The table | 2 background, 4 bar on its left edge |
| A chart mark, line or bar | White or a light surface | 4, or 5 for a second series in the same hue |
| A chart mark, line or bar | A dark surface | 3 |
| An icon or a field border | White or a light surface | 4 |
| Text | White or steps 1 and 2 | 5 |

WCAG asks for 3:1 only where colour is needed to understand something, such as a
chart series told apart by colour or the edge of a field. A tag's outline is
decoration, since its label carries the meaning, so step 3 has no contrast duty.

The roles keep the same suffixes in every colour: none and `-border` for step 4,
`-strong` for step 5 and `-fill` for step 1. Hover uses grey step 1 and the other
state tokens use step 2.

| Role | Scale |
|---|---|
| `--primary` | Brand |
| `--info` | Sky |
| `--warning` | Amber |
| `--success` | Green |
| `--danger` | Red |
| `--text`, `--border`, `--border-strong`, `--border-subtle`, `--surface-sunken` | Grey |

LORIS's brand navy comes from the "Loris color palette v.0.1" in the header of
`htdocs/bootstrap/css/custom-css.css`, and so does amber, its orange. Amber and sky
are kept for warnings and information, so a notice never looks like a category; the
hues include a separate, redder orange and a teal set apart from sky. The greys are
LORIS's existing grey scale.

Each hue is a chosen colour and, for its darker steps, an angle and a limit on how
vivid they get, all worked out in OKLCH. Step 4 is the chosen colour when it reaches
3:1 against white. A lighter colour (amber, orange, yellow, teal, sky) takes the
lightest shade of itself that does, and keeps its own bright colour as step 3; in
every other hue, step 3 sits halfway between step 2 and step 4. Step 5 is the
lightest shade that reaches 6:1. Step 1 is a faint tint at one lightness for every
hue and step 2 a stronger tint. Warm hues lean towards red in their darker
steps and towards yellow in their tints, since they turn muddy at their own angle.
The hues are chosen so that no two are close at steps 4 and 5, checked with normal
vision and with the three common kinds of colour blindness. Nine hues is near the
limit that stays apart, so a chart should not need all of them, and a tag always
carries its label.

A colour that is not in these tables should be added here and to `tokens.css`
before it is used, with every pairing checked against the rules under
Accessibility.

### Brand

Actions, navigation and panel headings. LORIS's brand is navy.

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/brand-1.svg) | `--brand-1` | `#fafcfe` | 1.03:1 | `--primary-fill` |
| ![](../../images/palette/brand-2.svg) | `--brand-2` | `#e7f1fe` | 1.14:1 | `--state-selected` |
| ![](../../images/palette/brand-3.svg) | `--brand-3` | `#9dbee8` | 1.92:1 |  |
| ![](../../images/palette/brand-4.svg) | `--brand-4` | `#064785` | 9.34:1 | `--primary`, `--primary-border` |
| ![](../../images/palette/brand-5.svg) | `--brand-5` | `#01376b` | 11.93:1 | `--primary-strong` |

### Amber

Warnings, and only warnings. Amber is LORIS's orange, so no category uses it.

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/amber-1.svg) | `--amber-1` | `#fffcf1` | 1.03:1 | `--warning-fill` |
| ![](../../images/palette/amber-2.svg) | `--amber-2` | `#fdf4d2` | 1.10:1 | `--state-active` |
| ![](../../images/palette/amber-3.svg) | `--amber-3` | `#e89a0c` | 2.32:1 |  |
| ![](../../images/palette/amber-4.svg) | `--amber-4` | `#cb7602` | 3.42:1 | `--warning`, `--warning-border` |
| ![](../../images/palette/amber-5.svg) | `--amber-5` | `#974c00` | 6.27:1 | `--warning-strong` |

### Sky

Information, and only information: help, notices, an open row and a toggle that is
on. No category uses it.

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/sky-1.svg) | `--sky-1` | `#f6fdff` | 1.03:1 | `--info-fill` |
| ![](../../images/palette/sky-2.svg) | `--sky-2` | `#daf6fc` | 1.13:1 | `--state-open` |
| ![](../../images/palette/sky-3.svg) | `--sky-3` | `#75dcf0` | 1.58:1 |  |
| ![](../../images/palette/sky-4.svg) | `--sky-4` | `#0396c6` | 3.40:1 | `--info`, `--info-border` |
| ![](../../images/palette/sky-5.svg) | `--sky-5` | `#02688b` | 6.26:1 | `--info-strong` |

### Red

Errors and danger buttons.

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/red-1.svg) | `--red-1` | `#fefbfa` | 1.03:1 | `--danger-fill` |
| ![](../../images/palette/red-2.svg) | `--red-2` | `#ffebe8` | 1.15:1 |  |
| ![](../../images/palette/red-3.svg) | `--red-3` | `#fda59a` | 1.90:1 |  |
| ![](../../images/palette/red-4.svg) | `--red-4` | `#cc1e1e` | 5.57:1 | `--danger`, `--danger-border` |
| ![](../../images/palette/red-5.svg) | `--red-5` | `#a92420` | 7.09:1 | `--danger-strong` |

### Orange

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/orange-1.svg) | `--orange-1` | `#fefbf8` | 1.03:1 |  |
| ![](../../images/palette/orange-2.svg) | `--orange-2` | `#fff0e6` | 1.11:1 |  |
| ![](../../images/palette/orange-3.svg) | `--orange-3` | `#f1840b` | 2.61:1 |  |
| ![](../../images/palette/orange-4.svg) | `--orange-4` | `#de6907` | 3.43:1 |  |
| ![](../../images/palette/orange-5.svg) | `--orange-5` | `#9e4801` | 6.21:1 |  |

### Brown

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/brown-1.svg) | `--brown-1` | `#fffbf6` | 1.03:1 |  |
| ![](../../images/palette/brown-2.svg) | `--brown-2` | `#fff1e0` | 1.11:1 |  |
| ![](../../images/palette/brown-3.svg) | `--brown-3` | `#dab79d` | 1.87:1 |  |
| ![](../../images/palette/brown-4.svg) | `--brown-4` | `#8d5b3a` | 5.69:1 |  |
| ![](../../images/palette/brown-5.svg) | `--brown-5` | `#7e4637` | 7.45:1 |  |

### Yellow

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/yellow-1.svg) | `--yellow-1` | `#fffbf4` | 1.03:1 |  |
| ![](../../images/palette/yellow-2.svg) | `--yellow-2` | `#ffe5ae` | 1.23:1 |  |
| ![](../../images/palette/yellow-3.svg) | `--yellow-3` | `#eab526` | 1.89:1 |  |
| ![](../../images/palette/yellow-4.svg) | `--yellow-4` | `#ad8405` | 3.45:1 |  |
| ![](../../images/palette/yellow-5.svg) | `--yellow-5` | `#7a5b01` | 6.32:1 |  |

### Green

Success.

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/green-1.svg) | `--green-1` | `#f4fff9` | 1.02:1 | `--success-fill` |
| ![](../../images/palette/green-2.svg) | `--green-2` | `#e1f6eb` | 1.13:1 |  |
| ![](../../images/palette/green-3.svg) | `--green-3` | `#8bc9ac` | 1.90:1 |  |
| ![](../../images/palette/green-4.svg) | `--green-4` | `#059669` | 3.77:1 | `--success`, `--success-border` |
| ![](../../images/palette/green-5.svg) | `--green-5` | `#006e4c` | 6.30:1 | `--success-strong` |

### Teal

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/teal-1.svg) | `--teal-1` | `#f5feff` | 1.02:1 |  |
| ![](../../images/palette/teal-2.svg) | `--teal-2` | `#cefaff` | 1.12:1 |  |
| ![](../../images/palette/teal-3.svg) | `--teal-3` | `#3bcddc` | 1.92:1 |  |
| ![](../../images/palette/teal-4.svg) | `--teal-4` | `#059aa6` | 3.40:1 |  |
| ![](../../images/palette/teal-5.svg) | `--teal-5` | `#036c75` | 6.17:1 |  |

### Blue

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/blue-1.svg) | `--blue-1` | `#fafcff` | 1.03:1 |  |
| ![](../../images/palette/blue-2.svg) | `--blue-2` | `#e8f1ff` | 1.14:1 |  |
| ![](../../images/palette/blue-3.svg) | `--blue-3` | `#9bbef4` | 1.90:1 |  |
| ![](../../images/palette/blue-4.svg) | `--blue-4` | `#1f5fc8` | 5.95:1 |  |
| ![](../../images/palette/blue-5.svg) | `--blue-5` | `#1251a6` | 7.63:1 |  |

### Purple

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/purple-1.svg) | `--purple-1` | `#fdfbff` | 1.03:1 |  |
| ![](../../images/palette/purple-2.svg) | `--purple-2` | `#f6ebfd` | 1.15:1 |  |
| ![](../../images/palette/purple-3.svg) | `--purple-3` | `#d7abf1` | 1.91:1 |  |
| ![](../../images/palette/purple-4.svg) | `--purple-4` | `#9137bb` | 6.06:1 |  |
| ![](../../images/palette/purple-5.svg) | `--purple-5` | `#79329b` | 7.66:1 |  |

### Pink

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/pink-1.svg) | `--pink-1` | `#fffafb` | 1.03:1 |  |
| ![](../../images/palette/pink-2.svg) | `--pink-2` | `#feeaef` | 1.15:1 |  |
| ![](../../images/palette/pink-3.svg) | `--pink-3` | `#f9a3bc` | 1.91:1 |  |
| ![](../../images/palette/pink-4.svg) | `--pink-4` | `#db2777` | 4.60:1 |  |
| ![](../../images/palette/pink-5.svg) | `--pink-5` | `#ae2d61` | 6.27:1 |  |

### Grey

| | Token | Hex | Contrast on white | Role |
|---|---|---|---|---|
| ![](../../images/palette/grey-1.svg) | `--grey-1` | `#f8f8f8` | 1.06:1 | `--surface-sunken`, `--state-hover` |
| ![](../../images/palette/grey-2.svg) | `--grey-2` | `#efefef` | 1.15:1 | `--border-subtle` |
| ![](../../images/palette/grey-3.svg) | `--grey-3` | `#cccccc` | 1.61:1 | `--border`, `--text-disabled` |
| ![](../../images/palette/grey-4.svg) | `--grey-4` | `#8f8f8f` | 3.23:1 | `--border-strong`, `--field-border`, `--control-off` |
| ![](../../images/palette/grey-5.svg) | `--grey-5` | `#333333` | 12.63:1 | `--text` |

Three grey roles sit outside the steps:

| | Token | Hex | Used for |
|---|---|---|---|
| ![](../../images/palette/text-muted.svg) | `--text-muted`, `--control-off-edge` | `#666666` | Muted text, the outline of a toggle that is off |
| ![](../../images/palette/text-faint.svg) | `--text-faint` | `#717171` | Faint text |
| ![](../../images/palette/surface.svg) | `--surface` | `#ffffff` | Backgrounds |

## States

| State | Tokens | Meaning |
|---|---|---|
| Hover | `--state-hover` | The pointer is over the element |
| Selected | `--state-selected`, `--state-selected-solid` | The element has been chosen, e.g. a checked option in a dropdown |
| Active | `--state-active`, `--state-active-solid` | The row is waiting for an action |
| Open | `--state-open`, `--state-open-solid` | The row whose panel is showing |

Hover is grey step 1 and the other states are step 2 tints, so a hovered,
selected, active or open row shows against white. The `-solid` tokens are for the
bar on the row's left edge.

Buttons do not have a selected state. On hover, a button's border and label change
colour and its background stays the same.

## Page chrome

The navbar is the darker navy, `--primary-strong`, so a filled primary button
stands apart from the bar above it. A hovered or open menu item turns white and
joins the menu that opens below it.

| Token | Draws from | Used for |
|---|---|---|
| `--chrome-bg` | `--primary-strong` | The navbar's background |
| `--chrome-text` | `--surface` | Its links and icons |
| `--chrome-hover` | `--surface` | A hovered or open menu item |
| `--chrome-hover-text` | `--primary-strong` | That item's text |

## Motion

| Token | Value | Used for |
|---|---|---|
| `--duration-fast` | 120ms | A small change in place: a caret turning, a label rising, a toggle's handle |
| `--duration-base` | 200ms | A short move or a small change of size: a column's width |
| `--duration-slow` | 300ms | A move across much of the screen: the filters, a side panel |
| `--ease` | `cubic-bezier(.4, 0, .2, 1)` | Every animation: it eases in and out, so nothing starts or stops abruptly |

Everything moves on the one curve, and the duration follows the distance: the further
something travels, the longer it takes. A change in size or position animates, so the
eye can follow what moved: a column eases to its new width, the filters grow from the
edge and push the rows aside, and a side panel slides in and back out from its edge.
Opening and closing move the same way. Colour and text changes do not animate, apart
from a field's label as it rises. Under `prefers-reduced-motion: reduce` every
transition and animation is turned off, and changes happen at once.

## Accessibility

Every pairing in this document meets [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA:
4.5:1 for text and 3:1 for borders, icons and chart marks. New tokens should meet it
too. Disabled text (`--text-disabled`) is the one exception, as WCAG allows for
inactive controls. A disabled control should say why it is disabled on hover, using
`aria-disabled` rather than `disabled`, which blocks hover in some browsers.

- Colour should never be the only way a state is shown. A selected or active row
  should also have a bar on its left edge, a checkbox should show a tick, and a
  toggle should move its handle.
- Two states should differ in lightness, not only in hue, so they can be told apart
  by someone who cannot distinguish the colours.
- Text in a colour should use its step 5 (`-strong`). White text reaches 4.5:1 on
  step 4 of the brand, red, brown, blue, purple and pink; a filled button in any
  other colour uses step 5 as its background.
- Chart marks on a light background and the borders of fields use step 4 or step 5;
  chart marks on a dark background use step 3.
- `--text-faint` meets 4.5:1 on `--surface` and `--surface-sunken` only. On a
  coloured tint, use `--text` or `--text-muted`.
- A field or control should have a border that meets 3:1 against white
  (`--field-border`, a step 4). `--border` and `--border-subtle` are for
  dividers, which do not need to.
- A control drawn in a light colour should have an outline so it is visible against
  a white page (`--info-border`, `--control-off-edge`). Use an `inset` box-shadow for
  the outline so the control does not change size when its state changes.

If a token's value does not meet these rules, the value should be changed in
`tokens.css` so the fix applies everywhere.

## Fonts

| Token | Font | Used for |
|---|---|---|
| `--font-family` | The operating system's default interface font | All text |
| `--font-family-mono` | The operating system's default monospace font | Identifiers |

The monospace font should be used for values someone might copy or type out:
PSCIDs, DCCIDs, visit labels, barcodes, file names and paths. It should not be used
for field names, counts or sentences.

## Where styles go

| What | Where |
|---|---|
| Values shared by more than one component | `htdocs/css/tokens.css` |
| A component's own styling | A CSS file next to the component, imported by it |
| A module's own layout | `modules/<module>/css/`, imported by the module's JSX |
| Anything with a `:hover`, `:focus` or `:disabled` state | A CSS file, not an inline style |

Inline styles cannot express states or media queries, so they should only be used
for values calculated at runtime.

## Bootstrap

LORIS uses Bootstrap 3, which stopped receiving security updates in 2019. Removing it
would affect every module, so it remains for now, but new components should not
depend on it and should take their styling from the tokens instead.

Reusing a Bootstrap class with a different layout leads to specificity conflicts.
For example, `.form-control` sets `display: block`, `.input-group` sets
`display: table` and `.list-group-item.active` sets `z-index: 2`, and each can
override a rule of equal specificity depending on load order. Qualify the selector with
the element (e.g. `button.my-trigger`) instead of using `!important`.
