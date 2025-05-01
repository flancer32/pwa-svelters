class ExtLink extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});

        const href = this.getAttribute('href') || '#';
        const title = this.getAttribute('title') || '';
        const text = this.innerHTML;

        shadow.innerHTML = `
            <style>
                a {
                    align-items: center;
                    color: var(--color-green-600);
                    display: inline-flex;
                    text-decoration: none;
                }

                a:hover {
                    color: var(--color-green-700);
                    text-decoration: underline;
                }
                
                svg {
                    fill: none;
                    height: var(--size-5);
                    margin-left: var(--size-1);  
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 2.5; /* Thicker stroke */
                    stroke: currentColor;
                    transition: color 0.2s ease, stroke 0.2s ease;
                    width: var(--size-5); 
                }
            </style>
            <a href="${href}" target="_blank" rel="noopener noreferrer" title="${title}">
                <span>${text}</span>
                <svg viewBox="0 0 24 24">
                    <path d="M18 3h3v3"></path>
                    <path d="M10 14L21 3"></path>
                    <path d="M21 21H3V3h9"></path>
                </svg>
            </a>
        `;
    }
}

customElements.define('ext-link', ExtLink);
