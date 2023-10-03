import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getSvgPath } from 'figma-squircle'

import style from './squircle.css?inline' assert {type: 'css'};

/**
 * linear-gradient(140deg, rgb(234, 222, 219) 0%, rgb(188, 112, 164) 50%, rgb(191, 214, 65) 75%)
 * linear-gradient(140deg, #EADEDB 0%, #BC70A4 50%, #BFD641 75%)
 * linear-gradient(135deg, orange 60%, cyan)
 * linear-gradient(to right,red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%)
 * linear-gradient(140deg, rgb(234, 222, 219) 0%, rgb(188, 112, 164) 50%, #ff9 75%, green)
 */
const regex_linear_gradient = /linear-gradient\(\s*([^,]+)(\s*(,\s*#?\w+(\(([\.\d]+(\s*,\s*[\.\d]+)+)\))?(\s+\d+%)?)+)\)/
const regex_linear_color_stop = /(#?\w+(\(([\.\d]+(\s*,\s*[\.\d]+)+)\))?)(\s+\d+%)?/g

function parseCssLinearGradient(str: string) {
  const match = str.match(regex_linear_gradient)
  if (!match || !match.length || !match[1] || !match[2]) {
    return null
  }
  const angle = match[1].trim()
  const colorStops = Array.of(...match[2].matchAll(regex_linear_color_stop)).map(i => {
    return { color: i[1], stop: (i[5] || '').trim() }
  })
  return { angle, colorStops }
}

interface Gradient {
  angle: string
  colorStops: {color: string, stop: string}[]
}

let instanceId = 0

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

  @state()
  protected gradient: Gradient | null = null;

  protected _id: string;

  constructor() {
    super()
    this._id = `squircle-${instanceId++}`
  }

  protected firstUpdated() {
    // Force render as block, otherwise the height will calcuate incorrect.
    this.style.display = 'block';

    // Get the width and height of the shadow root, and save to the state
    // so we can trigger update after firstUpdated and rendering the svg
    // background correctly.
    const { width, height } = this.getBoundingClientRect()
    this.width = width;
    this.height = height;

    // Copy style from the shadow root to the inner container.
    const computedStyle = getComputedStyle(this)
    const padding = computedStyle.padding
    this.containerStyles = css`padding: ${unsafeCSS(padding)};`
    this.fill = computedStyle.backgroundColor || 'transparent'

    if (computedStyle.backgroundImage.indexOf('linear-gradient') !== -1) {
      this.gradient = parseCssLinearGradient(computedStyle.backgroundImage)
    }

    //
    // Reset the styles of the shadow root.
    //
    this.style.padding = '0';
    // Border is not supported.
    // @fixme Maybe we we can applied border in the svg.
    this.style.border = '0 solid transparent';
    // Remove the background
    this.style.background = 'transparent';

    window.addEventListener('resize', () => {
      const { width, height } = this.getBoundingClientRect()
      this.width = width;
      this.height = height;
    })
  }

  render() {
    const [ width, height ] = [this.width, this.height]
    const dots = getSvgPath({
      width,
      height,
      cornerRadius: this.radius,
      cornerSmoothing: this.cornerSmoothing,
    })
    let gradient = ''
    let fill = this.fill
    if (this.gradient) {
      gradient = `
        <defs>
          <linearGradient id="${this._id}" gradientTransform="rotate(-${Number(this.gradient.angle)})">
            ${this.gradient.colorStops.map(i => {
              return `<stop offset="${i.stop || '100%'}" stop-color="${i.color}" />`
            })}
          </linearGradient>
        </defs>
      `
      fill = `url(#${this._id})`
    }
    const svgCode = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${gradient}
        <path d="${dots}" fill="${fill}" />
      </svg>
    `
    const dataUrl = `url('data:image/svg+xml;base64,${btoa(svgCode)}')`

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
      background-color: transparent;
      background-image: ${unsafeCSS(dataUrl)};
      background-repeat: no-repeat;
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
