import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getSvgPath } from 'figma-squircle'

import style from './squircle.css?inline' assert {type: 'css'};

/**
 * @slot - This element has a slot
 */
@customElement('x-squircle')
export class Squircle extends LitElement {
  public static styles = unsafeCSS(style);

  @property({type: Number})
  radius: number = 32;

  @property({type: Number, attribute: 'corner-smoothing'})
  cornerSmoothing: number = 0.6;

  @state()
  protected containerStyles = unsafeCSS('')

  @state()
  protected width = 0;

  @state()
  protected height = 0;

  @state()
  protected fill = 'transparent';

  protected firstUpdated() {
    // Force render as block, otherwise the height will calcuate incorrect.
    this.style.display = 'block';
    // Get the width and height of the shadow root, and save to the state
    // so we can trigger update after firstUpdated and rendering the svg
    // background correctly.
    const { width, height } = this.getBoundingClientRect()
    this.width = width;
    this.height = height;
    console.log('in firstUpdated', this.className, width, height)

    // Copy style from the shadow root to the inner container.
    const computedStyle = getComputedStyle(this)
    this.containerStyles = css`padding: ${unsafeCSS(computedStyle.padding)};`
    this.fill = computedStyle.backgroundColor || 'transparent'

    //
    // Reset the styles of the shadow root.
    //
    // Set padding to 0 and move to the inner container.
    this.style.padding = '0';
    // Border is not supported.
    // @fixme Maybe we we can applied border in the svg.
    this.style.border = '0 solid transparent';
    // Remove the background
    this.style.backgroundColor = 'transparent';
  }

  render() {
    const [ width, height ] = [this.width, this.height]
    const dots = getSvgPath({
      width,
      height,
      cornerRadius: this.radius,
      cornerSmoothing: this.cornerSmoothing,
    })
    const svgCode = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <path d="${dots}" fill="${this.fill}" />
      </svg>
    `
    const dataUrl = `url('data:image/svg+xml;base64,${btoa(svgCode)}')`
    console.log('in render', this.className, width, height)

    // The init width && height is 0, so we not use it at first render.
    const sizes = (width !== 0 && height !== 0)
      ? css`width: ${width}px; height: ${height}px;`
      : css`width: 100%; height: 100%;`

    // Apply the shadow root styles to the inner container, and
    // replace the background image with the svg.
    // NOTE: the border-radius is required as hacks to rendering the
    // backgroung svg correctly.
    const containerStyle = css`
      ${unsafeCSS(sizes)}
      ${unsafeCSS(this.containerStyles)}
      background-image: ${unsafeCSS(dataUrl)};
      background-repeat: no-repeat;
      border-radius: ${this.radius * 1.05}px;
    `
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
