import api from "../utils/api.js";
import pokemons from "../pages/pokemons.js";
import navigation from "./navigations.js";

const searchContainer = {
  init() {
    this.loadSearchContainer();
    this.searchType();
    this.searchByName();
    this.loadPokemonsMoreLiked();
    this.bindEvents();
  },

  bindEvents() {

    // ajouter un écouteur d'événements sur le bouton de reset
    document.getElementById("reset-select").addEventListener("click", () => {
      document.getElementById("search-type").selectedIndex = 0;
      document.getElementById("reset-select").classList.add("hidden");
      pokemons.init();
    });

    // ajouter un écouteur d'événements sur le bouton de random pokemons
    document.querySelector(".random-pokemon").addEventListener("click", () => {
      navigation.hideAllLists();
      document.getElementById("pokemon-list").classList.remove("hidden");
      this.loadRandomPokemons();
    });
  },

  async loadSearchContainer() {
    const types = await api.getTypes();
    const searchContainer = document.getElementById("search-type");

    if (types) {
      types.forEach((type) => {
        const template = document.getElementById("searchType-template");
        const clone = template.content.cloneNode(true);
        clone.querySelector('[slot="type-name"]').textContent = type.name;
        clone.querySelector('[slot="type-name"]').value = type.name;
        clone.querySelector(
          '[slot="type-name"]'
        ).style.backgroundColor = `#${type.color}`;
        clone.querySelector('[slot="type-name"]').dataset.typeId = type.id;
        searchContainer.appendChild(clone);
      });
    }
  },

  async loadPokemonsMoreLiked() {
    const response = await api.getPokemons();
    const pokemonsMoreLiked = response
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 3);

    pokemonsMoreLiked.forEach((pokemon, index) => {
      const newDiv = document.createElement("img");
      newDiv.src = `/img/${pokemon.id}.webp`;
      newDiv.classList.add("w-14", "h-14", "object-cover");
      document.querySelector(`.colonne-${index + 1}`).append(newDiv);
    });
  },

  searchType() {
    // On ajoute un écouteur d'événements sur le select
    document
      .getElementById("search-type")
      .addEventListener("change", async (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex]; // Récupère l'option sélectionnée
        const typeId = selectedOption.dataset.typeId; // Récupère l'attribut data-type-id de l'option
        if (typeId) {
          document.getElementById("reset-select").classList.remove("hidden");
          const response = await api.getPokemons();
          const pokemonsOnType = response.filter((pokemon) =>
            pokemon.types.some((type) => type.id === parseInt(typeId))
          );
          navigation.hideAllLists();
          document.getElementById("pokemon-list").classList.remove("hidden");
          document.querySelector("#pokemon-list").innerHTML = "";
          pokemonsOnType.forEach((pokemon) => {
            pokemons.addPokemonsToDOM(pokemon);
          });
        } else {
          document.querySelector("#pokemon-list").innerHTML = "";
          document.getElementById("reset-select").classList.add("hidden");
          pokemons.init();
        }
      });
  },

  searchByName() {
    const searchInput = document.getElementById("search-name");

    // Écouteur pour détecter l'entrée et lancer la recherche au "Enter"
    searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const searchValue = e.target.value.trim();
        if (searchValue) {
          const response = await api.getPokemons();
          const pokemonsOnName = response.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
          );
          navigation.hideAllLists();
          document.getElementById("pokemon-list").classList.remove("hidden");
          document.querySelector("#pokemon-list").innerHTML = ""; // On vide la liste

          if (pokemonsOnName.length > 0) {
            pokemonsOnName.forEach((pokemon) => {
              pokemons.addPokemonsToDOM(pokemon);
            });
          } else {
            const newDiv = document.createElement("div");
            newDiv.classList.add(
              "text-center",
              "text-red-600",
              "font-pokemon",
              "tracking-widest",
              "text-3xl",
              "flex",
              "items-center",
              "justify-center",
              "no-pokemon-found"
            );
            newDiv.innerHTML = "Aucun Pokémon trouvé";
            document.querySelector("#app").appendChild(newDiv);
          }
        }
      }
    });

    // Écouteur pour relancer pokemons.init() si l'input est vide
    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
        if (document.querySelector(".no-pokemon-found")) {
          document.querySelector(".no-pokemon-found").remove();
        }
        document.querySelector("#pokemon-list").innerHTML = ""; // Réinitialisation
        navigation.hideAllLists();
        document.getElementById("pokemon-list").classList.remove("hidden");
        pokemons.init();
      }
    });
  },

  loadRandomPokemons() {
    if (document.querySelector(".btn-return")) {
      document.querySelector(".btn-return").remove();
    }
    const pokemons = document.querySelectorAll(".card-container");
    const btnLoadMore = document.getElementById("load-more");
    const btnLoadLess = document.getElementById("load-less");

    pokemons.forEach((pokemon) => {
      pokemon.classList.add("hidden");
    });
    const randomPokemons = [];
    const selectedPokemons = new Set(); // Crée un Set pour éviter les doublons

    while (randomPokemons.length < 6) {
      const randomPokemon =
        pokemons[Math.floor(Math.random() * pokemons.length)];

      // Vérifie si le Pokémon a déjà été sélectionné
      if (!selectedPokemons.has(randomPokemon)) {
        randomPokemons.push(randomPokemon);
        selectedPokemons.add(randomPokemon); // Ajoute à l'ensemble pour éviter les doublons
        randomPokemon.classList.remove("hidden");
      }
    }

    btnLoadMore.classList.add("hidden");
    btnLoadLess.classList.add("hidden");
    const newbutton = document.createElement("button");
    newbutton.classList.add(
      "font-pokemon",
      "text-xl",
      "text-white",
      "cursor-pointer",      
      "hover:text-red-600",
      "tracking-widest",
      "transition-all",
      "duration-300",
      "ease-in-out",
      "hover:scale-102",
      "btn-return"
    );
    newbutton.textContent = "Retour !";
    document.querySelector("#pokemon-list").appendChild(newbutton);

    newbutton.addEventListener("click", () => {
      btnLoadMore.classList.remove("hidden");
      btnLoadLess.classList.remove("hidden");
      const pokemons = document.querySelectorAll(".card-container");
      pokemons.forEach((pokemon, index) => {
        for (let i = 0; i < 6; i++) {
          if (index <= 5) {
            pokemon.classList.remove("hidden");
          } else {
            pokemon.classList.add("hidden");
          }
        }
      });
      newbutton.remove();
    });
  },
};

export default searchContainer;
