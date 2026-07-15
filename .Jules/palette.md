## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.
