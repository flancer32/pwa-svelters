export default class UiToast extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    display: none;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    color: white;
                    background: #4b5563; /* default: gray-700 */
                    transition: opacity 0.3s ease;
                }
                :host(.info)    { background: #2563eb; } /* blue-600 */
                :host(.success) { background: #16a34a; } /* green-600 */
                :host(.error)   { background: #dc2626; } /* red-600 */
                :host(.warning) { background: #d97706; } /* amber-600 */
            </style>
            <span id="message"></span>
        `;
        this._el = shadow.getElementById('message');
        this._timeout = null;
        window.addEventListener('toast', e => this._show(e.detail));
    }

    _show({type = 'info', message = '', duration = 4000}) {
        this.className = type;
        this._el.textContent = message;
        this.style.display = 'block';
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.style.display = 'none';
        }, duration);
    }
}

customElements.define('ui-toast', UiToast);
