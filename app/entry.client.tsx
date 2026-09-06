import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

/**
 * Guard against "Failed to execute 'removeChild' / 'insertBefore' on 'Node'"
 * crashes. Browser translation (Safari / Google Translate) and some extensions
 * mutate text nodes underneath React; React's next commit then references a node
 * that is no longer where it expects it and throws, taking the whole app down.
 *
 * Making these two DOM calls a graceful no-op when the reference node has a
 * different parent (an error condition that would throw anyway) keeps the page
 * alive. See facebook/react#11538.
 */
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

hydrateRoot(document, <HydratedRouter />);
