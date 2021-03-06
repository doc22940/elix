import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class CustomBackdrop extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <style>
        :host {
          background: white;
          height: 100%;
          left: 0;
          opacity: 0.5;
          position: fixed;
          top: 0;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define("custom-backdrop", CustomBackdrop);
export default CustomBackdrop;
