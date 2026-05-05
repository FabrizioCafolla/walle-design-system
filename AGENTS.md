# AGENTS.md — Walle Design System

Context and behavioral rules for AI agents working in this repository.

---

## What this is

Walle is a **copy-based Astro design system**. It is not an npm package. Consumers receive a verbatim copy of the `@walle/` directory and keep it inside their own `src/` tree. Updates are applied by re-running `cli.sh`, which syncs the directory from source.

The system provides layout scaffolding, a component library, and configuration contracts that consumers extend — not fork.

---

## Tech stack

| Tool | Version |
|---|---|
| Astro | ^6.2.2 |
| @astrojs/mdx | ^5.0.4 |
| @astrojs/rss | ^4.0.18 |
| @astrojs/sitemap | ^3.7.2 |
| astro-icon | ^1.1.5 |
| TypeScript | ^6.0.3 |
| ESLint | ^10.3.0 |
| Prettier | ^3.8.3 |
| Node | >=22 |
| Yarn | ^1.22 |

---

## File structure

```
lib/
  website/
    src/
      @walle/               ← design system core (read-only in consumers)
        components/
          elements/         ← primitive UI: Badge, Button
          features/
            Blog/           ← blog-specific components
            Card/           ← BasicCard
            Navbar/         ← Navbar, NavbarMenu, NavbarItem, NavbarDropdown
            Sections/       ← HeaderStandard, Section, SectionFlow
            Analytics.astro
            Breadcrumbs.astro
            Footer.astro
            Head.astro
          index.js          ← public component exports
        layouts/
          AbstractLayout.astro   ← <html> wrapper; loads Head, styles, analytics
          BaseLayout.astro       ← adds Navbar + Footer around <slot />
          BlogPostLayout.astro   ← single post layout
          BlogPostsLayout.astro  ← listing layout
          index.js
        scripts/
          navbar.ts         ← hamburger, dropdown, keyboard, scroll behavior
          sectionFlow.ts    ← intersection observer for .flow-step reveal
          headerStandard.ts ← 3D tilt + text reveal for HeaderStandard
        styles/
          global.css        ← CSS variables, base reset, typography
        utils/
          helpers.ts        ← getPlatformIcon, calculateTimeAgo, formatDate, calculateReadingTime
          index.js
        config.ts           ← type definitions + config loader
      configs/              ← consumer config files (NOT part of @walle/)
        app.json
        navbar.json
        footer.json
        index.ts
      styles/
        global.css          ← consumer overrides and @font-face declarations
  scripts/
    @walle/
      cli.sh                ← init and update CLI
```

---

## Consumer zones

These paths belong to the consumer and are never overwritten by `cli.sh update`:

| Path | Purpose |
|---|---|
| `src/configs/` | JSON config files (app, navbar, footer) |
| `src/styles/global.css` | Font declarations, CSS variable overrides |
| `src/components/` | Consumer-specific components |
| `src/pages/` | All routes |
| `src/content/` | Blog and other content collections |

**The `@walle/` directory is read-only in consumers.** Any change there will be overwritten on next `just walle-update`. Customize via slots, CSS variables, and config files only.

---

## Config schema

### `src/configs/app.json`

```json
{
  "astro": {
    "baseUrl": "https://example.com",
    "basePath": "/",
    "trailingSlash": "never",
    "analyticsScriptContent": ""
  },
  "website": {
    "title": "Site Title",
    "description": "Description",
    "favicon": "/favicon.svg",
    "image": "/og-image.jpg",
    "robots": "index, follow",
    "language": "en"
  }
}
```

### `src/configs/navbar.json`

```json
{
  "logo": {
    "src": "/logo.svg",
    "title": "Brand",
    "url": "/",
    "width": 120,
    "height": 40,
    "alt": "Brand logo"
  },
  "items": [
    { "name": "Home", "url": "/" },
    { "name": "Blog", "url": "/blog" },
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

**Max 2 levels deep.** The `dropdown` key accepts `NavigationLink[]` without nested `dropdown` (enforced by the type `Omit<NavigationLink, "dropdown">[]`). Three-level nesting was removed and is not supported.

### `NavigationLink` type

```typescript
interface NavigationLink {
  name?: string;
  url: string;
  icon?: string;
  target?: "_blank" | "_self";
  dropdown?: Omit<NavigationLink, "dropdown">[];
}
```

If `target` is omitted, the Navbar resolves it automatically: external URLs (`http*`) get `_blank`, internal URLs get `_self`.

---

## Component catalog

### Elements

#### `Badge`
Inline label. Can be a link.

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Label text |
| `color` | `"primary" \| "secondary" \| "alternative" \| "gray" \| "success" \| "warning" \| "danger"` | `"gray"` | Color variant |
| `iconName` | `string` | — | astro-icon name |
| `iconPosition` | `"start" \| "end"` | `"end"` | Icon side |
| `link` | `string` | — | Makes badge a link |
| `target` | `string` | — | Link target |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size |
| `extraClass` | `string` | — | Additional CSS classes |

#### `Button`
Button or link-wrapped button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Button label |
| `link` | `string` | — | Renders as `<a>` when set |
| `type` | `"primary" \| "secondary" \| "white"` | `"primary"` | Visual style |
| `outline` | `boolean` | `false` | Outline variant |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size |
| `fullWidth` | `boolean` | `false` | Full container width |
| `iconName` | `string` | — | astro-icon name |
| `target` | `string` | — | Link target |
| `disabled` | `boolean` | `false` | Disabled state |
| `disableEffects` | `boolean` | `false` | Removes animations |
| `buttonType` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type |
| `id` | `string` | — | HTML id |
| `extraClass` | `string` | — | Additional CSS classes |

### Features

#### `Head`
Renders all `<head>` meta tags. Used inside layouts — not imported directly in pages.

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | required |
| `description` | `string` | from config |
| `image` | `string` | from config |
| `ogImage` | `string` | falls back to `image` |
| `robots` | `string` | from config |
| `favicon` | `string` | from config |

#### `Navbar`
Full navigation bar. Reads config from `config.navbar` by default; accepts explicit `config` prop.

| Prop | Type | Description |
|---|---|---|
| `config` | `NavbarConfig` | Navbar config |

**Slots:**
- `brand` — replaces the logo area
- `actions` — appended at end of nav (for CTA buttons)

#### `Footer`
Site footer. No required props; reads from `config.footer`.

#### `Analytics`
Injects analytics script in production only.

| Prop | Type | Description |
|---|---|---|
| `enable` | `boolean` | Only active when `true` |
| `scriptContent` | `string` | Raw script content to inject |

#### `Breadcrumbs`
Renders structured breadcrumb trail.

#### `BasicCard`
General-purpose content card.

#### `Section`
Content section wrapper with optional title and color variant.

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | — |
| `centered` | `boolean` | `true` |
| `type` | `"primary" \| "gray" \| null` | `null` |

#### `SectionFlow`
Animated process/step list with scroll-triggered reveal.

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | required |
| `steps` | `FlowStep[]` | required |
| `centered` | `boolean` | `true` |
| `type` | `"primary" \| "gray" \| null` | `null` |

```typescript
interface FlowStep {
  number: number;
  title: string;
  description: string;
  icon?: string;
}
```

#### `SectionHeaderStandard`
Full-width page header with optional image, 3D tilt on hover, and text reveal animation.

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | required |
| `subtitle` | `string` | — |
| `imageSrc` | `ImageMetadata` | — |
| `imageAlt` | `string` | `""` |
| `imageRight` | `boolean` | `false` |
| `variant` | `"primary" \| "secondary" \| "white"` | `"primary"` |
| `centered` | `boolean` | `true` |
| `effect` | `boolean` | `false` |

#### Blog components
- `BlogArticleNavigation` — previous/next article links
- `BlogFilters` — tag/category filter UI
- `BlogReadingProgress` — scroll progress bar
- `BlogTableOfContents` — sticky TOC from headings

---

## Layout catalog

### `AbstractLayout`
Base HTML wrapper. Loads `Head`, `global.css`, and `Analytics`.

**Props:** `headerTitle`, `headerDescription`, `headerImage`, `headerOgImage`, `headerRobots`, `headerLanguage`

**Slots:**
- `head` — injected inside `<head>` after `<Head />`
- (default) — body content

### `BaseLayout`
Extends `AbstractLayout`. Adds `<Navbar>` and `<Footer>`.

**Inherits all props from `AbstractLayout`.**

**Slots:**
- `head` — forwarded to `AbstractLayout`
- `navbar` — replaces default `<Navbar>`
- `footer` — replaces default `<Footer>`
- (default) — page content inside `<main>`

### `BlogPostLayout`
Single blog post. Accepts post frontmatter via props and renders title, date, reading time.

### `BlogPostsLayout`
Blog listing page. Accepts `title`, `description`, `posts[]`.

---

## Customization contract

### CSS variables (override in `src/styles/global.css`)

```css
:root {
  /* Brand colors */
  --primary: #0046ad;
  --primary-light: #0153ce;
  --primary-dark: #00216e;
  --secondary: #bd1178;
  --alternative: #ffcc00;

  /* Neutrals */
  --white: #fefefe;
  --black: #161616;
  --gray: #ebebeb;
  --gray-light: #f5f5f5;
  --gray-medium: #d1d5db;
  --gray-dark: #6b7280;
  --gray-darker: #374151;

  /* Typography */
  --font-body: system-ui, -apple-system, sans-serif;
  --font-heading: var(--font-body);

  /* Spacing */
  --space-xs / --space-sm / --space-md / --space-lg / --space-xl / --space-2xl / --space-3xl / --space-4xl

  /* Radius */
  --radius-sm / --radius-md / --radius-lg / --radius-xl

  /* Shadows */
  --box-shadow: ...;
  --box-shadow-hover: ...;

  /* Transitions */
  --transition: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-smooth: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Fonts

`@walle/` ships with no fonts. Declare `@font-face` in `src/styles/global.css`, then set the variables:

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
}

:root {
  --font-body: "MyFont", system-ui, sans-serif;
  --font-heading: "MyFont", system-ui, sans-serif;
}
```

### Slot overrides

Replace navbar or footer entirely without touching `@walle/`:

```astro
<BaseLayout>
  <MyCustomNavbar slot="navbar" />
  <MyCustomFooter slot="footer" />
</BaseLayout>
```

Inject extra `<head>` tags (fonts, preloads, per-page meta):

```astro
<BaseLayout>
  <link rel="preload" href="/fonts/myfont.woff2" as="font" crossorigin slot="head" />
</BaseLayout>
```

---

## CLI usage

### Init new consumer project

```bash
curl -fsSL https://raw.githubusercontent.com/FabrizioCafolla/walle-design-system/main/lib/scripts/@walle/cli.sh \
  | bash -s -- init --project-name <name>
```

Options:
- `--project-name <name>` (required)
- `--dir-path <path>` (optional, defaults to current directory)

### Update `@walle/` in an existing consumer

```bash
just walle-update
```

This re-downloads `cli.sh` from `main` and runs `just walle update` in the consumer project. Only the `src/@walle/` directory is replaced; consumer config and styles are untouched.

### Development

```bash
just setup   # install dependencies
just dev     # start dev server at http://localhost:4321
just build   # production build
```

---

## Conventions

- Components use Astro's scoped `<style>` by default. Navbar uses `<style is:global>` intentionally so CSS classes apply to `NavbarMenu`, `NavbarItem`, and `NavbarDropdown` child components across scope boundaries.
- Client-side scripts live in `@walle/scripts/`. Each file exports an `init*` function and registers it on both `DOMContentLoaded` and `astro:page-load` for view transition compatibility.
- Scripts that need a server-generated element ID pass it via a `data-*` attribute on the element (e.g., `data-walle-header` on `HeaderStandard`). The script reads it from the DOM; it never uses `define:vars`.
- Icon names follow the `astro-icon` convention: `"fa:github"`, `"mdi:home"`, etc.

---

## What agents should avoid

- Do not edit files inside `src/@walle/` in consumer projects — they are overwritten on update.
- Do not add 3-level navbar nesting — the system enforces max depth 2 via TypeScript types.
- Do not use `define:vars` in new scripts — use `data-*` attributes and DOM reads instead.
- Do not hardcode font names in `@walle/styles/global.css` — fonts are the consumer's responsibility via CSS variables.
- Do not add `@font-face` blocks to `@walle/styles/global.css` — they belong in the consumer's `src/styles/global.css`.
- Do not install new npm packages in `lib/website/package.json` without updating the dependency table in README.md.
- Do not push directly to `main`.
