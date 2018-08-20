import './styles.css';

const RETARGETED_EVENTS = [
  'input',
  'change',
  'focus',
  'blur',
];

const REFLECTED_PROPERTIES = [
  'name',
  'value',
  'min',
  'max',
  'step',
];

interface RangeInputElement {
  value: string;
  min?: string;
  max?: string;
  step?: string;
  precision?: number | string;
}

class RangeInputElement extends HTMLElement {
  private _input = document.createElement('input');
  private _valueDisplayWrapper = document.createElement('aside');
  private _valueDisplay = document.createElement('span');

  constructor() {
    super();
    this._input.type = 'range';
    this._update = this._update.bind(this);
    this._handleEvent = this._handleEvent.bind(this);

    for (const event of RETARGETED_EVENTS) {
      this._input.addEventListener(event, this._handleEvent, true);
    }

    for (const property of REFLECTED_PROPERTIES) {
      Object.defineProperty(this, property, {
        configurable: true,
        get() {
          return this._input[property];
        },
        set(value) {
          this._input[property] = value;
          this._update();
        },
      });
    }
  }

  connectedCallback() {
    if (this._input.parentNode !== this) {
      this.appendChild(this._input);
      this._valueDisplayWrapper.appendChild(this._valueDisplay);
      this.appendChild(this._valueDisplayWrapper);
    }
  }

  private _handleEvent(event: Event) {
    this._update();
    event.stopImmediatePropagation();
    const retargetted = new (event.constructor as typeof Event)(event.type, event);
    this.dispatchEvent(retargetted);
  }

  private _update() {
    const value = parseFloat(this.value || '0');
    const min = parseFloat(this._input.min || '0');
    const max = parseFloat(this._input.max || '100');
    const percent = 100 * (value - min) / (max - min);
    this.style.setProperty('--value-percent', percent + '%');
    let displayValue = '' + value;
    let precision = this.precision;
    if (typeof precision === 'string') {
      precision = parseInt(precision, 10) || 0;
    }
    if (precision) {
      displayValue = parseFloat(displayValue).toPrecision(precision);
    }
    this._valueDisplay.textContent = '' + displayValue;
  }

  attributeChangedCallback (name: string, value: string) {
    if (name === 'value') this.value = value;
  }
}

export default RangeInputElement;

customElements.define('range-input', RangeInputElement);
