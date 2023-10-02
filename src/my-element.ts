import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getSvgPath } from 'figma-squircle'

import style from './squircle.css' assert {type: 'css'};

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('x-squircle')
export class Squircle extends LitElement {
  public static styles = unsafeCSS(style);

  @property({type: Number})
  radius: number = 32;

  @property({type: Number})
  cornerSmoothing: number = 0.6;

  @property({type: String})
  fill: string = 'yellow';

  _width = 0;
  _height = 0;

  recalcChildrenRect() {
    let width = 0
    let height = 0
    Array.of(...this.children).forEach(el => {
      const rect = el.getBoundingClientRect()
      width += rect.width
      height += rect.height
    })
    console.log('recalc', width, height)
    return [width, height]
  }

  protected firstUpdated() {
    const [width, height] = this.recalcChildrenRect()
    this._width = width
    this._height = height
    this.requestUpdate()
  }

  render() {
    const dots = getSvgPath({
      width: this._width,
      height: this._height,
      cornerRadius: this.radius,
      cornerSmoothing: this.cornerSmoothing,
    })
    console.log('call render', this._width, this._height)
    let override = ''
    if (this._height && this._width) {
      override = `width: ${this._width}px; height: ${this._height}px;`
    }
    // const baseRadius = 20;
    return html`
      <div
        class="relative"
        style="border-radius: ${this.radius * 1.05}px; background-color: ${this.fill}; ${override}"
      >
        <svg class="absolute top-0 left-0 right-0 bottom-0 z-[-1]">
          <path d="${dots}" fill="${this.fill}"></path>
        </svg>
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-squircle': Squircle
  }
}
