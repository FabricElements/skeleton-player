/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
Material design: [Sliders](https://www.google.com/design/spec/components/sliders.html)

`skeleton-player-slider` allows user to select a value from a range of values by
moving the slider thumb.  The interactive nature of the slider makes it a
great choice for settings that reflect intensity levels, such as volume,
brightness, or color saturation.

Example:

    <skeleton-player-slider></skeleton-player-slider>

Use `min` and `max` to specify the slider range.  Default is 0 to 100.

Example:

    <skeleton-player-slider min="10" max="200" value="110"></skeleton-player-slider>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--skeleton-player-slider-container-color` | The background color of the bar | `--paper-grey-400`
`--skeleton-player-slider-bar-color` | The background color of the slider | `transparent`
`--skeleton-player-slider-active-color` | The progress bar color | `--paper-grey-700`
`--skeleton-player-slider-secondary-color` | The secondary progress bar color | `--paper-grey-300`
`--skeleton-player-slider-knob-color` | The knob color | `--paper-grey-700`
`--skeleton-player-slider-disabled-knob-color` | The disabled knob color | `--paper-grey-400`
`--skeleton-player-slider-disabled-active-color` | The disabled progress bar color | `--paper-grey-400`
`--skeleton-player-slider-disabled-secondary-color` | The disabled secondary progress bar color | `--paper-grey-400`
`--skeleton-player-slider-knob-start-color` | The fill color of the knob at the far left | `transparent`
`--skeleton-player-slider-knob-start-border-color` | The border color of the knob at the far left | `--paper-grey-400`
`--skeleton-player-slider-height` | Height of the progress bar | `2px`

@group Paper Elements
@element skeleton-player-slider
@demo demo/index.html
@hero hero.svg
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronRangeBehavior } from '@polymer/iron-range-behavior/iron-range-behavior.js';
import { PaperInkyFocusBehaviorImpl, PaperInkyFocusBehavior } from '@polymer/paper-behaviors/paper-inky-focus-behavior.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/color.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="skeleton-player-slider">
  <template strip-whitespace="">
    <style>
      :host {
        @apply(--layout);
        @apply(--layout-justified);
        @apply(--layout-center);
        @apply --layout-flex-auto;
        cursor: default;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        --paper-progress-active-color: var(--skeleton-player-slider-active-color, var(--paper-grey-800));
        --paper-progress-secondary-color: var(--skeleton-player-slider-secondary-color, var(--paper-grey-300));
        --paper-progress-disabled-active-color: var(--skeleton-player-slider-disabled-active-color, var(--paper-grey-400));
        --paper-progress-disabled-secondary-color: var(--skeleton-player-slider-disabled-secondary-color, var(--paper-grey-400));
        --calculated-skeleton-player-slider-height: var(--skeleton-player-slider-height, 50px);
      }

      /* focus shows the ripple */
      :host(:focus) {
        outline: none;
      }

      #sliderContainer {
        position: relative;
        width: 100%;
        height: var(--calculated-skeleton-player-slider-height);
      }

      #sliderContainer:focus {
        outline: 0;
      }

      .bar-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
      }

      #sliderBar {
        padding: 0;
        height: 100%;
        width: 100%;
        background-color: var(--skeleton-player-slider-bar-color, transparent);
        --paper-progress-container-color: var(--skeleton-player-slider-container-color, var(--paper-grey-100));
        --paper-progress-height: var(--calculated-skeleton-player-slider-height);
      }

      .slider-knob {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        margin-left: -1px;
      }

      .transiting > .slider-knob {
        transition: left 0.08s ease;
      }

      .slider-knob:focus {
        outline: none;
      }

      .slider-knob.dragging {
        transition: none;
      }

      .slider-knob-inner {
        width: 2px;
        height: 100%;
        background-color: var(--skeleton-player-slider-knob-color, var(--paper-grey-700));

        -moz-box-sizing: border-box;
        box-sizing: border-box;

        transition-property: -webkit-transform, background-color, border;
        transition-property: transform, background-color, border;
        transition-duration: 0.18s;
        transition-timing-function: ease;
      }

      /* disabled state */
      #sliderContainer.disabled {
        pointer-events: none;
      }

      .disabled > .slider-knob > .slider-knob-inner {
        background-color: var(--skeleton-player-slider-disabled-knob-color, var(--paper-grey-400));
        -webkit-transform: scale3d(0.75, 0.75, 1);
        transform: scale3d(0.75, 0.75, 1);
      }

      paper-ripple {
        color: var(--skeleton-player-slider-knob-color, var(--paper-grey-700));
      }
    </style>

    <div id="sliderContainer" class\$="[[_getClassNames(disabled, immediateValue, min, expand, dragging, transiting)]]">
      <div class="bar-container">
        <paper-progress disabled\$="[[disabled]]" id="sliderBar" aria-hidden="true" min="[[min]]" max="[[max]]" step="[[step]]" value="[[immediateValue]]" secondary-progress="[[secondaryProgress]]" on-down="_bardown" on-up="_resetKnob" on-track="_onTrack">
        </paper-progress>
      </div>

      <div id="sliderKnob" class="slider-knob" on-down="_knobdown" on-up="_resetKnob" on-track="_onTrack" on-transitionend="_knobTransitionEnd">
        <div class="slider-knob-inner" value\$="[[immediateValue]]"></div>
      </div>
    </div>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/* eslint-disable require-jsdoc,space-before-function-paren */

/**
 * `skeleton-player-slider`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonPlayerSlider extends mixinBehaviors([
  IronA11yKeysBehavior,
  IronFormElementBehavior,
  PaperInkyFocusBehavior,
  IronRangeBehavior,
], PolymerElement) {
  static get is() {
    return 'skeleton-player-slider';
  }

  static get properties() {
    return {

      /**
       * The number that represents the current secondary progress.
       */
      secondaryProgress: {
        type: Number,
        value: 0,
        notify: true,
        observer: '_secondaryProgressChanged',
      },

      /**
       * The immediate value of the slider.
       * This value is updated while the user
       * is dragging the slider.
       */
      immediateValue: {
        type: Number,
        value: 0,
        readOnly: true,
        notify: true,
      },

      /**
       * If true, the knob is expanded
       */
      expand: {
        type: Boolean,
        value: false,
        readOnly: true,
      },

      /**
       * True when the user is dragging the slider.
       */
      dragging: {
        type: Boolean,
        value: false,
        readOnly: true,
      },

      transiting: {
        type: Boolean,
        value: false,
        readOnly: true,
      },

      disabled: {
        type: Boolean,
        value: false,
      },

      step: {
        type: Number,
        value: 1,
      },

      max: {
        type: Number,
        value: 100,
      },

      min: {
        type: Number,
        value: 1,
      },
    };
  }

  static get observers() {
    return [
      '_updateKnob(value, min, max, step)',
      '_valueChanged(value)',
      '_immediateValueChanged(immediateValue)',
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._ensureAttribute('tabindex', 0);
    this._ensureAttribute('role', 'slider');
  }

  get keyBindings() {
    return {
      'left down pagedown home': '_decrementKey',
      'right up pageup end': '_incrementKey',
    };
  }

  /**
   * Increases value by `step` but not above `max`.
   * @method increment
   */
  increment() {
    this.value = this._clampValue(this.value + this.step);
  }

  /**
   * Decreases value by `step` but not below `min`.
   * @method decrement
   */
  decrement() {
    this.value = this._clampValue(this.value - this.step);
  }

  _updateKnob(value, min, max, step) {
    this.setAttribute('aria-valuemin', min);
    this.setAttribute('aria-valuemax', max);
    this.setAttribute('aria-valuenow', value);

    this._positionKnob(this._calcRatio(value));
  }

  _valueChanged() {
    this.fire('value-change');
  }

  _immediateValueChanged() {
    if (this.dragging) {
      this.fire('immediate-value-change');
    } else {
      this.value = this.immediateValue;
    }
  }

  _secondaryProgressChanged() {
    this.secondaryProgress = this._clampValue(this.secondaryProgress);
  }

  _expandKnob() {
    this._setExpand(true);
  }

  _resetKnob() {
    this.cancelDebouncer('expandKnob');
    this._setExpand(false);
  }

  _positionKnob(ratio) {
    this._setImmediateValue(this._calcStep(this._calcKnobPosition(ratio)));
    this._setRatio(this._calcRatio(this.immediateValue));

    this.$.sliderKnob.style.left = (this.ratio * 100) + '%';
    if (this.dragging) {
      this._knobstartx = this.ratio * this._w;
      this.translate3d(0, 0, 0, this.$.sliderKnob);
    }
  }

  _calcKnobPosition(ratio) {
    return (this.max - this.min) * ratio + this.min;
  }

  _onTrack(event) {
    event.stopPropagation();
    switch (event.detail.state) {
      case 'start':
        this._trackStart(event);
        break;
      case 'track':
        this._trackX(event);
        break;
      case 'end':
        this._trackEnd();
        break;
    }
  }

  _trackStart(event) {
    this._w = this.$.sliderBar.offsetWidth;
    this._x = this.ratio * this._w;
    this._startx = this._x;
    this._knobstartx = this._startx;
    this._minx = -this._startx;
    this._maxx = this._w - this._startx;
    this.$.sliderKnob.classList.add('dragging');
    this._setDragging(true);
  }

  _trackX(event) {
    if (!this.dragging) {
      this._trackStart(event);
    }

    let dx = Math.min(this._maxx, Math.max(this._minx, event.detail.dx));
    this._x = this._startx + dx;

    let immediateValue = this._calcStep(
      this._calcKnobPosition(this._x / this._w)
    );
    this._setImmediateValue(immediateValue);

    // update knob's position
    let translateX = (
      (this._calcRatio(this.immediateValue) * this._w) - this._knobstartx
    );
    this.translate3d(translateX + 'px', 0, 0, this.$.sliderKnob);
  }

  _trackEnd() {
    let s = this.$.sliderKnob.style;

    this.$.sliderKnob.classList.remove('dragging');
    this._setDragging(false);
    this._resetKnob();
    this.value = this.immediateValue;

    s.transform = s.webkitTransform = '';

    this.fire('change');
  }

  _knobdown(event) {
    this._expandKnob();

    // cancel selection
    event.preventDefault();

    // set the focus manually because we will called prevent default
    this.focus();
  }

  _bardown(event) {
    this._w = this.$.sliderBar.offsetWidth;
    let rect = this.$.sliderBar.getBoundingClientRect();
    let ratio = (event.detail.x - rect.left) / this._w;
    let prevRatio = this.ratio;

    this._setTransiting(true);

    this._positionKnob(ratio);

    this.debounce('expandKnob', this._expandKnob, 60);

    // if the ratio doesn't change, sliderKnob's animation won't start
    // and `_knobTransitionEnd` won't be called
    // Therefore, we need to manually update the `transiting` state

    if (prevRatio === this.ratio) {
      this._setTransiting(false);
    }

    this.async(() => {
      this.fire('change');
    });

    // cancel selection
    event.preventDefault();

    // set the focus manually because we will called prevent default
    this.focus();
  }

  _knobTransitionEnd(event) {
    if (event.target === this.$.sliderKnob) {
      this._setTransiting(false);
    }
  }

  _mergeClasses(classes) {
    return Object.keys(classes).filter(
      function (className) {
        return classes[className];
      }).join(' ');
  }

  _getClassNames() {
    return this._mergeClasses({
      disabled: this.disabled,
      expand: this.expand,
      dragging: this.dragging,
      transiting: this.transiting,
    });
  }

  _incrementKey(event) {
    if (!this.disabled) {
      if (event.detail.key === 'end') {
        this.value = this.max;
      } else {
        this.increment();
      }
      this.fire('change');
      event.preventDefault();
    }
  }

  _decrementKey(event) {
    if (!this.disabled) {
      if (event.detail.key === 'home') {
        this.value = this.min;
      } else {
        this.decrement();
      }
      this.fire('change');
      event.preventDefault();
    }
  }

  _changeValue(event) {
    this.value = event.target.value;
    this.fire('change');
  }

  _inputKeyDown(event) {
    event.stopPropagation();
  }

  // create the element ripple inside the `sliderKnob`
  _createRipple() {
    this._rippleContainer = this.$.sliderKnob;
    return PaperInkyFocusBehaviorImpl._createRipple.call(this);
  }

  // Hide the ripple when user is not interacting with keyboard.
  // This behavior is different from other ripple-y controls, but is
  // according to spec: https://www.google.com/design/spec/components/sliders.html
  _focusedChanged(receivedFocusFromKeyboard) {
    if (receivedFocusFromKeyboard) {
      this.ensureRipple();
    }
    if (this.hasRipple()) {
      // note, ripple must be un-hidden prior to setting `holdDown`
      if (receivedFocusFromKeyboard) {
        this._ripple.style.display = '';
      } else {
        this._ripple.style.display = 'none';
      }
      this._ripple.holdDown = receivedFocusFromKeyboard;
    }
  }
}

/**
 * Fired when the slider's value changes.
 *
 * @event value-change
 */

/**
 * Fired when the slider's immediateValue changes. Only occurs while the
 * user is dragging.
 *
 * To detect changes to immediateValue that happen for any input (i.e.
 * dragging, tapping, clicking, etc.) listen for immediate-value-changed
 * instead.
 *
 * @event immediate-value-change
 */

/**
 * Fired when the slider's value changes due to user interaction.
 *
 * Changes to the slider's value due to changes in an underlying
 * bound variable will not trigger this event.
 *
 * @event change
 */
window.customElements.define(SkeletonPlayerSlider.is, SkeletonPlayerSlider);
