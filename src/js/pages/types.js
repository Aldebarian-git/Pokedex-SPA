import api from "../utils/api.js";

const types = {
  init() {
    this.loadTypes();
  },

  async loadTypes() {
    const types = await api.getTypes();
    types.forEach((type) => {
      this.addTypeToDOM(type);
    });
  },  

  addTypeToDOM(type) {
    const template = document.getElementById("type-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector('[slot="type-name"]').textContent = type.name;
    clone.querySelector(".type-name").style.backgroundColor = `#${type.color}`;

    // On ajoute d'abord la liste au DOM
    document.getElementById("type-list").append(clone);
  },
};

export default types;
