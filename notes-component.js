class NotesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this.filteredNotes = [];
    this.isAddingNote = false;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    const notesToRender = this.filteredNotes.length > 0 ? this.filteredNotes : this.notes;
    this.shadowRoot.innerHTML = `
     <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }      
        .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 ;
        }
        h2 {
        margin: 0;
        font-size: 20px;
        font-weight: normal;
        }

        #add-new {
          background-color: #6B3C9B;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          margin-bottom: 20px;
        }
        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .add-note-container {
          margin-bottom: 20px;
          position: relative;
        }
        .cancel-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-size: 14px;
        }
        .save-button {
          background-color: #8e44ad;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          width: auto;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
    </style>
    <div class="header">
    <img src="./images/note.png" alt="note" width="24" height="24">
      <h2> Notes</h2>
    </div>
   <search-component></search-component>
    ${
      this.isAddingNote
        ? "<add-note-component></add-note-component>"
        : notesToRender.length === 0
        ? "<empty-notes-component></empty-notes-component>"
        : `
            <button id="add-new">Dodaj nową notatkę</button>
            <div class="notes-list">
              ${notesToRender
                .map(
                  (note) => `
                <note-item
                  id="${note.id}"
                  title="${note.title}"
                  body="${note.body}"
                  date="${note.date}"
                ></note-item>
              `
                )
                .join("")}
            </div>`
    }
    `;

    if (this.isAddingNote) {
      const addNewButton = this.shadowRoot.querySelector("#add-new");
      if (addNewButton) {
        addNewButton.addEventListener("click", () => {
          this.isAddingNote = true;
          this.render();
        });
      }
    }
  }

  addEventListeners() {
    this.shadowRoot.addEventListener("open-add-note", () => {
      this.isAddingNote = true;
      this.render();
    });

    this.shadowRoot.addEventListener("cancel-add", () => {
      this.isAddingNote = false;
      this.render();
    });

    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.id === "add-new") {
        this.isAddingNote = true;
        this.render();
      }
    });

    this.shadowRoot.addEventListener("save-note",this.handleSaveNote.bind(this));
    this.shadowRoot.addEventListener("delete-note",this.handleDeleteNote.bind(this));
    this.shadowRoot.addEventListener("search", this.handleSearch.bind(this));
    this.shadowRoot.addEventListener("edit-note",this.handleEditNote.bind(this));
  }

  handleSaveNote(event) {
    const newNote = event.detail;
    if (newNote.id) {
      const index = this.notes.findIndex((note) => note.id === newNote.id);
      if (index !== -1) {
        this.notes[index] = { ...this.notes[index], ...newNote };
      }
    } else {
      newNote.id = Date.now().toString();
      this.notes.unshift(newNote);
    }

    this.isAddingNote = false;
    this.updateFilteredNotes();
    this.render();
  }

  handleDeleteNote(event) {
    const { id } = event.detail;
    this.notes = this.notes.filter((note) => note.id !== id);
    this.updateFilteredNotes();
    this.render();
  }

  handleSearch(event) {
    const searchTerm = event.detail.searchTerm.toLowerCase();
    this.filteredNotes = this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm)
    );
    this.updateNotesList();
    this.updateFilteredNotes();
  }

  updateNotesList() {
    const notesContainer = this.shadowRoot.querySelector(".notes-list");
    if (notesContainer) {
      notesContainer.innerHTML = this.filteredNotes
        .map(
          (note) => `
          <note-item
            id="${note.id}"
            title="${note.title}"
            body="${note.body}"
            date="${note.date}"
          ></note-item>
        `
        )
        .join("");
    }
  }

  handleEditNote(event) {
    const { id } = event.detail;
    const noteToEdit = this.notes.find((note) => note.id === id);
    if (noteToEdit) {
      this.isAddingNote = true;
      this.render();
      const addNoteComponent = this.shadowRoot.querySelector("add-note-component");
      if (addNoteComponent) {
        addNoteComponent.setNoteData(noteToEdit);
      }
    }
  }

  updateFilteredNotes() {
    if (this.searchTerm) {
      this.filteredNotes = this.notes.filter(
        (note) =>
          note.title.toLowerCase().includes(this.searchTerm) ||
          note.body.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredNotes = [...this.notes];
    }
  }
}

customElements.define("notes-component", NotesComponent);
