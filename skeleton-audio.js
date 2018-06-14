import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './mixins/skeleton-player-mixin.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './elements/skeleton-player-slider.js';
import './icons.js';
/**
 * `skeleton-audio-player`
 * Custom Audio player using material design
 *
 * @customElement
 * @polymer
 * @appliesMixin Fabric.skeletonPlayerMixin
 * @demo demo/index.html
 */
class SkeletonAudio extends Fabric.skeletonPlayerMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        @apply --layout-horizontal;
        @apply --layout-center-center;
      }

      #action {
        margin-right: 5px;
      }
    </style>
    <audio id="player" hidden="" type\$="[[type]]" src="[[src]]" autoplay\$="[[autoplay]]" preload="[[preload]]" loop="[[loop]]" muted="[[muted]]"></audio>

    <paper-icon-button id="action" disabled\$="[[!loaded]]"></paper-icon-button>

    <skeleton-player-slider id="slider" value\$="[[progress]]" secondary-progress="[[secondaryProgress]]" immediate-value="{{immediateValue}}" disabled\$="[[disabled]]"></skeleton-player-slider>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-audio';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {};
  }

  /**
   * Constructor
   */
  constructor() {
    super();
  }
}

window.customElements.define('skeleton-audio', SkeletonAudio);
