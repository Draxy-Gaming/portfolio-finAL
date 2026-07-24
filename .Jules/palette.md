## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## $(date +%Y-%m-%d) - Modal Action Accessibility
**Learning:** Icon-only modal close buttons and decorative link icons in this project's modals often lack context. Keyboard focus states (`focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:rounded-sm`) are critical for navigation within modals where the visual boundary is restricted.
**Action:** Always add `aria-label` to close buttons, use `aria-hidden="true"` and `alt=""` for decorative icons, and ensure `focus-visible` states are present on all interactive modal elements.

## $(date +%Y-%m-%d) - Form Label Readability & Indicator Alignment
**Learning:** Typographical utility classes are essential for visual hierarchy but are brittle if misspelled. Missing visible "required" indicators on explicitly `required` inputs breaks expected UX and harms accessibility.
**Action:** Always verify custom utility class spellings (e.g., `field-label`) to maintain design consistency and explicitly mark required inputs with visible indicators like red asterisks.
