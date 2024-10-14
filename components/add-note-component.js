class AddNoteComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.noteData = { title: "", body: "", date: "" };
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
       <style>
      :host {
        display: block;
        background-color: white;
        box-shadow: 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 20px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
      }
      .cancel {
        background: none;
        border: none;
        color: #1a73e8;
        cursor: pointer;
        font-size: 14px;
      }
      input, textarea {
        width: calc(100% - 24px);
        padding: 12px;
        margin-bottom: 16px;
        border: 1px solid #ddd;
        border-radius: 10px;
        font-size: 16px;
        background-color: #f1f3f4;
      }
      input:focus, textarea:focus {
        background-color: white;
        border: 1px solid #1B1C1E;
        outline: none;
      }
      textarea {
        height: 100px;
        resize: vertical;
      }
      .button-container {
        display: flex;
        justify-content: flex-end;
      }
      .save {
        padding: 8px 24px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        background-color: #6B3C9B;
        color: white;
      }
    </style>
    <div class="add-note-container">
       <div class="header">
          <h2>${this.noteData.id ? "Edit note" : "Add new note"}</h2>
          <button class="cancel">Cancel</button>
        </div>
      <input type="text" id="title" placeholder="Note title" value="${this.noteData.title || ""}">
      <textarea id="body" placeholder="Your note">${this.noteData.body || ""}</textarea>
      <div class="button-container">
          <button class="save">Save</button>
      </div>
    </div>
      `;
    this.addEventListeners();
  }

  addEventListeners() {
    const cancelButton = this.shadowRoot.querySelector(".cancel");
    const saveButton = this.shadowRoot.querySelector(".save");

    saveButton.addEventListener("click", this.handleSave.bind(this));
    cancelButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-add", { bubbles: true, composed: true }));
    });
  }

  handleSave() {
    const title = this.shadowRoot.querySelector("#title").value;
    const body = this.shadowRoot.querySelector("#body").value;
    const newNote = {
      id: this.noteData.id || "",
      title,
      body,
      date: new Date().toLocaleDateString(),
    };

    this.dispatchEvent(
      new CustomEvent("save-note", {
        detail: newNote,
        bubbles: true,
        composed: true,
      })
    );
  }

  setNoteData(data) {
    this.noteData = { ...data };
    this.render();
  }

  clearInputs() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyTextarea = this.shadowRoot.querySelector("#body");
    titleInput.value = ""; 
    bodyTextarea.value = ""; 
  }

}

customElements.define("add-note-component", AddNoteComponent);
