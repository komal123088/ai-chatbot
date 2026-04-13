# 🤖 Gemini AI Studio

A full-featured AI SaaS application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and the **Google Gemini API**.

## ✨ Features

- **Landing Page** — Dark-theme hero with animated grid, stats, tool showcase, and CTA
- **Dashboard** — Collapsible sidebar, overview with quick-start prompts, model status
- **AI Chat** — ChatGPT-style interface with message history, streaming, suggested prompts, copy buttons
- **Code Generator** — Generate, explain, debug, refactor, or write tests. Syntax highlighting via `react-syntax-highlighter`. 16 languages supported.
- **Text Summarizer** — 4 summary modes (Bullet Points, TL;DR, Key Points, Outline) with copy-all
- **Dark / Light Theme** — Toggle everywhere via `next-themes`, persisted across sessions
- **Mobile Responsive** — Hamburger nav, responsive grids, touch-friendly inputs

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set your Gemini API key
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```
Get a free key at: https://aistudio.google.com/app/apikey

### 3. Run
```bash
npm run dev
```
Open http://localhost:3000

## 🗂 Project Structure

```
app/
  page.tsx                  # Landing page
  dashboard/
    layout.tsx              # Sidebar layout
    page.tsx                # Overview
    chat/page.tsx           # AI Chat
    code/page.tsx           # Code Generator
    summarizer/page.tsx     # Text Summarizer
components/
  ThemeProvider.tsx         # next-themes wrapper
  ThemeToggle.tsx           # Sun/Moon toggle button
lib/
  gemini.ts                 # Gemini API client
```

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| @google/generative-ai | Gemini API |
| react-syntax-highlighter | Code blocks |
| next-themes | Dark/light mode |
| lucide-react | Icons |
| Google Fonts (Syne + DM Sans) | Typography |

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |

## 🎨 Design System

- **Colors**: Teal/Cyan accent (`#14b8a6`), Slate neutrals
- **Typography**: Syne (display/headings) + DM Sans (body) + JetBrains Mono (code)
- **Theme**: Dark-first with full light mode support
- **Animations**: Fade-in, slide-up, typing indicator dots
