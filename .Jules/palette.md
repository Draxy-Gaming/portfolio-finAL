## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.
## 2026-07-17 - Added ARIA Label to Close Button
**Learning:** Icon-only close buttons in ProjectDetails lacked accessible names, making them difficult for screen readers to identify. Adding `aria-hidden` to the decorative SVG is also a good pattern to prevent redundant reading.
**Action:** Always ensure icon-only interactive elements (like buttons and links) have descriptive `aria-label` attributes and their decorative inner images are explicitly hidden with `alt="" aria-hidden="true`.
