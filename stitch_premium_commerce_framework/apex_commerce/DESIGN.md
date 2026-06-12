---
name: Apex Commerce
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006229'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e37'
  on-tertiary-container: '#c1ffc5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  hero:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  hero-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  h1:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  h2:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  h3:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  max_width: 1440px
  content_width: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a premium e-commerce experience that balances the technical precision of Stripe, the consumer-friendly elegance of Apple, and the commercial robustness of Shopify. The brand personality is **refined, authoritative, and frictionless**.

The visual style is **Modern Minimalism** with a focus on high-fidelity details. It utilizes ample whitespace, high-contrast typography, and subtle tactile elements to create a sense of luxury and reliability. Depth is achieved through sophisticated layering and soft, realistic shadows rather than heavy borders. The goal is to evoke an emotional response of "effortless sophistication" where the product photography is the hero, supported by a world-class interface.

## Colors

The palette is anchored by a vibrant **Primary Blue** (#2563EB) used for key actions and brand moments. The **Amber Accent** (#F59E0B) is reserved for highlighting promotions, ratings, or secondary calls to action. 

The neutral scale is critical for the "Apple-inspired" look:
- **Text:** Deep slate (#0F172A) provides high legibility.
- **Background:** Pure white (#FFFFFF) maintains a clean, open feel.
- **Surface:** A soft off-white (#F8FAFC) is used to differentiate containers and sections without adding visual noise.
- **Border:** Subtle grey (#E2E8F0) ensures structural definition remains secondary to content.

## Typography

This design system uses a dual-font approach. **Geist** is utilized for headlines and labels to provide a technical, modern edge with its precise geometry. **Inter** is used for body copy to ensure maximum readability and a friendly, accessible feel for longer text blocks.

Tighten letter-spacing on larger headlines (Hero, H1) to create a high-fashion, editorial look. Ensure all text roles maintain a minimum contrast ratio of 4.5:1 against their backgrounds.

## Layout & Spacing

The layout is built on a **12-column fluid grid** that caps at a max-width of 1440px. All internal spacing follows a strict **8px base system** (4, 8, 16, 24, 32, 48, 64) to ensure mathematical harmony.

**Responsive Behavior:**
- **Desktop (1024px+):** 12 columns, 1280px content width, 24px gutters.
- **Tablet (768px - 1023px):** 8 columns, 32px side margins, 16px gutters.
- **Mobile (Below 768px):** 4 columns, 16px side margins, 16px gutters. Use the `hero-mobile` type scale for main headings.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. 

1.  **Level 0 (Base):** Background (#FFFFFF).
2.  **Level 1 (Cards/Inputs):** Surface (#F8FAFC) or White with a 1px border (#E2E8F0).
3.  **Level 2 (Floating):** Soft shadow (0px 4px 20px rgba(15, 23, 42, 0.05)). Used for standard product cards.
4.  **Level 3 (Overlay/Hover):** Enhanced shadow (0px 12px 32px rgba(15, 23, 42, 0.12)). Used for menus, modals, and active card hover states.

Apply a subtle **Glassmorphism** effect (Backdrop blur: 12px, Opacity: 80%) specifically for the Sticky Navigation Bar and occasional image overlays to maintain a premium, airy feel.

## Shapes

The shape language is sophisticated and friendly, utilizing a tiered corner radius system:
- **Small (8px):** Checkboxes, small buttons, and tags.
- **Medium (12px):** Default for primary buttons, input fields, and small cards.
- **Large (20px):** Product cards, promo banners, and modal containers.
- **Hero (32px):** Large hero sections and featured collection containers.

## Components

### Buttons
- **Primary:** Solid Primary Blue (#2563EB) with white text. 12px radius. On hover, darken to #1D4ED8. On active, scale slightly (98%).
- **Secondary:** White background with 1px border (#E2E8F0). On hover, light grey surface (#F8FAFC).
- **Ghost:** No background or border. Primary Blue text.

### Input Fields
- **Default:** 1px border (#E2E8F0), 12px radius, Inter 16px.
- **Focus State:** 1px Primary Blue border with a 4px soft blue outer glow (alpha 10%).

### Product Cards
- Use a white background with a 20px radius. 
- Image aspect ratio: 4:5 for fashion or 1:1 for tech.
- On hover: Apply Level 3 elevation (deeper shadow) and a subtle image zoom (105%).

### Interactive Elements
- **Chips/Badges:** Use a 10% opacity background of the label color (e.g., Success Green at 10% for "In Stock").
- **Checkboxes:** 8px radius. When checked, use Primary Blue with a white checkmark.
- **Lists:** Use 16px padding with a subtle bottom divider (#F1F5F9).

### Additional Components
- **Cart Drawer:** Use Level 3 elevation with a backdrop blur on the main content.
- **Breadcrumbs:** Caption style, using "/" as a separator with 50% opacity.