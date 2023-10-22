# Squircle, the Web Component implementation

This is an implementation of Squircle, build on top of [figma-squircle](https://figma-squircle.vercel.app/).

The good parts of this implementation:

- Build with Lit and export as Web Component, so you can use it in any standard web browser without any JS framework.
- It's a container element and adjusting size dynamically like normal HTML block element. It listen to the resize event, too.

Limitation:

- No border supported. Need further work on the SVG and this is a tiny holiday project.
- No box shadow supported.
- Partial & buggy gradient background supported.
- Package size. not yet optimizing the final artifact size.

## CAUTION!

No yet production ready. If you want a more flexible implementation, consider use
[figma-squircle](https://figma-squircle.vercel.app/) directly.

## Usage

For pure HTML page, put this line in `<head />`:

```html
<script type="module" src="https://unpkg.com/lit-squircle/dist/lit-squircle.js" async></script>
```

And you can use it on page:

```html
<x-squircle radius="32">
  <a href="#">Menu 1</a>
  <a href="#">Menu 2</a>
  <a href="#">Menu 3</a>
  <a href="#">Menu 4</a>
</x-squircle>
```

## Examples

Check the `index.html` file.
