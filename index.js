import anime from 'animejs';
import scrollMonitor from 'scrollmonitor';

function generateOptions(defaultOptions, bindingValue) {
  return Object.assign({
    duration: 500,
    easing: 'easeInOutQuint',
    delay: 0,
    bgcolor: '#000',
    direction: 'lr',
    coverArea: 0,
    isContentHidden: true,
    ...defaultOptions
  }, bindingValue);
}

function createDOMEl(type, className, content) {
  const el = document.createElement(type);
  el.className = className || '';
  el.innerHTML = content || '';
  return el;
}

class Revealer {
  constructor(options, el) {
    this.options = options;
    this.el = el;
  }

  getTransformationSettings(direction) {
    let val;
    let origin;
    let originTwo;

    switch (direction) {
      case 'lr' :
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        originTwo = '100% 50%';
        break;
      case 'rl' :
        val = 'scale3d(0,1,1)';
        origin = '100% 50%';
        originTwo = '0 50%';
        break;
      case 'tb' :
        val = 'scale3d(1,0,1)';
        origin = '50% 0';
        originTwo = '50% 100%';
        break;
      case 'bt' :
        val = 'scale3d(1,0,1)';
        origin = '50% 100%';
        originTwo = '50% 0';
        break;
      default :
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        originTwo = '100% 50%';
        break;
    }

    return {
      val,
      origin: {initial: origin, halfway: originTwo}
    };
  }

  createStructure() {
    const position = window.getComputedStyle(this.el).position;
    if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
      this.el.style.position = 'relative';
    }

    this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML);

    if (this.options.isContentHidden) {
      this.content.style.opacity = 0;
    }

    this.el.innerHTML = '';
    this.revealer = createDOMEl('div', 'block-revealer__element');
    this.el.classList.add('block-revealer');
    this.el.appendChild(this.content);
    this.el.appendChild(this.revealer);
  }

  watch() {
    this.elementWatcher = scrollMonitor.create(this.el);

    this.elementWatcher.enterViewport(() => {
      this.reveal();
    });
  }

  reveal() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;

    const revealSettings = this.options;
    const direction = revealSettings.direction;
    const transformSettings = this.getTransformationSettings(direction);

    this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
    this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;

    // Set the Revealer´s background color.
    this.revealer.style.backgroundColor = revealSettings.bgcolor;

    // Show it. By default the revealer element has opacity = 0 (CSS).
    this.revealer.style.opacity = 1;

    // Animate it
    const self = this;

    // Second animation step.
    const animationSettingsFinish = {
      complete() {
        self.isAnimating = false;
        if (typeof revealSettings.onComplete === 'function') {
          revealSettings.onComplete(self.content, self.revealer);
        }
      }
    };

    // First animation step.
    const animationSettings = {
      delay: revealSettings.delay,
      complete() {
        self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;
        if (typeof revealSettings.onCover === 'function') {
          revealSettings.onCover(self.content, self.revealer);
        }
        self.content.style.opacity = 1;
        anime(animationSettingsFinish);
      }
    };

    animationSettings.targets = animationSettingsFinish.targets = this.revealer;
    animationSettings.duration = animationSettingsFinish.duration = revealSettings.duration;
    animationSettings.easing = animationSettingsFinish.easing = revealSettings.easing;

    const coverArea = revealSettings.coverArea;
    if (direction === 'lr' || direction === 'rl') {
      animationSettings.scaleX = [0, 1];
      animationSettingsFinish.scaleX = [1, coverArea / 100];
    } else {
      animationSettings.scaleY = [0, 1];
      animationSettingsFinish.scaleY = [1, coverArea / 100];
    }

    if (typeof revealSettings.onStart === 'function') {
      revealSettings.onStart(self.content, self.revealer);
    }

    anime(animationSettings);

    // remove watcher
    self.elementWatcher.destroy();
  }

  init() {
    // set up HTML structure
    this.createStructure();

    // watch
    this.watch();
  }
}

const VueBlockReveal = {
  install(Vue, defaultOptions) {
    Vue.directive('block-reveal', {
      inserted(el, binding) {
        const options = generateOptions(defaultOptions, binding.value, binding.modifiers);
        const revealer = new Revealer(options, el);
        revealer.init();
      }
    });
  }
};

export default VueBlockReveal;
