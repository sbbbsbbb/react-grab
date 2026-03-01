const WHITESPACE_ONLY_PATTERN = /^\s*$/;

const isPointInsideRect = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
): boolean =>
  clientX >= rect.left &&
  clientX <= rect.right &&
  clientY >= rect.top &&
  clientY <= rect.bottom;

export const getTextNodeAtPosition = (
  element: Element,
  clientX: number,
  clientY: number,
): Text | null => {
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  let currentNode = treeWalker.nextNode();
  while (currentNode) {
    const textContent = currentNode.textContent;
    if (textContent && !WHITESPACE_ONLY_PATTERN.test(textContent)) {
      range.selectNodeContents(currentNode);
      const clientRects = range.getClientRects();

      for (let rectIndex = 0; rectIndex < clientRects.length; rectIndex++) {
        if (isPointInsideRect(clientX, clientY, clientRects[rectIndex])) {
          return currentNode as Text;
        }
      }
    }
    currentNode = treeWalker.nextNode();
  }

  return null;
};
