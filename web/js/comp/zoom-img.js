class ZoomImage extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});

        const src = this.getAttribute('src');
        const alt = this.getAttribute('alt') || '';
        const width = this.getAttribute('width') || '200px';

        shadow.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                .image-zoom {
                    position: relative;
                    cursor: zoom-in;
                }

                input {
                    display: none;
                }

                img.thumbnail {
                    border-radius: 0.5rem;
                    display: block;
                    margin: 0 auto;
                    max-width: ${width};
                    transition: transform 0.2s ease;
                }

                img.thumbnail:hover {
                    transform: scale(1.03);
                }

                .zoom-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.85);
                    z-index: 999;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;
                    cursor: zoom-out;
                }

                input:checked ~ .zoom-overlay {
                    display: flex;
                }

                .zoom-overlay img {
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 0.5rem;
                    transition: transform 0.3s ease;
                }
            </style>

            <label class="image-zoom">
                <input type="checkbox">
                <img class="thumbnail" src="${src}" alt="${alt}">
                <div class="zoom-overlay">
                    <img src="${src}" alt="${alt}">
                </div>
            </label>
        `;
    }
}

customElements.define('zoom-img', ZoomImage);
