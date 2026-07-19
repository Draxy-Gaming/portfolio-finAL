## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## 2024-07-19 - Modal Accessibility Patterns
**Learning:** Modals in this application (like ProjectDetails) lacked basic accessibility patterns, specifically missing Escape key support to close, visible focus states on interactive elements, and proper aria-labels on icon-only buttons.
**Action:** When implementing or modifying overlay/modal components, always include a `useEffect` hook to listen for the "Escape" key, add `focus-visible` classes to all buttons and links, and ensure icon-only buttons have descriptive `aria-label` attributes while the inner decorative images are marked with `aria-hidden="true"`.
