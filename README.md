# Walle Design System

A copy-based Astro design system. Consumers receive the `@walle/` directory directly into their project and extend it via slots, CSS variables, and JSON config files — without forking the source.

---

## Dependencies

| Package | Version |
|---|---|
| astro | ^6.2.2 |
| @astrojs/mdx | ^5.0.4 |
| @astrojs/rss | ^4.0.18 |
| @astrojs/sitemap | ^3.7.2 |
| astro-icon | ^1.1.5 |
| typescript | ^6.0.3 |
| eslint | ^10.3.0 |
| prettier | ^3.8.3 |
| Node | >=22 |
| Yarn | ^1.22 |

---

## Start new project

```bash
curl -fsSL https://raw.githubusercontent.com/FabrizioCafolla/walle-design-system/main/lib/scripts/@walle/cli.sh \
  | bash -s -- init --project-name <project-name>
```

Options:
- `--project-name <name>` (required)
- `--dir-path <path>` (optional, defaults to current directory)

---

## Update `@walle/` in an existing consumer

```bash
just walle-update
```

Only `src/@walle/` is replaced. Config files and consumer styles are untouched.

---

## Development

### With Dev Container (recommended)

1. Requirements: Docker >=24
2. Open in VS Code, install the Dev Containers extension
3. Reopen in container when prompted
4. Website starts at http://localhost:4321

### Without Dev Container

Requirements: Docker >=24, Node >=22, Yarn ^1.22

```bash
just setup   # install dependencies
just dev     # start dev server at http://localhost:4321
just build   # production build
```

---

## Navbar config

Navbar links live in `src/configs/navbar.json`. The key is `dropdown` (not `children`):

```json
{
  "logo": { "src": "/logo.svg", "title": "Brand", "url": "/" },
  "items": [
    { "name": "Home", "url": "/" },
    {
      "name": "Work",
      "url": "#",
      "dropdown": [
        { "name": "Projects", "url": "/projects" },
        { "name": "Talks", "url": "/talks" }
      ]
    },
    { "name": "GitHub", "url": "https://github.com/...", "target": "_blank", "icon": "fa:github" }
  ]
}
```

Max 2 levels deep. If `target` is omitted, external URLs (`http*`) get `_blank` automatically.

---

## Slot system

`BaseLayout` exposes three override slots:

```astro
<BaseLayout>
  <!-- replace the default Navbar -->
  <MyNavbar slot="navbar" />

  <!-- replace the default Footer -->
  <MyFooter slot="footer" />

  <!-- inject tags inside <head> -->
  <link rel="preload" href="/fonts/myfont.woff2" as="font" crossorigin slot="head" />

  <!-- page content goes here (default slot) -->
  <MyPage />
</BaseLayout>
```

`BlogPostLayout` and `BlogPostsLayout` forward the `head` slot through to `BaseLayout`.

---

## Font customization

`@walle/` ships with no fonts. Add `@font-face` declarations and set CSS variables in `src/styles/global.css`:

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-display: swap;
}

:root {
  --font-body: "MyFont", system-ui, sans-serif;
  --font-heading: "MyFont", system-ui, sans-serif;
}
```

All typography in `@walle/styles/global.css` reads `--font-body` and `--font-heading`, so this is the only change needed.

---

## CSS variable overrides

Brand colors, spacing, shadows, and radius tokens are all CSS custom properties defined in `@walle/styles/global.css`. Override any of them in `src/styles/global.css`:

```css
:root {
  --primary: #your-color;
  --primary-light: #your-light;
  --primary-dark: #your-dark;
}
```

---

## Further reading

See `AGENTS.md` for the full component catalog, layout reference, config schema, and agent guidelines.
