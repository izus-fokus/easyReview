/**
 * @fileoverview Context menu component for displaying right-click menus
 * @author EasyReview
 * @license MIT
 */

import * as ContextMenu from "@radix-ui/react-context-menu";

/**
 * Context menu component that wraps content with a right-click menu
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to wrap with the context menu
 * @param {React.ReactNode} props.menu - The menu items/content to show in the context menu
 * @returns {JSX.Element} Rendered context menu component
 *
 * @example
 * ```tsx
 * <Context menu={<MenuItems />}>
 *   <div>Right click me!</div>
 * </Context>
 * ```
 */
export default function Context({
  children,
  menu,
}: {
  children: React.ReactNode;
  menu: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="outline-none focus:outline-none">
          <ContextMenu.Item>{menu}</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
