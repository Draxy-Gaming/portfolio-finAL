## 2023-10-27 - Mobile Navigation Toggle Accessibility
**Learning:** Icon-only navigation buttons lack context for screen readers and visible focus states for keyboard users by default. It's critical to add `aria-label`, `aria-expanded`, and explicitly hide decorative icons inside them with `aria-hidden="true"`.
**Action:** Always check icon-only buttons for missing ARIA labels and ensure interactive elements have clear, visible focus states using utility classes like `focus-visible:ring-2`.

## $(date +%Y-%m-%d) - Modal Action Accessibility
**Learning:** Icon-only modal close buttons and decorative link icons in this project's modals often lack context. Keyboard focus states (`focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:rounded-sm`) are critical for navigation within modals where the visual boundary is restricted.
**Action:** Always add `aria-label` to close buttons, use `aria-hidden="true"` and `alt=""` for decorative icons, and ensure `focus-visible` states are present on all interactive modal elements.

## $(date +%Y-%m-%d) - External Social Link Accessibility
**Learning:** External icon-only social links in footers lack accessible names and explicit boundaries for keyboard users. By default they announce only as "link" or their target URL. Furthermore, opening links in the same tab can cause users to lose context of the application.
**Action:** Always add `aria-label` based on the network's name (e.g., "LinkedIn"), hide the inner decorative image with `aria-hidden="true"`, provide explicit `focus-visible:ring-2` states for keyboard navigation, and add `target="_blank" rel="noreferrer"` so users don't lose the main site.
