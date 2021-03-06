window.Fabric = window.Fabric || {};

/**
 * Fabric.skeletonPlayerMixin
 *
 * @polymerMixin Fabric.skeletonPlayerMixin
 * @mixinFunction
 * @override
 * @memberOf Fabric
 * @constructor
 * @param {HTMLElement} superclass
 * @return {*}
 */
Fabric.skeletonPlayerMixin = (superclass) => class extends superclass {
  /**
   * @return {object}
   */
  static get properties() {
    return {
      type: {
        type: String,
        value: null,
      },
      src: {
        type: String,
        value: null,
      },
      playSwitch: {
        type: Boolean,
        value: false,
        observer: '_playSwitchObserver',
      },
      autoplay: {
        type: Boolean,
        value: false,
      },
      controls: {
        type: Boolean,
        value: false,
      },
      preload: {
        type: String,
        value: 'metadata',
      },
      loop: {
        type: Boolean,
        value: false,
      },
      muted: {
        type: Boolean,
        value: false,
      },
      playing: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      paused: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      ended: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      timeOffset: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      percentagePlayed: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      duration: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      disabled: {
        type: Boolean,
        value: false,
      },
      error: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      events: {
        type: Array,
        value: null,
        observer: '_eventsObserver',
      },
      finalEvents: {
        type: Object,
        value: null,
      },
      loaded: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      progress: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        observer: '_progressObserver',
      },
      progressInt: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      secondaryProgress: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      immediateValue: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      icon: {
        type: String,
        value: 'player:loop',
        observer: '_iconObserver',
      },
      timeTotal: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        notify: true,
      },
      timeLeft: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        notify: true,
      },
      timeCurrent: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        notify: true,
      },
      firstPlayAction: {
        type: Boolean,
        value: false,
      },
      jump: {
        type: Number,
        value: 0,
        observer: '_jumpObserver',
      },
      buggy: {
        type: Boolean,
        value: false,
      },
    };
  }

  /**
   * Constructor
   */
  constructor() {
    super();
  }

  /**
   * connectedCallback
   */
  connectedCallback() {
    super.connectedCallback();

    this._actionListeners();
    this._playerListeners();
    // Listen for change event on the slider
    this.addEventListener('change', (e) => this.changeProgress(e));
  }

  /**
   * Switch Observer
   *
   * @param {boolean} newValue
   * @param {boolean} oldValue
   * @return {*}
   * @private
   */
  _playSwitchObserver(newValue, oldValue) {
    if (newValue === oldValue || !this.firstPlayAction) return;
    if (newValue) return this.play();
    return this.pause();
  }

  /**
   * Action listeners
   *
   * @private
   */
  _actionListeners() {
    const action = this.shadowRoot.querySelector('#action');
    if (!action) return;
    action.addEventListener('tap', (e) => this.togglePlay(e));
  }

  /**
   * Player Listeners
   *
   * @private
   */
  _playerListeners() {
    const player = this.shadowRoot.querySelector('#player');
    if (!player) return;
    player.addEventListener('loadedmetadata', (e) => this._loadedMetadata(e));
    player.addEventListener('play', (e) => this._playEvent(e));
    player.addEventListener('playing', (e) => this._playing(e));
    player.addEventListener('pause', (e) => this._paused(e));
    player.addEventListener('timeupdate', (e) => this._progress(e));
    player.addEventListener('error', (e) => this._error(e));
    player.addEventListener('ended', (e) => this._ended(e));
  }

  /**
   * Reset properties
   *
   * @private
   */
  _resetProperties() {
    this.disabled = false;
    this.error = false;
    this.paused = false;
    this.ended = false;
    this.playing = false;
  }

  /**
   * Called when the media metadata is available
   *
   * @private
   */
  _loadedMetadata() {
    const player = this.shadowRoot.querySelector('#player');

    if (player.duration === Infinity) {
      this.buggy = true;
      player.currentTime = Math.round(Math.random() * 1e9);

      const progressBugHandler = (e) => {
        player.currentTime = 0;
        this.duration = player.duration;
        player.removeEventListener('timeupdate', progressBugHandler);
        setTimeout(() => {
          this.buggy = false;
        });
      };

      player.addEventListener('timeupdate', progressBugHandler);
    }

    this.loaded = true;
    this.duration = player.duration;
    this.timeLeft = player.duration;
    this.timeTotal = player.duration;

    this.icon = 'player:play-arrow';
  }

  /**
   * Handle player errors
   *
   * @private
   */
  _error() {
    this._resetProperties();
    this.error = true;
    this.disabled = true;
  }

  /**
   * Toggle player. Use boolean to play or pause media.
   *
   * @return {*}
   */
  togglePlay() {
    if (this.playing) return this.pause();
    this.play();
  }

  /**
   * Play media
   */
  play() {
    this.shadowRoot.querySelector('#player').play();
  }

  /**
   * Pause media
   */
  pause() {
    this.shadowRoot.querySelector('#player').pause();
  }

  /**
   * Called when the play event is called
   *
   * @private
   */
  _playEvent() {
    this.dispatchEvent(new CustomEvent('skeleton-player-state-change', {
      detail: 'play',
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Called when media is playing
   *
   * @private
   */
  _playing() {
    this._resetProperties();
    const player = this.shadowRoot.querySelector('#player');
    this.played = player.played;
    this.playing = true;
    this.dispatchEvent(new CustomEvent('skeleton-player-state-change', {
      detail: 'playing',
      bubbles: true,
      composed: true,
    }));
    this.icon = 'player:pause';
    this.firstPlayAction = true;
  }

  /**
   * Called when the media ends and then fire an event
   *
   * @private
   */
  _ended() {
    if (this.buggy) return;
    this._resetProperties();
    this.ended = true;
    this.dispatchEvent(new CustomEvent('skeleton-player-state-change', {
      detail: 'ended',
      bubbles: true,
      composed: true,
    }));
    this.icon = 'player:replay';
  }

  /**
   * Get player progress
   *
   * @private
   */
  _progress() {
    const player = this.shadowRoot.querySelector('#player');
    this.progress = (player.currentTime / player.duration) * 100;
    this.timeLeft = player.duration - player.currentTime;
    this.timeTotal = player.duration;
    this.timeCurrent = player.currentTime;
    this._checkTimeEvents(player.currentTime);
  }

  /**
   * Jump observer
   *
   * @param {number} time
   * @private
   */
  _jumpObserver(time) {
    if (time < 0 || !time) return;
    const player = this.shadowRoot.querySelector('#player');
    player.currentTime = time;
  }

  /**
   * Progress observer
   *
   * @param {number} progress
   * @private
   */
  _progressObserver(progress) {
    this.progressInt = Math.floor(progress);
  }

  /**
   * Pause player
   *
   * @private
   */
  _paused() {
    this._resetProperties();
    this.paused = true;
    this.icon = 'player:play-arrow';
    this.dispatchEvent(new CustomEvent('skeleton-player-state-change', {
      detail: 'paused',
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Change progress value
   */
  changeProgress() {
    let position = this.immediateValue / 100;
    const player = this.shadowRoot.querySelector('#player');
    player.currentTime = this.duration * position;
    this._resetEventsBeforeNewTime();
  }

  /**
   * Reset events before new time
   *
   * @private
   */
  _resetEventsBeforeNewTime() {
    const player = this.shadowRoot.querySelector('#player');
    let time = player.currentTime;
    time = Math.floor(time);

    if (!this.finalEvents) return;
    for (let event in this.finalEvents) {
      if (!event) return;
      if (this.finalEvents[event].time >= time) {
        this.finalEvents[event]['fired'] = false;
      }
    }
  }

  /**
   * Event observer
   *
   * @param {object} events
   * @private
   */
  _eventsObserver(events) {
    if (!events) return;
    let baseEvents = [];
    for (let event in events) {
      if (!event) return;
      let eventBase = {
        event: events[event],
        time: event,
        fired: false,
      };
      baseEvents.push(eventBase);
    }
    if (baseEvents[0]) this.finalEvents = baseEvents;
  }

  /**
   * Check time events and fire event
   *
   * @param {number} time
   * @private
   */
  _checkTimeEvents(time) {
    if (!this.finalEvents) return;
    time = Math.floor(time);
    const events = this.finalEvents;

    for (let event in events) {
      if (!events[event]['fired'] && time >= events[event]['time']) {
        this.finalEvents[event]['fired'] = true;
        const finalEvent = events[event]['event'];
        this.dispatchEvent(new CustomEvent('skeleton-player-event', {
          detail: finalEvent,
          bubbles: true,
          composed: true,
        }));
      }
    }
  }

  /**
   * Icon Observer
   *
   * @param {string} icon
   * @private
   */
  _iconObserver(icon) {
    const action = this.shadowRoot.querySelector('#action');
    if (!action) return;
    action.icon = icon;
  }

  /**
   * Seconds to minutes
   *
   * @param {number} seconds
   * @return {*}
   * @private
   */
  _secToMin(seconds) {
    if (seconds === 0) return '';
    let minutes = Math.floor(seconds / 60);
    let secondsToCalc = Math.floor(seconds % 60) + '';
    return minutes + ':' + (
      secondsToCalc.length < 2 ? '0' + secondsToCalc : secondsToCalc
    );
  }
};
