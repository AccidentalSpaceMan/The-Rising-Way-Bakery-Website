# The Rising Way Bakery Website

**Live site:** https://accidentalspaceman.github.io/The-Rising-Way-Bakery-Website/

A responsive website for The Rising Way Bakery, a family-owned cottage bakery serving Summit & Portage County, Ohio. Built from scratch with plain HTML and CSS (no frameworks or build step) to showcase the menu, tell the bakery's story, and make it easy for customers to place orders.

## Features

- **Responsive layout:** adapts from desktop to mobile, with a stacked hero and single-column menu, about, and contact sections.
- **Custom design system:** a warm, dark theme built on CSS custom properties, with Google Fonts typography (Cormorant Garamond, Pinyon Script, Lato).
- **Polished details:** CSS keyframe animations (fade-in on load, slow-rotating hero rings, pulsing location badge), a grain texture overlay, and smooth-scrolling navigation.
- **Menu with tiered pricing:** muffins, cinnamon rolls, sourdough bread, and cookies, laid out with Flexbox.
- **Order intake without a backend:** an "Order Online" button links to a Google Form, so the owner can collect order requests on a fully static site.
- **Automated deployment:** a GitHub Actions workflow publishes the site to GitHub Pages on every push to `main`.

## Tech stack

- HTML5 and CSS3 (Grid, Flexbox, custom properties, keyframe animations)
- Google Fonts
- Google Forms (order requests)
- GitHub Pages and GitHub Actions (hosting and CI/CD)

## Project structure

```
index.html   Page markup (hero, menu, about, contact)
style.css    All styling, design tokens, animations, and responsive rules
*.png        Logo, about-section image, and favicon
.github/     GitHub Actions workflow for Pages deployment
```

## Run locally

No install needed. Clone the repo and open `index.html` in a browser, or serve the folder with any static server (for example, the VS Code Live Server extension).

```bash
git clone https://github.com/AccidentalSpaceMan/The-Rising-Way-Bakery-Website.git
```

## Notes

Developed with AI-assisted code review to tighten up CSS consistency, responsiveness, and markup quality.

## License

See [LICENSE](LICENSE).
