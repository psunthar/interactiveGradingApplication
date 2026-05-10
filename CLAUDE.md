# Interactive Grading Application

A static, browser-only JS app for discovering natural grade boundaries from a class's marks. The deployed/working version lives in `stable_v1/`. Other directories (`beta_v_1.0`, `beta_v2ObjOriented`, `canvasExperiment`, `overlappingObjects`, `scratch`) are older experiments — **do not edit them when fixing the live app.**

`stable_v1/index.html` is the landing/docs page; the actual application is `stable_v1/home.html`.

## Stack

Plain HTML + CSS + ES5 JS. No build step, no package manager, no framework. Open `home.html` in a browser to run. Vendored libs: Chart.js 2.x, chartjs-plugin-annotation, chartjs-plugin-draggable, chartjs-plugin-zoom, jQuery (used only by the CSV exporter).

## The three "pages" (tabs)

`home.html` has one DOM with three sibling `<div>`s — `#divInput`, `#divStat`, `#divExport`. Tab switching just toggles `display`. There is no router.

| Tab | Header label | DOM | Switcher | Purpose |
|---|---|---|---|---|
| 1 | Input Data | `#divInput` | `tab1()` in `scripts/tab1.js` | Paste marks, pick grading scheme + parameters |
| 2 | Alter Bounds | `#divStat` | `tab2()` in `scripts/tab2.js` | Frequency-distribution chart with draggable grade-boundary lines |
| 3 | Statistics | `#divExport` | `tab3()` in `scripts/tab3.js` | Stats table + two pie charts (default vs. new) + CSV export |

Note the misleading IDs: **`#divStat` is tab 2 (chart)**, **`#divExport` is tab 3 (Statistics)**. The Statistics tab the user is asking about is `#divExport`, populated by `obj.getStats()` → `obj.showStats()` → `obj.showPieStats()`.

## Core object model

Everything hangs off a single global `obj = new MyInstance()` created in `scripts/script.js` on `window.onload`. `MyInstance` is defined in `scripts/MyInstance.js` (~800 lines, holds nearly all logic).

Key state on `obj`:

- `Data` — array of parsed numeric marks
- `dataFrequency` — histogram, length `maxPossible+1`, indexed by integer mark
- `gradeMode` — `"iitbDefault" | "iitbAbsolute" | "custom" | "custom2"` (the `<option>` labelled "Equi-Partition" has value `"custom"`; the one labelled "Custom" has value `"custom2"`)
- `gradeCount`, `gradeLabels[]`, `gradeCredits[]`
- `gradeValuesFixed[]`, `gradeValuesMovable[]` — the **boundaries**, length `gradeCount - 1` (N grades have N-1 internal cutoffs). `Fixed` is the original computed set; `Movable` is what the user has dragged to.
- `gradeFrequencyStatic[]`, `gradeFrequencyDynamic[]` — per-grade student counts under fixed vs. movable bounds, length `gradeCount`
- `myAnnotationsFixed[]`, `myAnnotationsMovable[]` — Chart.js annotation configs that mirror the boundary arrays
- `myChart`, `pie1`, `pie2` — Chart.js instances

## Statistics tab — functions to look at when fixing math

All in `scripts/MyInstance.js`:

- `getGradeFrequency(positions)` (lines ~746–773) — bins `Data` into grades. Uses half-open intervals `[prev, cur)` with one extra final bin for `>= last cutoff`. **This is where most boundary-inclusion bugs live.** Note the loop assumes `Data` is sorted and walks it once with a moving `index`; the `>=min` check is redundant given that, but the `cumSum` tail-push is what defines the top bin.
- `getStats()` (lines ~607–623) — refreshes `gradeValuesMovable` from the live annotation positions, then calls `getGradeFrequency` twice (fixed + movable).
- `showStats()` (lines ~692–742) — fills `#statsTable`. **Mutates `gradeValuesFixed` / `gradeValuesMovable` in place** (`unshift(-Infinity)` and append `Infinity`) to render Lower/Upper bound columns, then `shift()`/`pop()`s them back at the end. If you `return` early or throw between those mutations, state corrupts. Calls `getAverageGPA` for the avg-GPA row.
- `getAverageGPA(gradeDist)` (lines ~776–791) — `wsum / student_count`, where `student_count` includes the F bin (credits 0). Standard definition, but verify when you change frequency math.
- `showPieStats()` (lines ~628–690) — two pie charts from `gradeFrequencyStatic` / `gradeFrequencyDynamic`.

Boundaries are computed earlier in `confirmData()` (same file). Per-mode:

- `iitbDefault` — 9 grades `[FF, DD, CD, CC, BC, BB, AB, AA, AP]`, 8 cutoffs evenly spaced from `0.4 * refValue` (pass) to `refValue` (AA/AP).
- `iitbAbsolute` — fixed `[30, 40, 50, 60, 70, 80, 90, 100]`.
- `custom` (Equi-Partition) — has the expression `var delta = ( (this.max-this.min) / this.gradeCount+1 )` which is `(max-min)/gradeCount + 1` due to JS precedence, almost certainly intended to be `(max-min)/(gradeCount+1)`. Flag this to the user before changing — it's outside the Statistics tab but it directly determines the bounds the Statistics tab consumes.
- `custom2` (Custom) — bounds entered directly by the user.

In all four modes an `"F"` label and `0` credit are prepended after the per-mode block runs (or are part of the hardcoded list for the iitb modes), so `gradeLabels.length === gradeCount` and `gradeValuesFixed.length === gradeCount - 1`. Preserve that invariant.

## Conventions

- Edits go in `stable_v1/`. Don't touch the other top-level directories unless explicitly asked.
- ES5 only — `var`, `function`, no modules. Match the surrounding style.
- Boundary arrays have **N-1 entries for N grades**; frequency arrays have **N**. When in doubt, log lengths before and after.
- The data flow is one-way per user action: drag boundary → annotation `onDragEnd` → `obj.getStats()` + `obj.validateBarMovement()` + chart update. Tab 3 re-runs `getStats()` + `showStats()` on entry, so the Statistics view always reflects the latest movable bounds.
- Many `console.log`s exist already — leave them unless asked, they're useful for debugging the math.
