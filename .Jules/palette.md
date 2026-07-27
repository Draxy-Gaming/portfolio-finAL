## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## $(date +%Y-%m-%d) - Modal Action Accessibility
**Learning:** Icon-only modal close buttons and decorative link icons in this project's modals often lack context. Keyboard focus states (`focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:rounded-sm`) are critical for navigation within modals where the visual boundary is restricted.
**Action:** Always add `aria-label` to close buttons, use `aria-hidden="true"` and `alt=""` for decorative icons, and ensure `focus-visible` states are present on all interactive modal elements.

## 2026-07-27 - External Social Links Accessibility
**Learning:** Icon-only external links in the footer lack context for screen readers and visible focus states for keyboard users. They also need proper target attributes for security and usability.
**Action:** Add `aria-label` to the link to describe the destination, use `aria-hidden="true"` and `alt=""` for the decorative image inside the link, apply `target="_blank"` and `rel="noreferrer"` to open external links safely, and implement `focus-visible:ring-2 focus-visible:ring-neutral-400` for keyboard navigation.
