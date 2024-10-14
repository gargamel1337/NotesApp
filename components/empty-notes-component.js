class EmptyNotesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
        }
        .empty-notes-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          padding: 20px;
        }
        .empty-state {
          text-align: center;
          max-width: 300px;
        }
        .title {
          font-size: 20px;
        }
        .add-note-btn {
          margin: 20px auto;
          display: flex;
          align-items: center;
          background-color: transparent;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 16px;
          cursor: pointer;
        }
        .add-text { 
          margin: 0 0 0 10px;
        }
        </style>

     <div class="empty-notes-container">
        <div class="empty-state">
          <div class="empty-icon">
             <img src="./images/circle.png" alt="info" width="60" height="60">
          </div>
          <p class="title">No notes yet</p>
          <p class="subtitle">Add a note to keep track of your learnings.</p>
          <button class="add-note-btn">
            <img src="./images/frame.png" alt="frame" width="24" height="24">
            <p class="add-text">Add Note</p>
          </button>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const addNoteBtn = this.shadowRoot.querySelector(".add-note-btn");
    addNoteBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("open-add-note", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("empty-notes-component", EmptyNotesComponent);
