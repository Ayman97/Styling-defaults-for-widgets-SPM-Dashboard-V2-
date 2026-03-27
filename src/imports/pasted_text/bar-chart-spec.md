# Bar Chart Variant Fix Specification

The current implementation of the bar chart variants contains several incorrect behaviors that must be corrected. The following rules define the **expected behavior and UI logic**.

---

# 1. Clustered Vertical Bar Behavior

Clustered vertical bars must render as **independent bars within each category group**.

Correct structure:

Category (Engineering)

Completed
In Progress
Blocked

All bars must start from **zero baseline** and extend vertically.

Stacking must **not occur** in clustered charts.

---

# 2. Stacked Bar Behavior

Stacked variants must show **cumulative values**, not normalized values.

For example:

Engineering
Completed = 70
In Progress = 20
Blocked = 10

Stack height must equal:

70 + 20 + 10 = 100

The chart must **not normalize values to percentages**.

Current issue:
The stacked charts appear visually similar to **100% stacked charts**, which is incorrect.

Correct behavior:

* stacked vertical → cumulative height
* stacked horizontal → cumulative width

---

# 3. 100% Stacked Bar Behavior

100% stacked charts must normalize each category so the bar equals **100%**.

Normalization rule:

normalized value = value / category total

Example:

Engineering
Completed = 70%
In Progress = 20%
Blocked = 10%

Axis scale must be **0% → 100%**.

---

# 4. Tooltip Color Accuracy

Tooltip legend indicators must use **the exact same colors as the bars**.

Current issue:
Tooltip dots do not match the actual bar colors.

Required behavior:

Tooltip color indicator = bar segment color

This must always match the **palette or assigned series color**.

---

# 5. Reference Line Default Behavior

Reference lines must **not appear in default charts**.

Default style:

Reference Line → Disabled

Reference line should only appear if the user explicitly enables it.

---

# 6. Bar Corner Radius Behavior

Bar corner radius must apply **only to the outer end of the bar**.

Correct behavior:

Vertical bars

top corners → rounded
bottom corners → square

Horizontal bars

right corners → rounded
left corners → square

The start of the bar must always remain **flat at the axis baseline**.

---

# 7. Style Panel Behavior

The styles panel must dynamically update based on the **selected bar variant**.

Current issue:
Styles on the right side remain static regardless of selected variant.

Required behavior:

When the user selects a variant:

* Clustered Vertical
* Clustered Horizontal
* Stacked Vertical
* Stacked Horizontal
* 100% Stacked Vertical
* 100% Stacked Horizontal

The styles panel must refresh and show the **relevant style configuration for that variant**.

Example:

Clustered variants

Bars
Axes
Gridlines
Data Labels
Reference Line

Stacked variants

Bars
Axes
Gridlines
Data Labels
Reference Line
Stack behavior settings

100% stacked variants

Bars
Axes
Gridlines
Data Labels
Reference Line
Normalization settings

---

# 8. UI Interaction Requirement

When clicking a bar chart variant:

1. The **chart preview updates**
2. The **style panel updates**
3. The **style tables on the right refresh**
4. Only the **relevant styles for that variant are shown**

The chart preview and style panel must always stay **synchronized**.

---

# Expected Result

After applying these corrections:

* Clustered charts show independent bars
* Stacked charts show cumulative totals
* 100% stacked charts normalize to percentages
* Tooltip colors match bar colors
* Reference line is disabled by default
* Bar corners round only at the outer edge
* The styles panel updates dynamically when switching variants

These behaviors must apply consistently across **all bar chart variants**.
