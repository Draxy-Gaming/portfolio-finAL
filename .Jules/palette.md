## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## 2026-07-21 - Dynamic Toast Notification Accessibility & Form Submission UX
**Learning:** Dynamic, asynchronously rendered toast notifications (like success/error messages after a form submission) are completely invisible to screen readers unless marked with `role="alert"` and `aria-live="assertive"`. Furthermore, leaving async form buttons active during a request can result in confusing double submissions or unintended errors, leading to degraded UX.
**Action:** Ensure all dynamic, non-intrusive alert messages use proper ARIA live regions (`role="alert" aria-live="assertive"`). Additionally, always apply disabled states with proper styling (`disabled:opacity-50 disabled:cursor-not-allowed`) to submit buttons during asynchronous requests.
