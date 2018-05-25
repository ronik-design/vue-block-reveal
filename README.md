# vue-block-reveal

A vue directive to wrap [@crnacura](https://github.com/crnacura)'s [Block Revealers](https://github.com/codrops/BlockRevealers/).

## Install

``` bash
# npm
npm install --save vue-block-reveal
```

``` bash
# yarn
yarn add vue-block-reveal
```

## In Your Stylesheet

``` css
/* The container element */
.block-revealer {
  position: relative;
}

/* The actual block that overlays */
.block-revealer__element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  pointer-events: none;
  opacity: 0;
}
```

## Default Settings

Options can be passed to `Vue.use` or to individual elements as a value (ie. `v-block-reveal="{ delay: 250, direction: 'rl' }"`).

```js
import VueBlockReveal from 'vue-block-reveal';

Vue.use(VueBlockReveal, {
  direction: 'lr',
  bgcolor: '#ffcb34'
});
```

| Property           | Description                                                                                           | Default Value        |
|------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------|
| direction          | The direction of the wipe. Can be `lr`, `rl`, `bt`, or `tb`.                                          | `lr`                 |
| duration           | How long each half of the transition takes in milliseconds.                                           | 500                  |
| delay              | A delay before the transition occurs in milliseconds.                                                 | 0                    |
| easing             | The easing function. Uses the functions from [anime](http://animejs.com/documentation/#penner).       | `easeInOutQuint`     |
| bgcolor            | The color of the transition                                                                           | `#000`               |
| isContentHidden    | Hides the target before the transition occurs.                                                        | `true`               |
| coverArea          | Percentage-based value representing how much of the area should be left covered.                      | 0                    |


## Usage

```html
<!-- This inherits your default settings in Vue.use -->
<h1 v-block-reveal>Hello world</h1>

<!-- Passing custom settings -->
<h1 v-block-reveal="{ delay: 250, direction: 'rl' }">Hello world</h1>

```

### Credits

- [@crnacura](https://github.com/crnacura) from [Codrops](https://github.com/codrops/)
- [Anime.js](http://animejs.com/)
- [Scrollmonitor](https://github.com/stutrek/scrollMonitor)