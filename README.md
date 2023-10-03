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


