# 🎨 Style Guide

Design system for the National School Climate Center platform.

> **Note**: Colors and fonts are configured in `src/index.css`. Use the Tailwind utility classes below.

## Design System

### Colors

```jsx
// Primary (headers, nav, CTAs)
className="bg-primary text-primary-foreground"

// Secondary (hover, secondary buttons)
className="bg-secondary text-secondary-foreground"

// Accents
className="bg-accent-plum"    // Highlights, dividers
className="bg-accent-purple"  // Complementary
className="bg-accent-gold"    // Warm accent

// Text
className="text-heading"      // Headings (#1C1C1C)
className="text-body"         // Body text (#6C7A89)
className="text-foreground"   // General text

// Background
className="bg-background"     // Page background (#EAF8FD)
```

### Typography

**Fonts**: Raleway (headings) • Roboto (body)

```jsx
// Headings
<h1 className="font-heading text-4xl font-bold text-heading">
<h2 className="font-heading text-3xl font-semibold text-heading">
<h3 className="font-heading text-2xl font-semibold text-heading">

// Body
<p className="font-body text-base text-body">
<span className="font-body text-sm text-body">
```

### Spacing
- Use Tailwind scale: `p-4`, `p-6`, `my-8`, `my-12`
- Cards: `p-4` to `p-6`
- Sections: `my-8` to `my-12`

## Components

### Buttons (Shadcn/ui)

```jsx
// Primary
<Button className="bg-primary hover:bg-primary/90">Submit</Button>

// Secondary
<Button variant="outline" className="border-secondary text-secondary">Cancel</Button>

// Accent
<Button className="bg-accent-plum hover:bg-accent-plum/90">Export</Button>

// Sizes: default (h-10), lg (h-12), sm (h-8)
```

### Forms (Shadcn/ui)

```jsx
// Input with validation
<Input className="border-body/30 focus:border-primary" />
<Input className="border-red-500" /> // Error state

// Required fields: mark with asterisk in text-accent-plum
```

### Cards (Shadcn/ui)

```jsx
<Card className="p-6 bg-white border-body/20">
  <CardTitle className="text-heading font-heading">Title</CardTitle>
  <CardContent className="text-body font-body">Content</CardContent>
</Card>
```

### Layout

```jsx
// Page container
<div className="max-w-7xl mx-auto">

// Dashboard grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Form
<div className="max-w-2xl mx-auto">
```

## Code Standards

### CSS/Styling
- Use Tailwind utility classes
- Use Shadcn/ui components as base
- Avoid custom CSS unless necessary
- Group utilities: layout → spacing → colors → typography

### Component Files
- Components: PascalCase (`SurveyCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)

### Responsive Design
- **Mobile-first**: Base styles = mobile, scale up with `md:`, `lg:`
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch targets**: Minimum `h-12` for buttons on mobile

## User Experience

### Accessibility
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels to icon-only buttons
- Ensure keyboard navigation works

## Icons

Use **Lucide React** for all icons.

```jsx
import { Home, Download } from 'lucide-react';

<Home className="h-5 w-5" />
<Button><Download className="h-4 w-4 mr-2" />Export</Button>
```

---

**Questions?** Discuss in team meetings.