# Task List

A clean, responsive to-do list built with vanilla HTML, CSS, and JavaScript. Tasks are saved in your browser, so they are still there after a refresh.

**Live demo:** [https://pasindu-design.github.io/todo-list-app/](https://pasindu-design.github.io/todo-list-app/)

![Screenshot of the app](screenshot.png)

## Features

- Add tasks with the **Add** button or the **Enter** key
- Empty tasks are blocked with a clear inline message
- Mark tasks as completed (strikethrough and dimmed)
- Delete tasks with smooth fade-in and fade-out transitions
- Tasks persist with `localStorage`
- Responsive layout that works on phones and desktops
- Keyboard-friendly and screen-reader-friendly (labels, focus styles, `aria-live` messages)

## Tech stack

- HTML5
- CSS3 (custom properties, Flexbox, transitions, keyframe animations)
- JavaScript (ES6+, DOM manipulation, Web Storage API)

No frameworks or libraries.

## Getting started

```bash
git clone https://github.com/Pasindu-design/todo-list-app.git
cd todo-list-app
```

Open `index.html` in your browser. No build step or install needed.

## Project structure

```
.
├── index.html   # Page structure
├── style.css    # Styling and animations
├── script.js    # App logic and localStorage
└── README.md
```

## What I learned

- Creating and removing elements with the DOM API
- Handling events (`submit`, `change`, `click`, `input`)
- Saving and loading data with `localStorage` and `JSON`
- Validating user input
- Building a responsive layout and accessible UI

## Future improvements

- Edit existing tasks
- Filter by All / Active / Completed
- Drag-and-drop reordering
- Due dates and a dark mode

## Author

**Pasindu Madhusanka**
[LinkedIn](https://www.linkedin.com/in/pasindu-madusanka-a99322322) · [GitHub](https://github.com/Pasindu-design)
