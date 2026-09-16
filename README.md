# Mathegraphical

Mathegraphical is a browser-based mathematical graphing machine. Enter one or more functions of `x` and view them on an interactive coordinate plane.

## Run

Open `calculatoralvintnis.com` in a web browser. No installation, server, or external dependencies are required.

## Features

- Plot multiple expressions at the same time
- Add and remove expressions
- Pan by dragging the graph
- Zoom with the mouse wheel or trackpad
- Reset the viewport
- Show or hide the grid and axes
- Adjust zoom sensitivity
- Display cursor coordinates
- Responsive layout for desktop and mobile screens
- Convert colors to RGB, CMY, and hexadecimal values
- Convert amounts between common currencies

The zoom scale currently ranges from `4` to `500`.

## Expression Syntax

Use `x` and `y` in expressions. You can enter a function directly or write an equation with `=`; implicit equations such as `x + y = 4` are supported.

- Operators: `+`, `-`, `*`, `/`, and `^`
- Constants: `pi`, `π`, and `e`
- Functions: `sin`, `cos`, `tan`, `sqrt`, `abs`, `log`, `ln`, `exp`, `min`, `max`, `floor`, `ceil`, and `round`

Examples:

```text
sin(x)
y = sin(x)
y = x^2 / 4
x + y = 4
y^2 = x
x^2 / 4
abs(x - 2)
2 * cos(x) + 1
sqrt(abs(x))
```

## Project File

- `index.html` - The complete application, including its styles and graphing logic.
- `colorcalculator.html` - Color picker with RGB, CMY, and hex readouts.
- `moneyconverter.html` - Currency converter using an included indicative rate table.

The money converter uses rates stored in the page and does not connect to a live exchange-rate service.
