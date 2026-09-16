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

The zoom scale currently ranges from `4` to `500`.

## Expression Syntax

Use `x` as the variable. The graph understands:

- Operators: `+`, `-`, `*`, `/`, and `^`
- Constants: `pi`, `π`, and `e`
- Functions: `sin`, `cos`, `tan`, `sqrt`, `abs`, `log`, `ln`, `exp`, `min`, `max`, `floor`, `ceil`, and `round`

Examples:

```text
sin(x)
x^2 / 4
abs(x - 2)
2 * cos(x) + 1
sqrt(abs(x))
```

## Project File

- `index.html` - The complete application, including its styles and graphing logic.
