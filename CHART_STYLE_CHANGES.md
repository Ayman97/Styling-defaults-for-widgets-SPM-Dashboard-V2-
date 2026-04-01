# Chart Style Changes — Based on SPM Widget Styling Evaluation V2

All changes are derived from the recommendations in `SPM_Widget_Styling_Evaluation_V2.numbers`.

---

## Session 1 Changes (Terminology & Color Fixes)

### 1. GaugeChart.tsx — Value color deviation fix

**Issue (High):** Metric (Gauge) Value color `#4E4749` deviated from the standard `#0F172A` used by all other Metric variants.

**Changes:**
- `GaugeChart.tsx` — value readout `color`: `#4E4749` → `#0F172A`

---

### 2. DonutChartView.tsx — Center Label color typo + terminology

**Issue (High):** Center Label Text color was `#667280` (typo — one hex digit off from the standard `#6B7280`).
**Issue (Low/Medium):** `Text bold`, `Text color`, `Text size` used as property names in scoped sections — the `Text` prefix is redundant when the section already names the element.

**Changes:**
- SVG label `fill`: `#667280` → `#6B7280`
- Center Label Text: `Text bold` → `Bold`, `Text color` → `Color` (+ value corrected), `Text size` → `Size`
- Center Value Text: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`
- Data labels: `Text color` → `Color`, `Text size` → `Size`

---

### 3. BarView.tsx — Axes terminology

**Issue (Medium):** Y-Axis and X-Axis sections used `Text bold`, `Text color`, `Text size` — the `Text` prefix is unnecessary in single-element axis sections.

**Changes:**
- Y-Axis: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`
- X-Axis: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`

---

### 4. LineChartView.tsx — Axes and Data labels terminology

**Issue (Medium):** Y-Axis, X-Axis, Data labels, and Customize-each-line sections all used `Text bold`, `Text color`, `Text size` prefix unnecessarily.

**Changes:**
- Y-Axis: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`
- X-Axis: same
- Data labels: same
- Customize for each line: same

---

### 5. ComboView.tsx — ALL CAPS section names + axes/data labels terminology

**Issue (Low):** Section names displayed in ALL CAPS due to `uppercase` CSS class.
**Issue (Medium):** Y-Axis, X-Axis sections used `Text bold`, `Text color`, `Text size`.
**Issue (Medium):** Data labels section used `Data labels enabled` as toggle instead of `Enabled`.

**Changes:**
- `Section` component `h4`: removed `uppercase` CSS class
- Y-Axis: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`
- X-Axis: same
- Data labels: `Data labels enabled` → `Enabled`, `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`

---

### 6. ScatterView.tsx — Axes, Gridlines, Category labels terminology

**Issue (Medium):** Y-Axis and X-Axis used `Text bold` prefix.
**Issue (Low):** Gridlines used `Line color` / `Line width` instead of `Gridline color` / `Gridline width`.
**Issue (Medium):** Category labels used `Text color` / `Text size`.

**Changes:**
- Y-Axis: `Text bold` → `Bold`
- X-Axis: `Text bold` → `Bold`
- Gridlines: `Line color` → `Gridline color`, `Line width` → `Gridline width`
- Category labels: `Text color` → `Color`, `Text size` → `Size`

---

### 7. HeatmapView.tsx — Axis color deviation + terminology

**Issue (Medium):** Both Y-Axis and X-Axis had `Color: #334155` — differs from all other chart axes which use `#6B7280`.
**Issue (Medium):** Y-Axis and X-Axis used `Text bold` prefix.
**Issue (Medium):** Squares section used `Text color` / `Text size`.

**Changes:**
- `Y_COLOR` + `X_COLOR`: `#334155` → `#6B7280`
- Squares section: `Text color` → `Color`, `Text size` → `Size`
- Y-Axis: `Text bold` → `Bold`
- X-Axis: `Text bold` → `Bold`

---

### 8. RagMatrixView.tsx — Squares terminology + Data labels toggle

**Issue (Medium):** Squares section used `Text color` / `Text size`.
**Issue (Medium):** Data Labels toggle named `Data labels` instead of `Enabled`.

**Changes:**
- Squares section: `Text color` → `Color`, `Text size` → `Size`
- Data Labels: `Data labels` (toggle) → `Enabled`

---

### 9. HierarchyView.tsx — Node section terminology

**Issue (Medium):** Node section used `Text bold`, `Text color`, `Text size`.

**Changes:**
- Node: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`

---

### 10. TableView.tsx — Alternating color + column header/value terminology

**Issue (Low/Medium):** Table variant used `Alternating color` while Pivot Table, Comparison Table, Summary Table all used `Alternating row color`.
**Issue (Low):** Column headers, Column values used `Text color`.

**Changes:**
- Table Column values: `Alternating color` → `Alternating row color` (2 occurrences)
- Column headers + values: `Text bold` → `Bold`, `Text color` → `Color`, `Text size` → `Size`

---

### 11. ComparisonTableView.tsx — Terminology consistency

**Changes:**
- Column headers, Row headers, Column values: `Text color` → `Color`
- Column values / Customization default: `Alternating color` → `Alternating row color`, `Text color` → `Color`

---

### 12. SummaryTableView.tsx — Terminology consistency

**Changes:**
- Column headers, Row headers, Column values: `Text color` → `Color`
- Column values / Customization default: `Alternating color` → `Alternating row color`, `Text color` → `Color`

---

---

## Session 2 Changes (Missing Sections, Item Customization, Palette Consistency)

### 13. LineChartView.tsx — Add Reference line section + fix missed X-Axis terminology

**Issue (High):** Line Chart was the only chart with no Reference line section. Bar, Combo, and Scatter all have one.
**Issue (Medium):** X-Axis still had `Text bold` (missed in Session 1).

**Changes:**
- Fixed X-Axis `Text bold` → `Bold`
- Added 13 constants: `REF_LINE_ENABLED`, `REF_SHOW_LABEL`, `REF_LABEL_POS`, `REF_LABEL_FONT`, `REF_LABEL_BOLD`, `REF_LABEL_COLOR`, `REF_LABEL_SIZE`, `REF_LINE_STYLE`, `REF_LINE_COLOR`, `REF_LINE_WIDTH`, `REF_LABEL_BG_COLOR`, `REF_LABEL_BG_OPACITY`, `REF_LABEL_CORNERS`
- Added "Reference line" section with 13 properties: Enabled, Show label, Label position, Label font family, Label bold, Label color, Label size, Line style, Line color, Line width, Label background color, Label background opacity, Label corners

---

### 14. ScatterView.tsx — Bold format + Data labels section + number formatting + Customize each

**Issue (Medium):** Bold values used `Enabled/Disabled` instead of `Yes/No` (Y-Axis, X-Axis, Category labels).
**Issue (Medium):** Missing Data labels section (Bar, Line, Donut all have one).
**Issue (Low):** Category labels missing number formatting (Display missing value as, Decimals, Short number).
**Issue (High):** Missing "Customize each series" toggle in Bubbles section.

**Changes:**
- Y-Axis, X-Axis, Category labels Bold: `Enabled/Disabled` → `Yes/No`
- Added Data labels section (12 properties): Enabled, Position, Background color, Background opacity, Font family, Bold, Color, Size, Label corners, Display missing value as, Decimals, Short number
- Category labels: added Display missing value as, Decimals, Short number
- Bubbles section: added `Customize each series: No` + "Bubbles / Series customization default" table

---

### 15. RadarView.tsx — Multiple missing sections + Bold format fix

**Issue (Medium):** Bold value in Category labels was hardcoded `Enabled` instead of `Yes`.
**Issue (Medium):** Polygons section missing Line style, Line color, Line width for outline styling.
**Issue (Low):** Category labels missing Background color, Background opacity.
**Issue (Medium):** Missing Gridlines/Rings section (rings clearly visible in preview).
**Issue (Medium):** Missing Data labels section.

**Changes:**
- Category labels Bold: `Enabled` → `Yes`
- Polygons section: added Line style, Line color, Line width
- Category labels: added Background color, Background opacity (before Font family)
- Added Gridlines section: Show gridlines, Gridline style, Gridline color, Gridline width
- Added Data labels section (12 properties)

---

### 16. ListView.tsx — Attribute Default Styles missing text properties

**Issue (High):** Attribute Default Styles only had Border + Padding + Number formatting. Missing all text styling (Font family, Bold, Color, Size).

**Changes:**
- Added Font family, Bold, Color, Size at the top of Attribute Default Styles (before Border properties, per Property Order Standard)
- Added constants: `ATTR_FONT`, `ATTR_BOLD`, `ATTR_COLOR`, `ATTR_SIZE`

---

### 17. TreemapView.tsx — Terminology + split Labels + Customize each category

**Issue (Medium):** Labels section used `Text color`, `Text size`. Data labels toggle named `Data labels`.
**Issue (High):** Single "Labels" section merged category labels and data labels with shared styling — cannot style independently.
**Issue (Medium):** Missing "Customize each category" toggle in Squares section.

**Changes:**
- `Text color` → `Color`, `Text size` → `Size`
- `Data labels` toggle → `Enabled`
- Split "Labels" into "Category labels" (7 properties) + "Data labels" (10 properties)
- Squares section: added `Customize each category: No`

---

### 18. SankeyView.tsx — Terminology + split Labels into 3 + Label corners + rename Color

**Issue (Medium):** Labels section used `Text color`, `Text size`. Bold used `Enabled/Disabled`. Data labels toggle named `Data labels`.
**Issue (High):** Single "Labels" section merged category labels, level labels, and data labels — cannot style independently.
**Issue (Low):** Data labels missing Label corners.
**Issue (Low):** Generic `Color` property name in Visual section — ambiguous.

**Changes:**
- `Text color` → `Color`, `Text size` → `Size`, Bold: `Enabled/Disabled` → `Yes/No`, `Data labels` toggle → `Enabled`
- Renamed Visual section `Color` → `Node color`
- Split "Labels" into 3 sections:
  - "Category labels": Enabled, Position, Background color/opacity, Font family, Bold, Color, Size
  - "Level labels": same structure
  - "Data labels": same + Label corners, Display missing value as, Decimals, Short number, Data labels as total %
- Added `LABEL_CORNERS = 4` constant

---

### 19. NetworkView.tsx — Terminology + Corners + Border + Customize each + Used palette

**Issue (Medium):** Node section used `Text color`, `Text size`.
**Issue (Medium):** Node missing Corners AND Border properties.
**Issue (Medium):** Missing "Customize each node type" toggle.
**Issue (Partial):** Missing "Used palette" field.

**Changes:**
- `Text color` → `Color`, `Text size` → `Size`
- Added `NODE_CORNERS`, `NODE_BORDER_STYLE`, `NODE_BORDER_COLOR`, `NODE_BORDER_WIDTH` constants
- Node section: added Corners (in Visual group), Border style, Border color, Border width (in Border group)
- Added `Used palette: Monochrome` after node color
- Added `Customize each node type: No` as last property

---

### 20. HierarchyView.tsx — Bold format + Border + Customize each level + Used palette

**Issue (Medium):** Bold value used `Enabled/Disabled` instead of `Yes/No`.
**Issue (Medium):** Node section missing Border style, Border color, Border width.
**Issue (Medium):** Missing "Customize each level" toggle.
**Issue (Partial):** `USED_PALETTE` constant was referenced as `USED_PALETTE` but defined as `NODE_PALETTE`.

**Changes:**
- Bold: `Enabled/Disabled` → `Yes/No`
- Fixed `USED_PALETTE` → `NODE_PALETTE` reference
- Node section: added Border style, Border color, Border width (after Corners)
- Added `Customize each level: No` as last property

---

### 21. MapView.tsx — Terminology + Bold format + number formatting + Customize each

**Issue (Medium):** Category Labels section used `Text color`, `Text size`. Bold used `Enabled/Disabled`.
**Issue (Medium):** Category Labels missing Display missing value as, Decimals, Short number (shows numeric values like 176K).
**Issue (Low):** Filled Map missing "Customize each region" toggle.
**Issue (Low):** Bubble Map missing "Customize each series" toggle.

**Changes:**
- `Text color` → `Color`, `Text size` → `Size`, Bold: `Enabled/Disabled` → `Yes/No`
- Category Labels: added Display missing value as, Decimals, Short number
- Added `LABEL_DECIMALS = 1`, `LABEL_SHORT_NUM = true` constants
- Filled Areas section: added `Customize each region: No`
- Bubbles section: added `Customize each series: No`

---

### 22. ComboView.tsx — Remaining uppercase + Customize each for BARS/LINE/Data labels

**Issue (Low):** Reference line `h4` still had `uppercase` CSS class (standalone element, not using the `Section` component).
**Issue (High):** BARS section missing "Customize each series" toggle.
**Issue (High):** LINE section missing "Customize each line" toggle.
**Issue (Medium):** Data labels missing "Customize for each line" toggle.

**Changes:**
- Reference line `h4`: removed `uppercase` class
- BARS section: added `Customize each series: No` + "Bars / Series customization default" table
- LINE section: added `Customize each line: No` + "Line / Line customization default" table
- Data labels section: added `Customize for each line: No`

---

### 23. BarView.tsx — Customize each series

**Issue (High):** Bars section missing "Customize each series" toggle (Line Chart has "Customize each line", Donut has "Customize each slice").

**Changes:**
- Bars section: added `Customize each series: No`
- Added "Bars / Series customization defaults" table with 3 series rows (Series | Color | Opacity | Corners)

---

### 24. HeatmapView.tsx — Customize each row/column

**Issue (Low):** Squares section missing "Customize each row/column" toggle.

**Changes:**
- Squares section: added `Customize each row/column: No`

---

### 25. TimelineView.tsx — Customize each phase + Phase color + Used palette

**Issue (Medium):** Phases section missing "Customize each phase" toggle.
**Issue (Medium):** Timeline has no palette support — phases could be color-coded.

**Changes:**
- Added `PHASE_COLOR = '#0B3A67'`, `PHASE_PALETTE = 'Monochrome'` constants
- Phases section: added Phase color, Used palette (in Visual group)
- Phases section: added `Customize each phase: No` (last property)

---

### 26. TableView.tsx — Pivot Table Total sections (5 new sections)

**Issue (High):** Pivot Table missing dedicated sections for Total columns and Total rows — totals are rendered in the visualization but cannot be styled independently.

**Changes (Pivot Table variant only):**
- Added 70 new constants covering all total section styling
- Added 5 new sections after "Column values / Customization default":
  1. **Total column headers** (15 properties): Enabled, Label, Width, Height, Background color `#EFF6FF`, Background opacity, Font family, Bold `Yes`, Color `#0B3A67`, Size, Text alignment, Border style, Border color `#E5E7EB`, Border width, Border visibility `Bottom`
  2. **Total column values** (17 properties): Background color `#F0F9FF`, Background opacity, Font family, Bold `Yes`, Color `#0F172A`, Size, Border + Padding + Number formatting
  3. **Total row headers** (15 properties): Same as Total column headers with Border visibility `Top`
  4. **Total row values** (17 properties): Same as Total column values with Border visibility `Top`
  5. **Grand total cell** (6 properties): Background color `#DBEAFE`, Background opacity, Font family, Bold `Yes`, Color `#0B3A67`, Size

---

### 27. MetricView.tsx — Add Used palette to all Metric Visual sections

**Issue (High):** All Metric variants (Percentage, With Comparison, With Sparkline, Circular Progress, Gauge) missing `Used palette` field in Visual section.

**Changes (all 4 Visual section inline definitions + shared `visualRows` function):**
- Added `Used palette: Monochrome` after `Progress opacity` in every Metric variant's Visual section
- Covers: Percentage/With Comparison (shared `visualRows`), With Sparkline, Circular Progress, Gauge variants

---

## Summary of All Changes

### Session 1 — Terminology & Color Fixes (12 files)

| File | Changes | Severity |
|------|---------|----------|
| `GaugeChart.tsx` | Value color `#4E4749` → `#0F172A` | High |
| `DonutChartView.tsx` | Color typo + terminology (8 names) | High/Low |
| `BarView.tsx` | Axes terminology (6 names) | Medium |
| `LineChartView.tsx` | Axes + Data labels terminology (12 names) | Medium |
| `ComboView.tsx` | ALL CAPS + axes + data labels (10 changes) | Low/Medium |
| `ScatterView.tsx` | Axes + Gridlines + Category labels (6 names) | Medium/Low |
| `HeatmapView.tsx` | Axis color + terminology (8 changes) | Medium |
| `RagMatrixView.tsx` | Squares + Data labels toggle (3 changes) | Medium |
| `HierarchyView.tsx` | Node terminology (3 names) | Medium |
| `TableView.tsx` | Alternating row color + terminology (12 changes) | Low/Medium |
| `ComparisonTableView.tsx` | Terminology consistency (5 changes) | Low/Medium |
| `SummaryTableView.tsx` | Terminology consistency (5 changes) | Low/Medium |

### Session 2 — Missing Sections, Item Customization & Palette Consistency (11 files)

| File | Changes | Severity |
|------|---------|----------|
| `LineChartView.tsx` | Fix X-Axis Bold + add Reference line section (14 changes) | High/Medium |
| `ScatterView.tsx` | Bold format + Data labels + number formatting + Customize each | High/Medium/Low |
| `RadarView.tsx` | Bold fix + Polygon styling + Gridlines + Data labels + Category labels bg | Medium/Low |
| `ListView.tsx` | Attribute Default Styles: add Font family, Bold, Color, Size | High |
| `TreemapView.tsx` | Terminology + split Labels (2 sections) + Customize each category | High/Medium |
| `SankeyView.tsx` | Terminology + split Labels (3 sections) + corners + rename Color | High/Medium/Low |
| `NetworkView.tsx` | Terminology + Corners + Border + Customize each + Used palette | Medium |
| `HierarchyView.tsx` | Bold fix + Border + Customize each level + Used palette ref fix | Medium |
| `MapView.tsx` | Terminology + Bold fix + number formatting + Customize each (x2) | Medium/Low |
| `ComboView.tsx` | Uppercase fix + Customize each BARS/LINE + Data labels toggle | High/Medium/Low |
| `BarView.tsx` | Customize each series + defaults table | High |
| `HeatmapView.tsx` | Customize each row/column | Low |
| `TimelineView.tsx` | Customize each phase + Phase color + Used palette | Medium |
| `TableView.tsx` | 5 new Pivot Table Total sections (70 constants) | High |
| `MetricView.tsx` | Used palette in all 4 Metric Visual sections | High |
