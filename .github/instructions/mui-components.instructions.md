---
description: 'Use when creating, fixing, or modifying UI components, pages, or styling in the Next.js App Router using Material UI (MUI) and Tailwind CSS.'
applyTo: 'app/**/*.tsx, components/**/*.tsx'
---

# UI & React Component Guidelines

## RSC vs Client Components

- Avoid `"use client"` unless absolutely necessary.
- **When to use `"use client"`:** You need React hooks (`useState`, `useEffect`), Event Listeners, or Browser APIs.
- **MUI Pitfall:** Passing a React Component or function as a prop (e.g., `component={Link}`) to a Client Component like MUI's `Button` or `AppBar` requires the parent component to be marked with `"use client"`. Failure to do so will result in an RSC serialization error.

## Material UI Integration

- Use the `sx` prop for customized, theme-dependent styling (e.g., `sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}`).
- Favor `Box`, `Stack`, and `Grid` from `@mui/material` for component-level layout structure.
- Adhere to the customized Avanade theme defined in `app/providers.tsx`. Use named colors from the theme rather than raw hex codes where possible.

## Tailwind CSS Interaction

- Use Tailwind classes (`className="..."`) for simple flexbox container wrappers, margins, and padding around components where MUI wrappers might be too verbose.

## Links & Navigation

- Always use `next/link` for internal routing.
- When combining `next/link` with MUI components, use the `component` prop:
  `<Button component={Link} href="/destination">Go</Button>`
