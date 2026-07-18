## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## 2024-03-24 - Project Details Close Button Accessibility
**Learning:** Modal close buttons are often just icons (like an X) which are inaccessible to screen readers without an aria-label. Additionally, keyboard users need visible focus indicators to know when they've navigated to the close button.
**Action:** Add aria-labels to icon-only buttons, aria-hidden to decorative icons inside them, and focus-visible utilities for keyboard navigation.
