'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _animejs = require('animejs');

var _animejs2 = _interopRequireDefault(_animejs);

var _scrollmonitor = require('scrollmonitor');

var _scrollmonitor2 = _interopRequireDefault(_scrollmonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function generateOptions(defaultOptions, bindingValue) {
  return Object.assign(_extends({
    duration: 500,
    easing: 'easeInOutQuint',
    delay: 0,
    bgcolor: '#000',
    direction: 'lr',
    coverArea: 0,
    isContentHidden: true
  }, defaultOptions), bindingValue);
}

function createDOMEl(type, className, content) {
  var el = document.createElement(type);
  el.className = className || '';
  el.innerHTML = content || '';
  return el;
}

var Revealer = function () {
  function Revealer(options, el) {
    _classCallCheck(this, Revealer);

    this.options = options;
    this.el = el;
  }

  _createClass(Revealer, [{
    key: 'getTransformationSettings',
    value: function getTransformationSettings(direction) {
      var val = void 0;
      var origin = void 0;
      var originTwo = void 0;

      switch (direction) {
        case 'lr':
          val = 'scale3d(0,1,1)';
          origin = '0 50%';
          originTwo = '100% 50%';
          break;
        case 'rl':
          val = 'scale3d(0,1,1)';
          origin = '100% 50%';
          originTwo = '0 50%';
          break;
        case 'tb':
          val = 'scale3d(1,0,1)';
          origin = '50% 0';
          originTwo = '50% 100%';
          break;
        case 'bt':
          val = 'scale3d(1,0,1)';
          origin = '50% 100%';
          originTwo = '50% 0';
          break;
        default:
          val = 'scale3d(0,1,1)';
          origin = '0 50%';
          originTwo = '100% 50%';
          break;
      }

      return {
        val: val,
        origin: { initial: origin, halfway: originTwo }
      };
    }
  }, {
    key: 'createStructure',
    value: function createStructure() {
      var position = window.getComputedStyle(this.el).position;
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
  }, {
    key: 'watch',
    value: function watch() {
      var _this = this;

      this.elementWatcher = _scrollmonitor2.default.create(this.el);

      this.elementWatcher.enterViewport(function () {
        _this.reveal();
      });
    }
  }, {
    key: 'reveal',
    value: function reveal() {
      if (this.isAnimating) {
        return;
      }
      this.isAnimating = true;

      var revealSettings = this.options;
      var direction = revealSettings.direction;
      var transformSettings = this.getTransformationSettings(direction);

      this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
      this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;

      // Set the Revealer´s background color.
      this.revealer.style.backgroundColor = revealSettings.bgcolor;

      // Show it. By default the revealer element has opacity = 0 (CSS).
      this.revealer.style.opacity = 1;

      // Animate it
      var self = this;

      // Second animation step.
      var animationSettingsFinish = {
        complete: function complete() {
          self.isAnimating = false;
          if (typeof revealSettings.onComplete === 'function') {
            revealSettings.onComplete(self.content, self.revealer);
          }
        }
      };

      // First animation step.
      var animationSettings = {
        delay: revealSettings.delay,
        complete: function complete() {
          self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;
          if (typeof revealSettings.onCover === 'function') {
            revealSettings.onCover(self.content, self.revealer);
          }
          self.content.style.opacity = 1;
          (0, _animejs2.default)(animationSettingsFinish);
        }
      };

      animationSettings.targets = animationSettingsFinish.targets = this.revealer;
      animationSettings.duration = animationSettingsFinish.duration = revealSettings.duration;
      animationSettings.easing = animationSettingsFinish.easing = revealSettings.easing;

      var coverArea = revealSettings.coverArea;
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

      (0, _animejs2.default)(animationSettings);

      // remove watcher
      self.elementWatcher.destroy();
    }
  }, {
    key: 'init',
    value: function init() {
      // set up HTML structure
      this.createStructure();

      // watch
      this.watch();
    }
  }]);

  return Revealer;
}();

var VueBlockReveal = {
  install: function install(Vue, defaultOptions) {
    Vue.directive('block-reveal', {
      inserted: function inserted(el, binding) {
        var options = generateOptions(defaultOptions, binding.value, binding.modifiers);
        var revealer = new Revealer(options, el);
        revealer.init();
      }
    });
  }
};

exports.default = VueBlockReveal;
