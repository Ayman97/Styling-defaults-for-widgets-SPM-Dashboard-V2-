# SPM Dashboard V2 — Style Changes & Todos

## Change Requests — March 2026

---

### ✅ [DONE] 1. Donut Chart — Reduce Inner Radius

**File:** `src/app/components/DonutChartView.tsx`

**Problem:** Inner radius was set to `50%`, which created too much empty space in the center of the donut chart.

**Change:**
- `innerRadius`: `'50%'` → `'30%'`

**Affected code locations:**
- Line ~40: `const innerRadius = subTab === 'donut' ? '30%' : '0%';`
- Style table row: Updated display value from `'50%'` to `'30%'`

---

### ✅ [DONE] 2. Donut Chart — Center Value Text Bold

**File:** `src/app/components/DonutChartView.tsx`

**Problem:** The large center value in donut mode was not bold, making it feel lighter than intended.

**Change:**
- Added `fontWeight="bold"` to the Recharts `<Label>` component rendered in the center

**Affected code locations:**
- Label component: Added `fontWeight="bold"` prop
- Style table row "Text bold": `"No"` → `"Yes"`

---

### ✅ [DONE] 3. All Widgets — Add Tooltip Section to Style Panels

**Files:** All 20 widget components

**Problem:** No widget had a Tooltip styling section in its right-side style panel.

**Change:** Added a "Tooltip" section to every widget's style panel with the following default values:

| Property | Value |
|---|---|
| Enabled | Yes |
| Background color | `#FFFFFF` |
| Background opacity | 100% |
| Border style | Solid |
| Border color | `#E5E7EB` |
| Border width | 1 |
| Corners | 8 |
| Font family | Auto |
| Bold | No |
| Text color | `#374151` |
| Text size | 12 |

**Widgets updated:**

| Widget | File | Pattern |
|---|---|---|
| Bar Chart | `BarView.tsx` | StylePanel with StyleTable |
| Combo Chart | `ComboView.tsx` | StylePanel with Section |
| Comparison Table | `ComparisonTableView.tsx` | StylePanel with inline table |
| Donut Chart | `DonutChartView.tsx` | Inline right panel |
| Heatmap | `HeatmapView.tsx` | StylePanel with Section |
| Hierarchy | `HierarchyView.tsx` | StylePanel with StyleTable |
| Line Chart | `LineChartView.tsx` | Data-driven sections arrays (lineSections + areaSections) |
| List | `ListView.tsx` | Inline right panel |
| Map | `MapView.tsx` | StylePanel with Section |
| Metric | `MetricView.tsx` | Data-driven sections arrays (5 variant arrays) |
| Network | `NetworkView.tsx` | StylePanel with Section |
| Radar | `RadarView.tsx` | Inline right panel |
| RAG Matrix | `RagMatrixView.tsx` | StylePanel with StyleTable |
| Sankey | `SankeyView.tsx` | StyleConfiguration function |
| Scatter | `ScatterView.tsx` | StylePanel with StyleTable |
| Summary Table | `SummaryTableView.tsx` | StylePanel with inline table |
| Table | `TableView.tsx` | Data-driven sections arrays (tableSections + pivotSections) |
| Timeline | `TimelineView.tsx` | StylePanel with StyleTable |
| Treemap | `TreemapView.tsx` | StylePanel with StyleTable |

> **Note:** `GaugeChart.tsx` is a pure visualization component embedded inside MetricView. It has no separate style panel and was intentionally skipped. The Gauge variant's tooltip is covered by MetricView's `gaugeSections`.

---

## Implementation Notes

### Vite HMR & VM-mounted filesystem
The dev server (`localhost:5173`) runs on the host machine while file edits come through a VM-mounted directory. Vite's HMR may not detect changes automatically in this setup. If the browser shows stale values after edits:
1. Stop the dev server (`Ctrl+C`)
2. Run `npm run dev` again in the project root
3. Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`)

---

## Pending / Future Work

- [x] **Card Grid widget** — Implemented in `CardView.tsx`, integrated in `App.tsx` (`claude/interesting-goodall` branch)
- [x] Tooltip sections — subsequently **removed** from all style panels per design decision (session Apr 2026)
