class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.searchTerm = "";
  }

  async connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
          <style>
          .search-container {
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 10px;
            padding: 10px 15px;
            margin-bottom: 20px;
         }
         .search-container input {
            border: none;
            background: transparent;
            margin-left: 10px;
            flex-grow: 1;
            font-size: 16px;
            color: black;
            utline: none; 
         } 
        .search-container input:focus {
          outline: none; 
        }
        .search-icon {
          margin-right: 8px;
          color: #888;
        }
        </style>

        <div class="search-container">
          <img src="./images/search.png" alt="search" width="24" height="24">
          <input type="text" placeholder="Search notes..." value="${this.searchTerm}">
      </div>
      `;
  }

  addEventListeners() {
    const input = this.shadowRoot.querySelector("input");
    input.addEventListener("input", this.handleInput.bind(this));
  }

  handleInput(event) {
    this.searchTerm = event.target.value;
    const input = this.shadowRoot.querySelector("input");
    this.dispatchEvent(
      new CustomEvent("search", {
        bubbles: true,
        composed: true,
        detail: { searchTerm: this.searchTerm },
      })
    );
  }
}

customElements.define("search-component", SearchComponent);
