* When creating or modifying UI components, prioritize accessibility (e.g., ARIA labels and `aria-hidden` attributes for icon-only buttons) and keyboard navigation (focus states). Strictly reuse existing Tailwind classes rather than adding custom CSS.
* The development environment is started via the 'dev' script, which concurrently runs a Vite frontend and a Node/Express backend (`server/index.js`) using `better-sqlite3`.
* The project is an interactive 3D personal portfolio that leverages @react-three/fiber, @react-three/drei, and motion/react.
* For animations, the project uses `motion` v12+. Always import from `motion/react` instead of the legacy `framer-motion` package to prevent build errors.
* Strictly use `pnpm` for all dependency management and script executions (e.g., `pnpm install`, `pnpm build`, `pnpm lint`); never use `npm` or `yarn`.
* The project does not have a configured test suite; the `test` script is missing from package.json.
* Critical UX/accessibility learnings and reusable patterns specific to this application should be documented in `.Jules/palette.md`.
* The frontend is a React Single Page Application (SPA) built with Vite and Tailwind CSS.

## 2025-07-26 - Keyboard Navigation & Screen Reader Redundancy
**Learning:** Many interactive elements (buttons, links) in the portfolio lacked visible focus states for keyboard navigation, making it difficult for keyboard-only users to navigate the site. Additionally, many buttons containing text and icons had redundant `alt` text on the icons, leading to repetitive screen reader output.
**Action:** When creating or modifying UI components, consistently apply `focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none` classes to interactive elements. Ensure decorative icons within buttons/links have `aria-hidden="true"` and empty `alt=""` attributes if the adjacent text already provides sufficient context.
