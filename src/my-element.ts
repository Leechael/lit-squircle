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

  render() {
    const dots = getSvgPath({
      width: 160,
      height: 160,
      cornerRadius: this.radius,
      cornerSmoothing: this.cornerSmoothing,
    })
    // const baseRadius = 20;
    return html`
      <div
        class="relative w-40 h-40"
        style="border-radius: ${this.radius * 1.05}px; background-color: ${this.fill};"
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
