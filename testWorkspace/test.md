---

---


# This is a test workspace

If the extension runs successfully you should see an alert pop up.

```js-exec
console.log("This is working nows");
alert("hello");

```

```js
console.warn("This is working now");
alert("hello");
```

```js-exec
// basic web component
// todo: add markdown editor syntax highlighting
const template = document.createElement("template");
template.innterHTML = `
  <div class="test-component">Hello</div>
`;

class ExampleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, old, new) {

  }

  
}
```

```js-exec
window.customElement.define('example-element', ExampleComponent);

```

<example-element />
