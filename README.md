# Mathegraphical

Mathegraphical is a browser-based collection of calculators and mathematical tools. It has no build step, package manager, or external runtime dependency: open the site in a browser and use the top navigation to move between tools.

## Open the App

The published site is available at:

```text
https://alvink7nz.github.io/calculator/
```

The project can also be run locally by opening `index.html` directly in a browser. A local web server is optional because the app is made from static HTML, CSS, and JavaScript files.

## Tools

### Home

`index.html` is the calculator chooser. It links to every tool and provides the shared top navigation.

### Graphing calculator

`graphingcalculator.html` plots several expressions on an interactive coordinate plane.

- Add and remove expressions.
- Edit expressions and see the graph update while typing.
- Compare multiple curves using separate colors.
- Drag to pan around the coordinate plane.
- Scroll to zoom; zoom sensitivity can be adjusted from 1 to 10.
- Reset the view or clear all expressions.
- Toggle the grid and axes.
- Read the graph coordinates under the pointer.
- Use the built-in introduction tour from the `Introduction` button.

The graph zoom scale ranges from `4` to `500`.

#### Graph expression syntax

Expressions may use `x` and `y`. A direct expression is treated as a function of `x`, while an expression containing `=` is plotted as an implicit equation with `x` and `y` on either side.

Supported operators:

- `+`, `-`, `*`, `/`, and `^`

Supported constants:

- `pi`, `π`, and `e`

Supported functions:

- `sin`, `cos`, `tan`, `sqrt`, `abs`, `log`, `ln`, `exp`
- `min`, `max`, `floor`, `ceil`, and `round`

Examples:

```text
sin(x)
y = sin(x)
y = x^2 / 4
x + y = 4
y^2 = x
x^2 + y^2 = 25
2 * cos(x) + 1
sqrt(abs(x))
```

Implicit equations are sampled numerically, so complex equations and equations with multiple branches may be approximate at the current zoom level.

### Regular calculator

`regularcalculator.html` provides a basic arithmetic keypad for everyday calculations.

- Enter numbers and decimal values.
- Use addition, subtraction, multiplication, and division.
- Clear the current expression.
- Delete the last character.
- Calculate with the equals key.

### Scientific calculator

`scientificcalculator.html` extends the regular calculator with scientific functions.

- Sine, cosine, tangent, logarithm, natural logarithm, and square root.
- Powers and squared values.
- Parentheses and decimal input.
- `pi` and `e` constants.
- Degree and radian angle modes.
- Backspace, clear, and equals controls.

### Color calculator

`colorcalculator.html` converts a selected color into common color formats.

- Choose a color with the native color picker.
- Enter or edit a six-digit hexadecimal color.
- Read the red, green, and blue RGB channels.
- Read the cyan, magenta, and yellow CMY percentages.
- Copy RGB, CMY, or hex values to the clipboard.
- View a live preview of the selected color.

Example input:

```text
#E85D45
```

### Money converter

`moneyconverter.html` converts an amount between common currencies.

Supported currencies:

```text
USD  EUR  GBP  JPY  CAD  AUD  CHF  CNY  INR  MXN
```

- Enter any non-negative amount.
- Select the source and destination currencies.
- Swap the source and destination currencies.
- See the result update as the amount or currencies change.

The converter uses an indicative rate table stored in `moneyconverter.html`. It does not connect to a live exchange-rate service, so rates may not reflect current market values.

## Shared Interface

Every calculator page includes:

- A top navigation bar linking to Home, Graphing, Regular, Scientific, Color, and Money.
- A Settings control for changing the accent, ink, paper, and panel colors.
- Responsive layouts for desktop and mobile screens.

Color preferences are stored in browser `localStorage` and can be reset from the Settings panel.

## Project Files

- `index.html` - Home page and tool chooser.
- `graphingcalculator.html` - Interactive function and implicit-equation grapher.
- `regularcalculator.html` - Basic arithmetic calculator.
- `scientificcalculator.html` - Scientific calculator with functions and angle modes.
- `colorcalculator.html` - Color picker and RGB, CMY, and hex converter.
- `moneyconverter.html` - Offline currency converter.
- `styles.css` - Shared layout, navigation, calculator, tool, and responsive styles.
- `settings.js` - Shared theme color settings and persistence.
- `mathegraphicallogo.svg` - Shared application logo.

## Technology

Mathegraphical uses plain HTML, CSS, and browser JavaScript. There are no npm packages, build tools, or server-side components.
