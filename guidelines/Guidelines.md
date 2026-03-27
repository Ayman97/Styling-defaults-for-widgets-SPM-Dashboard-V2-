# Chart & Component Styling Guidelines

These guidelines define how charts or UI components must be generated when **style panels and optional wireframe references are provided as image attachments**.
The goal is to ensure the output **faithfully applies the exact style configuration** while optionally using the **wireframe only as a structural reference**.

These rules apply to **all widgets and charts**.

---

# Source Images and Their Roles

When images are provided, they fall into two possible categories:

### 1. Style Configuration Image (Source of Truth)

This image contains the **style panel** with options and values.

It defines:

* colors
* spacing
* typography
* borders
* radii
* opacities
* palettes
* chart styling parameters
* label formatting
* axis settings
* gridlines
* component appearance

This image is the **only source of styling values**.

All styling must be **extracted exactly from this image**.

---

### 2. Wireframe Image (Optional Structural Reference)

Sometimes a second image may be provided showing a **wireframe version of the component**.

This image defines:

* layout structure
* element placement
* visual hierarchy
* grouping of elements

The wireframe **does not define styling**.

It must **never be used as a source of visual styles**.

If no wireframe image is provided, generate the component using **standard best-practice layout for that widget type**, while still applying the **exact styles from the style configuration image**.

---

# Critical Rule: Separation of Layout and Styling

The final output must follow this principle:

| Source                     | What It Controls      |
| -------------------------- | --------------------- |
| Style panel image          | All visual styling    |
| Wireframe image (optional) | Layout structure only |

If both images are present and conflict with each other, **the style panel image always takes priority**.

---

# Wireframe Usage Rules

If a wireframe image is provided, it may only influence:

* layout structure
* element placement
* grouping
* hierarchy

The wireframe must **not influence**:

* colors
* typography
* spacing
* borders
* radii
* opacity
* icon sizes
* visual weights

The final output must look like a **fully styled production component**, not a wireframe.

---

# Style Extraction Rules

When reading a style panel image:

1. Extract **all style sections exactly as shown**.
2. Extract **every option in each section**.
3. Extract **every value exactly as displayed**.
4. **Do not rename style options**.
5. **Do not modify values**.
6. **Do not skip disabled options**.
7. **Include disabled options with their displayed values**.
8. **Maintain the exact order of options**.
9. **Maintain the exact section structure**.

Nothing should be inferred or invented.

Only extract what is visible in the image.

---

# Section Toggle Rule

If a section has an **enable/disable toggle**, the **first row of the table must always be the toggle**.

Example:

### Data Labels

| Style                    | Value       |
| ------------------------ | ----------- |
| Enabled                  | Yes         |
| Position                 | Above       |
| Background color         | Transparent |
| Background opacity       | 0%          |
| Font family              | Auto        |
| Bold                     | Yes         |
| Text color               | #111827     |
| Text size                | 12          |
| Label corners            | 8           |
| Display missing value as | –           |
| Decimals                 | 1           |
| Short number             | Yes         |

---

# Style Documentation Format

Extracted styles must be presented as **tables**.

Each section must follow this format:

Section title as a heading followed by a table:

| Style | Value |

Rules:

* Maintain the **same option order** shown in the style panel.
* Include **all options**, even if disabled.
* Do not remove or simplify any rows.

---

# Chart Rendering Rules

The chart or component must be rendered using **exactly the extracted styles**.

Do not:

* optimize styling
* improve visual design
* reinterpret values
* add new properties
* remove properties

All style properties must match the **values extracted from the style panel image**.

---

# Palette Rules

Charts may use palettes such as:

* Monochrome
* Categorical
* RAG

Palette behavior must follow the values extracted from the style configuration.

If a color control is disabled due to palette logic, the displayed value should still appear in the styles table.

---

# Layout Requirements

The final layout must be structured as follows:

Left side:

* Chart or component visualization

Right side:

* Scrollable styles panel

The styles panel must contain **all extracted style tables**.

Behavior requirements:

* The chart must remain **fixed on the left side**.
* The styles panel must be **scrollable independently**.
* Each section must appear sequentially in the scroll container.

Conceptual layout:

Left panel
Chart visualization

Right panel (scrollable)

Section tables
Full style configuration

---

# Accuracy Requirement

The goal of these guidelines is to produce an output that:

* matches the **exact styles defined in the style panel**
* preserves the **layout structure from the wireframe (if provided)**
* uses a **standard layout if no wireframe exists**
* looks like a **production-quality component**, not a wireframe
* exposes the **complete styling configuration**

No stylistic interpretation or simplification is allowed.

All styling must strictly follow the **style panel image**.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
