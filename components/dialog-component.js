class DialogComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.addOverlay();
  }

  disconnectedCallback() {
    this.removeOverlay();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          z-index: 1001;
          width: 300px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
        }
        h2 {
          margin: 0 0 16px 0;
          font-size: 20px;
        }
        .buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          width: 45%;
        }
        .cancel {
          background-color: #f0f0f0;
        }
        .delete {
          background-color: #6B3C9B;
          color: white;
        }
      </style>
      <h2>Delete Note</h2>
      <p>Are you sure you want to delete this note?</p>
      <div class="buttons">
        <button class="cancel">Cancel</button>
        <button class="delete">Delete</button>
      </div>
    `;
  }

  addEventListeners() {
    const cancelButton = this.shadowRoot.querySelector('.cancel');
    const deleteButton = this.shadowRoot.querySelector('.delete');

    cancelButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('dialog-closed', { bubbles: true, composed: true }));
      this.remove();
    });

    deleteButton.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent("dialog-response", {
          bubbles: true,
          composed: true,
          detail: { action: "delete" },
        })
      );
    });
  }


  addOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  removeOverlay() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

customElements.define('dialog-component', DialogComponent);
