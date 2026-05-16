---
name: ui-components
description: >
  Premium UI component design, styling, and design system for the Task Management
  System frontend. Use when building pages, creating reusable components, applying
  colors, typography, animations, or glassmorphism. Covers Login Page, Admin Dashboard,
  User Dashboard, modals, cards, and the dark-mode design system.
---

# UI Components & Design System — Frontend

## Design Philosophy

- **Premium dark theme** with glassmorphism effects and depth.
- **Vibrant accent colors** on a deep dark canvas.
- **Micro-animations** on every interaction — hover, focus, loading.
- **Glass cards** with frosted-glass blur backgrounds.
- **Gradient accents** for primary buttons and highlights.
- Must feel like a **modern SaaS product**, not a basic CRUD app.

## Google Font

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

## Design Tokens

```css
:root {
  /* ─── Backgrounds ─── */
  --bg-base: #08080d;
  --bg-surface: #111118;
  --bg-card: rgba(255, 255, 255, 0.04);
  --bg-card-hover: rgba(255, 255, 255, 0.07);
  --bg-elevated: rgba(255, 255, 255, 0.06);
  --bg-glass: rgba(255, 255, 255, 0.05);

  /* ─── Brand Gradient ─── */
  --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
  --gradient-accent: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  --gradient-card: linear-gradient(145deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04));

  /* ─── Brand Colors ─── */
  --color-primary: #6366f1;
  --color-primary-hover: #818cf8;
  --color-primary-muted: rgba(99, 102, 241, 0.15);
  --color-secondary: #8b5cf6;

  /* ─── Status Colors ─── */
  --color-pending: #f59e0b;
  --color-pending-bg: rgba(245, 158, 11, 0.12);
  --color-progress: #3b82f6;
  --color-progress-bg: rgba(59, 130, 246, 0.12);
  --color-completed: #10b981;
  --color-completed-bg: rgba(16, 185, 129, 0.12);

  /* ─── Semantic ─── */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.12);
  --color-info: #3b82f6;

  /* ─── Text ─── */
  --text-primary: #f4f4f8;
  --text-secondary: #a1a1b5;
  --text-muted: #6b6b80;
  --text-inverse: #08080d;

  /* ─── Border ─── */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-focus: rgba(99, 102, 241, 0.5);

  /* ─── Radius ─── */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* ─── Font ─── */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* ─── Shadows ─── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.2);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.04);

  /* ─── Transitions ─── */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Global Reset & Base (index.css)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-family);
  background: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* Subtle animated gradient background */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

::selection { background: var(--color-primary); color: white; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-surface); }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: var(--radius-full); }
```

---

## Task Status Badge

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.status-badge::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.status-badge.pending     { background: var(--color-pending-bg);   color: var(--color-pending); }
.status-badge.in-progress { background: var(--color-progress-bg);  color: var(--color-progress); }
.status-badge.completed   { background: var(--color-completed-bg); color: var(--color-completed); }
```

---

## Pages — Detailed Specs

### 1. Login Page (`/login`)

**Layout:**
- Full viewport height, centered vertically & horizontally.
- Subtle radial gradient background (indigo/violet glow in corners).
- Glass card (frosted effect) containing the form.

**Card Design:**
- `background: var(--bg-glass)`, `backdrop-filter: blur(20px)`, `border: 1px solid var(--border-subtle)`.
- App logo/icon at top (task management icon or gradient text logo).
- `"Welcome back"` heading + `"Sign in to your account"` subtext.
- Email input with icon prefix.
- Password input with icon prefix + show/hide toggle.
- Gradient primary submit button (full width).
- Error message with danger color + shake animation on failure.

**Micro-animations:**
- Card fades in + slides up on mount (opacity 0→1, translateY 20px→0).
- Button has gradient shimmer on hover.
- Input border transitions to `--border-focus` on focus with subtle glow.
- Loading spinner inside button during API call.

### 2. Admin Dashboard (`/admin`)

**Layout:**
- Sidebar (fixed left, 260px wide, dark glass background).
- Main content area with Header bar at top.

**Sidebar:**
- App brand/logo at top.
- Navigation links with active indicator (left border glow or background highlight).
- User avatar + name + role badge at bottom.
- Logout button with icon.

**Header Bar:**
- Page title ("Dashboard").
- Search bar (optional).
- User greeting ("Welcome, Admin").

**Dashboard Content:**

*Stats Row (4 glass cards):*
- Total Tasks / Pending / In Progress / Completed.
- Each card: icon (with colored glass background circle), count (large number, font-weight 800), label.
- Subtle count-up animation on mount.
- Colored left border accent matching the stat type.

*Users Section:*
- Section header with "Users" title + "Create User" gradient button.
- Table with glass row hover effects.
- Columns: Name, Email, Role (badge), Date Created, Actions.
- Role badge: ADMIN = gradient badge, USER = subtle badge.
- "Create User" opens a glass modal overlay.

*Tasks Section:*
- Section header with "Tasks" title + "Create Task" gradient button.
- Status filter tabs (All / Pending / In Progress / Completed) with animated active underline.
- Task cards in a grid (2-3 columns responsive).
- Each card: title, description preview, status badge, assignee avatar + name, created date.
- "Assign" button on unassigned tasks → opens user selector dropdown modal.
- Card hover: slight lift (translateY -4px) + shadow increase + border glow.

### 3. User Dashboard (`/dashboard`)

**Layout:** Same sidebar + header as admin but with user-specific nav.

**Dashboard Content:**

*Stats Row (3 glass cards):*
- My Pending / My In Progress / My Completed task counts.

*My Tasks:*
- Card grid of assigned tasks.
- Each card: title, description, status badge, created date.
- Status update dropdown with smooth transition animation.
- Visual feedback on status change (checkmark animation for completed, pulse for in-progress).
- Empty state: illustration/icon + "No tasks assigned yet" message with muted text.

---

## Glass Card Component

```css
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
              border-color var(--transition-fast);
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  border-color: var(--border-default);
}
```

## Primary Button

```css
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}
.btn-primary:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: translateY(0);
}
/* Shimmer effect */
.btn-primary::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s;
}
.btn-primary:hover::after { left: 100%; }
```

## Input Fields

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}
.input-field::placeholder { color: var(--text-muted); }
.input-field:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

## Modal Overlay

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn var(--transition-fast) ease-out;
}
.modal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  animation: slideUp var(--transition-base) ease-out;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
```

## Table Styles

```css
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
}
.data-table th {
  padding: 12px 16px;
  text-align: left;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.data-table td {
  padding: 16px;
  background: var(--bg-card);
  transition: background var(--transition-fast);
}
.data-table tr:hover td {
  background: var(--bg-card-hover);
}
.data-table tr td:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.data-table tr td:last-child  { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
```

## Sidebar

```css
.sidebar {
  position: fixed;
  left: 0; top: 0;
  width: 260px;
  height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 50;
}
.sidebar .nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
}
.sidebar .nav-link:hover { background: var(--bg-card); color: var(--text-primary); }
.sidebar .nav-link.active {
  background: var(--color-primary-muted);
  color: var(--color-primary-hover);
  border-left: 3px solid var(--color-primary);
}
```

## Animations

```css
/* Fade in up — apply to cards/pages on mount */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-in { animation: fadeInUp 0.4s ease-out forwards; }

/* Pulse — for live indicators */
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Shake — for error feedback */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-6px); }
  75%      { transform: translateX(6px); }
}
.shake { animation: shake 0.3s ease; }

/* Spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 20px; height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```
