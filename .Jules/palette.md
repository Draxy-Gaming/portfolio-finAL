## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## $(date +%Y-%m-%d) - Modal Action Accessibility
**Learning:** Icon-only modal close buttons and decorative link icons in this project's modals often lack context. Keyboard focus states (`focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:rounded-sm`) are critical for navigation within modals where the visual boundary is restricted.
**Action:** Always add `aria-label` to close buttons, use `aria-hidden="true"` and `alt=""` for decorative icons, and ensure `focus-visible` states are present on all interactive modal elements.

## 2026-08-02 - State Change Announcement
**Learning:** Buttons that trigger temporary state changes (like 'Copy to Clipboard' buttons) need to communicate this change to screen readers, often via `aria-live` regions or dynamic `aria-label` updates. Additionally, these custom buttons frequently miss the standard focus rings needed for keyboard users.
**Action:** Add `aria-live="polite"` to elements whose content changes dynamically, use dynamic `aria-label` for changing button states, and consistently apply `focus:outline-none focus-visible:ring-2 focus-visible:ring-[color]` patterns.
