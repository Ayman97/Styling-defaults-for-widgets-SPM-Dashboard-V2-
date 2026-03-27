# Bar Chart Behavior and Data Rules

This document defines the **exact behavior for all bar chart variants** and provides **accurate data** so each variant renders correctly.

These rules must be followed exactly.

---

# Data Structure

Dataset example: **Tasks by Status across Departments**

| Department  | Completed | In Progress | Blocked |
| ----------- | --------- | ----------- | ------- |
| Engineering | 72        | 18          | 10      |
| Product     | 64        | 26          | 10      |
| Marketing   | 58        | 32          | 10      |
| Sales       | 70        | 20          | 10      |
| Support     | 62        | 28          | 10      |

These values allow:

* clustered comparisons
* stacked contributions
* **100% stacked normalization**

Each row totals **100** so the **100% stacked chart is accurate**.

---

# Variant Behavior

The system must support these variants:

1. Clustered Vertical Bar
2. Clustered Horizontal Bar
3. Stacked Vertical Bar
4. Stacked Horizontal Bar
5. 100% Stacked Vertical Bar
6. 100% Stacked Horizontal Bar

Variants must differ **only by layout behavior and aggregation**, not by style schema.

---

# Clustered Vertical Bar Chart

Layout:

* X-axis → categories (Departments)
* Y-axis → numeric values
* Each measure rendered as **separate bars within the category group**

Example structure:

Engineering
Completed | In Progress | Blocked

Bars are displayed **side-by-side**.

---

# Clustered Horizontal Bar Chart

Layout:

* Y-axis → categories
* X-axis → numeric values
* Each measure rendered as **separate horizontal bars within the category group**

Important behavior:

Horizontal charts **still use bars**.
They are simply **rotated rectangles extending along the X axis**.

---

# Stacked Vertical Bar Chart

Layout:

* X-axis → categories
* Y-axis → numeric values

Measures are **stacked vertically** within a single bar.

Example:

Engineering bar composed of:

Completed
In Progress
Blocked

Total height represents **sum of all measures**.

---

# Stacked Horizontal Bar Chart

Layout:

* Y-axis → categories
* X-axis → numeric values

Measures are **stacked horizontally**.

Example:

Engineering bar extends horizontally with segments:

Completed → In Progress → Blocked

Total width represents **sum of all measures**.

---

# 100% Stacked Vertical Bar Chart

Layout:

* X-axis → categories
* Y-axis → percentage scale (0–100%)

Behavior:

Each category bar must be **normalized to 100%**.

Segment height =

value / total of category

Example:

Engineering:

Completed = 72%
In Progress = 18%
Blocked = 10%

The full bar height must always equal **100%**.

---

# 100% Stacked Horizontal Bar Chart

Layout:

* Y-axis → categories
* X-axis → percentage scale (0–100%)

Behavior:

Each category bar must be **normalized to 100% width**.

Segment width =

value / total of category

Example:

Engineering:

Completed = 72%
In Progress = 18%
Blocked = 10%

The full bar width must always equal **100%**.

---

# Normalization Rule for 100% Charts

When rendering a 100% stacked chart:

For each category:

normalized value =

value / sum(values in category)

The axis must display **percentage values**.

Axis range:

0% → 100%

---

# UI Variant Rules

All bar chart variants must share the **same style configuration schema**.

Allowed differences:

* orientation (horizontal vs vertical)
* stacking behavior
* percentage normalization

Not allowed differences:

* style section names
* style option names
* style option order
* default style values

Style sections must remain identical.

---

# Rendering Requirement

Charts must:

* apply the styles extracted from the style panel images
* render using the dataset above
* behave correctly for each variant

The implementation must ensure:

* stacked charts show cumulative totals
* 100% stacked charts always equal **100% per category**
* horizontal variants correctly rotate axes while preserving styles
