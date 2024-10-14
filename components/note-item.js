class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    const title = this.getAttribute("title") || "";
    const body = this.getAttribute("body") || "";
    const date = this.getAttribute("date") || "";

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background-color: #fff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          p {
            margin: 0 0 8px 0;
            color: #333;
          }
          .date {
            font-size: 12px;
            color: #888;
          }
          .icons {
            display: flex;
            gap: 8px;
          }
  
        </style>

        <h3>
          ${title}
          <span class="icons">
            <img src="./images/edit.png" alt="note" class="edit-icon">
            <img src="./images/trash.png" alt="delete" class="delete-icon">
          </span>
        </h3>
        <p>${body}</p>
        <div class="date">${date}</div>
      `;
  }
  addEventListeners() {
    const deleteButton = this.shadowRoot.querySelector(".delete-icon");
    deleteButton.addEventListener("click", this.showDeleteDialog.bind(this));

    const editIcon = this.shadowRoot.querySelector(".edit-icon");
    editIcon.addEventListener("click", this.handleEdit.bind(this));
  }

  showDeleteDialog() {
    const dialog = document.createElement("dialog-component");
    document.body.appendChild(dialog);

    dialog.addEventListener("dialog-response", (event) => {
      if (event.detail.action === "delete") {
        this.deleteNote();
      }
      dialog.remove();
    });
  }

  deleteNote() {
    this.dispatchEvent(
      new CustomEvent("delete-note", {
        bubbles: true,
        composed: true,
        detail: { id: this.getAttribute("id") },
      })
    );
  }

  handleEdit() {
    const editEvent = new CustomEvent("edit-note", {
      bubbles: true,
      composed: true,
      detail: {
        id: this.getAttribute("id"),
        title: this.getAttribute("title"),
        body: this.getAttribute("body"),
        date: this.getAttribute("date"),
      },
    });
    this.dispatchEvent(editEvent);
  }


}

customElements.define("note-item", NoteItem);
