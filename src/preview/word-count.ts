/**
 * This is a hello world element and can be used to test if the
 * extension works. Just add: 
 * ```
 * <article contenteditable="">
 *  Hello world
 *  <p is="word-count"></p>
 * </article>
 * ```
 * to your markdown. You should see the correct word count of 2.
 */
class WordCount extends HTMLParagraphElement {
  constructor() {
    // Always call super first in constructor
    super();

    // count words in element's parent element
    const wcParent = this.parentNode as HTMLElement;

    function countWords(node: HTMLElement) {
      const text = (node.innerText || node.textContent) ?? "";
      return text
        .trim()
        .split(/\s+/g)
        .filter((a) => a.trim().length > 0).length;
    }

    const count = `Words: ${countWords(wcParent)}`;
    const shadow = this.attachShadow({ mode: "open" });

    const text = document.createElement("span");
    text.textContent = count;
    shadow.appendChild(text);
  }
}

console.log("Loading custom element");

customElements.define("word-count", WordCount, { extends: "p" });
