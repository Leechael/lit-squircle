# Squircle, the Web Component implementation

This is an implementation of Squircle, build on top of [figma-squircle](https://figma-squircle.vercel.app/).

The major benefit of this implementation is:

- Build with Lit and export as Web Component, so you can use it in any standard web browser without any JS framework.
- It's a container element and adjusting size dynamically like normal HTML block element.

Drawback:

- No border supported. Need further work on the SVG and this is a tiny holiday project.
- 28.6k, 10.5k transfered, not yet optimizing the final artifact size.
