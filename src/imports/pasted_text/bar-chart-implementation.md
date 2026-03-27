# Bar Chart Implementation Instructions

## Data to Use for Demonstration

Use realistic business data suitable for bar chart visualization. The dataset should allow clear comparison across categories.

Example dataset:

Category: Departments
Measure: Quarterly Revenue (USD)

| Department | Q1     | Q2     | Q3     | Q4     |
| ---------- | ------ | ------ | ------ | ------ |
| Sales      | 420000 | 470000 | 520000 | 610000 |
| Marketing  | 210000 | 230000 | 260000 | 290000 |
| Operations | 350000 | 370000 | 390000 | 420000 |
| Product    | 280000 | 310000 | 340000 | 360000 |
| Support    | 160000 | 180000 | 190000 | 210000 |

Use these values to demonstrate:

* clustered comparisons
* stacked contributions
* 100% stacked proportions

All numbers should support **decimal formatting (1 decimal)** when converted to shortened values.

Example display format:

420000 → 420.0K

---

# Bar Chart Variants

The system must support the following variants:

* Clustered Vertical Bar Chart
* Clustered Horizontal Bar Chart
* Stacked Vertical Bar Chart
* Stacked Horizontal Bar Chart
* 100% Stacked Vertical Bar Chart
* 100% Stacked Horizontal Bar Chart

---

# UI Revision Requirement

Revise the bar chart configuration UI so that **all variants share the exact same style schema**.

The UI must strictly match the **style options and values defined in the style panel images**.

Important constraints:

1. Every variant must expose **identical style sections**.
2. Style options must appear **in the same order**.
3. Style option names must **not change across variants**.
4. Disabled styles must still appear in the configuration UI.
5. The default values must match the **style panel values exactly**.

---

# Required Style Sections

The UI must support these sections:

* Bars
* Reference Line
* Axes
* Gridlines
* Data Labels

Each section must follow the exact structure defined in the style panel images.

---

# Palette Behavior

Default palette for bar charts:

Monochrome

Base color:

#0B3A67

Rules:

* If palette = Monochrome → Bar color editable
* If palette = Categorical → Bar color disabled but displayed
* If palette = RAG → Bar color disabled

---

# Variant Differences

Variants must differ **only in layout behavior**, not styling schema.

Allowed differences:

Clustered vs Stacked
Vertical vs Horizontal orientation
100% stacking behavior

Not allowed differences:

Style sections
Option names
Default values
Typography
Spacing tokens
Palette system

---

# Rendering Requirement

The generated charts must visually reflect:

* the exact styles extracted from the style panel
* the data provided in this document
* the correct behavior for each bar variant

Do not optimize or reinterpret styling.

All visual appearance must strictly follow the **style configuration defined in the style panel images**.
