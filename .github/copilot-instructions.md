# Trail Frontend - Project Guidelines

## Overview

This is a Full Stack Web Application frontend developed for the Porto Digital tech residency. It is a training platform ("Trail") with realistic challenges.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **UI Library**: Material UI (MUI)
- **Styling**: Tailwind CSS + Emotion (via MUI `sx` props)
- **State Management**: Zustand
- **Language**: TypeScript

## Code Style & Architecture

- Use **Next.js App Router** conventions (`app/page.tsx`, `app/layout.tsx`).
- Prefer **React Server Components (RSC)** by default.
- Add `"use client"` only when using React hooks (`useState`, `useEffect`), Event Listeners, Browser APIs, or when passing non-serializable props (like functions or components such as `next/link`) to Client Components (like MUI's `Button`).
- Keep shared components in the `components/` directory using named exports (`export function MyComponent`).
- Keep page components default-exported (`export default function Page`).

## Styling Standards

- The project follows **Avanade Brand Colors**:
  - Primary: Magenta/Pink (`#D8005A`)
  - Secondary: Orange (`#FF6200` to `#FF5C35`)
  - Dark Navy for text/backgrounds.
- Combine MUI for robust isolated components and Tailwind CSS for utility-first responsive layouts.

## Language and Context

- The user-facing application language is **Portuguese (pt-BR)**. Generate copy, labels, and text in Portuguese.
- Meaningful variable names, component names, and code structure should remain in **English**.
