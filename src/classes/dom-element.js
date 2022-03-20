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
}
