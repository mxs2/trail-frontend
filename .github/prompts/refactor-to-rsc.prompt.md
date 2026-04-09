---
name: 'Refactor to RSC'
description: 'Refactor a component to utilize React Server Components (RSC) and separate client-side interactive parts into a new client component.'
---

# Intent

Examine the following file and break out any client-side interactivity (like `useState`, `useEffect`, or passing functions/React components as props to MUI components) into a new Client Component file, keeping the parent as a React Server Component (no `"use client"`).

# Rules

- Do not add `"use client"` to the parent if not needed.
- Create minimal client boundaries.
- Ensure the newly created Client Component is imported correctly.
- Update styling using the MUI `sx` prop or Tailwind CSS as originally intended.
- Preserve all TypeScript annotations.
