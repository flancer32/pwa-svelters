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
                    color: #4CAF50; /* Default green */
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                }

                svg {
                    fill: none;
                    height: 1.25em;
                    margin-left: 0.25em;  
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 2.5; /* Thicker stroke */
                    stroke: currentColor;
                    transition: color 0.2s ease, stroke 0.2s ease;
                    width: 1.25em; /* Slightly larger */
                }

                a:hover {
                    color: #388E3C; /* Darker green on hover */
                    text-decoration: underline;
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
