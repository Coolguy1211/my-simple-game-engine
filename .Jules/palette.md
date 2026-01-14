## 2024-07-25 - Accessible Modal Dialog Pattern
**Learning:** A robust and reusable accessibility pattern for modal dialogs was established in `js/engine/ui/error-display.js`. The key is to handle all aspects of the modal lifecycle: creation, interaction, and destruction, with a focus on keyboard and screen reader users.

**Action:** When implementing a modal in the future, follow this checklist:
1.  **ARIA Attributes:** Apply `role='alertdialog'` and `aria-modal='true'` to the main dialog container.
2.  **Visible Close Control:** Include a `<button>` with a clear `aria-label` (e.g., "Close dialog").
3.  **Keyboard Dismissal:** Add a `keydown` event listener to close the modal when the 'Escape' key is pressed.
4.  **Background Content Hiding:** When the modal is active, apply `aria-hidden='true'` to all other top-level body elements to hide them from screen readers. Use a `data-` attribute to safely track which elements were hidden so they can be restored.
5.  **Initial Focus:** Set focus on a logical element inside the modal upon opening, typically the close button.
6.  **Focus Restoration:** Before opening, save the `document.activeElement`. When the modal closes, restore focus to that element.
7.  **Focus Trap:** Implement a `keydown` event listener that traps the 'Tab' key, preventing users from tabbing to elements hidden behind the modal overlay.
