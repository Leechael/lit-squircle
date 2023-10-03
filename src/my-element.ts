import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getSvgPath } from 'figma-squircle'

import style from './squircle.css?inline' assert {type: 'css'};

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

  protected _width = 0;
  protected _height = 0;

  recalcChildrenRect() {
    let width = 0
    let height = 0
    Array.of(...this.children).forEach(el => {
      const rect = el.getBoundingClientRect()
      width += rect.width
      height += rect.height
    })
    console.log('reCalc', width, height)
    return [width, height]
  }

  protected firstUpdated() {
    const [width, height] = this.recalcChildrenRect()
    this._width = width
    this._height = height
    this.requestUpdate()
  }

  render() {
    const [width, height] = [this._width, this._height]
    const dots = getSvgPath({
      width,
      height,
      cornerRadius: this.radius,
      cornerSmoothing: this.cornerSmoothing,
    })
    const svgCode = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <path d="${dots}" fill="${this.fill}" />
      </svg>
    `
    // let override = css``
    // if (this._height && this._width) {
    //   override = css`
    //     width: ${this._width}px;
    //     height: ${this._height}px;
    //   `
    // }
    const includeUrl = `url('data:image/svg+xml;base64,${btoa(svgCode)}')`
      // border-radius: ${this.radius * 1.05}px;
      // background-color: ${unsafeCSS(this.fill)};
    const containerStyle = css`
      background-image: ${unsafeCSS(includeUrl)};
      background-repeat: no-repeat;
    `
    // const baseRadius = 20;
    return html`
      <div style=${containerStyle}>
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
