## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## $(date +%Y-%m-%d) - Modal Action Accessibility
**Learning:** Icon-only modal close buttons and decorative link icons in this project's modals often lack context. Keyboard focus states (`focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:rounded-sm`) are critical for navigation within modals where the visual boundary is restricted.
**Action:** Always add `aria-label` to close buttons, use `aria-hidden="true"` and `alt=""` for decorative icons, and ensure `focus-visible` states are present on all interactive modal elements.

## 2024-05-18 - Dynamic Button State Announcements
**Learning:** When a button dynamically changes its text (e.g., from "Copy Email" to "Copied"), screen readers may not announce the new state if it's not configured correctly. Moreover, if the button contains decorative icons that change along with the text, the screen reader might redundantly announce the icon's alt text before reading the updated button text, leading to a confusing and noisy experience.
**Action:** Use `aria-live="polite"` on buttons that dynamically change text to ensure the change is announced. Always set `aria-hidden="true"` and `alt=""` on decorative icons inside such buttons to prevent redundant and overlapping announcements.
