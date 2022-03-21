export class DomElement {
  constructor(selector) {
    this.element = document.querySelector(selector);
    return this;
  }

  show() {
    this.element.style = 'display: inline';
    return this;
  }

  hide() {
    this.element.style = 'display: none';
    return this;
  }

  onInput(func) {
    //this.element.addEventListener('input', func);
    this.element.oninput = (e) => func(this.element.value);
    return this;
  }
}
