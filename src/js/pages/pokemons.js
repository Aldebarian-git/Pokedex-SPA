import api from "../utils/api.js";
import modal from "../components/modal.js";
import teams from "./teams.js";
import toast from "../components/toast.js";
import { auth } from "../components/auth.js";

const pokemons = {
  init() {
    this.loadPokemons();
    this.bindEvents();
  },

  bindEvents() {
    // Rajouter ici les événements liés à la page pokemons
  },

  async loadPokemons() {
    document.getElementById("pokemon-list").innerHTML = "";

    if (document.getElementById("pokemon-list").classList.contains("hidden")) {
      document.getElementById("pokemon-list").classList.remove("hidden");
    }
    const pokemons = await api.getPokemons();
    pokemons.forEach((pokemon) => {
      // this.addPokemonsToDOM(pokemon);
      this.addPokemonsToDOM(pokemon);
    });

    // Sélectionner tous les éléments enfants de #pokemon-list
    const pokemonListItems = document.querySelectorAll("#pokemon-list > *");

    // Parcourir les éléments et les masquer à partir du 7e enfant
    pokemonListItems.forEach((item, index) => {
      if (index >= 6) {
        // L'index commence à 0, donc 6 correspond au 7e enfant
        item.style.display = "none";
      }
    });

    const loadMore = document.createElement("button");
    loadMore.id = "load-more";
    loadMore.classList.add(
      "bg-blue-500",
      "hover:bg-blue-700",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded",
      "mt-4"
    );
    loadMore.textContent = "Voir plus de Pokémon";
    document.getElementById("pokemon-list").append(loadMore);

    document.getElementById("load-more").addEventListener("click", () => {
      console.log("click");
      const hiddenPokemons = document.querySelectorAll(
        ".card-container:nth-child(n+7):not(.show)"
      );
      console.log(hiddenPokemons);
      const nextBatch = Array.from(hiddenPokemons).slice(0, 6);
      nextBatch.forEach((pokemon) => pokemon.classList.add("show"));
      console.log(nextBatch);

      // Cacher le bouton s'il n'y a plus de Pokémon à afficher
      if (document.querySelectorAll(".card-container:not(.show)").length === 0) {
        document.getElementById("load-more").style.display = "none";
      }
    });
  },

  HoldaddPokemonsToDOM(pokemon) {
    const template = document.getElementById("pokemon-template");
    const clone = template.content.cloneNode(true);
    clone.querySelector(".card").classList.add("cursor-pointer");
    clone.querySelector('[slot="pokemon-name"]').textContent = pokemon.name;
    clone.querySelector('[slot="pokemon-number"]').textContent =
      "#" + pokemon.id;
    clone.querySelector(".pkm_img").src = `/img/${pokemon.id}.webp`;
    if (pokemon.types) {
      pokemon.types.forEach((type) => {
        const template = document.getElementById("type-template");
        const cloneType = template.content.cloneNode(true);

        cloneType.querySelector('[slot="type-name"]').textContent = type.name;
        cloneType.querySelector(
          ".type-name"
        ).style.backgroundColor = `#${type.color}`;
        clone.querySelector(".pokemon-types").appendChild(cloneType);
      });
    }
    clone.querySelector(".card").addEventListener("click", () => {
      modal.editModal("#pkm_detail", pokemon);
    });

    if (auth.isAuthenticated()) {
      const likeBtn = clone.querySelector(".like-btn");
      const newIcon = document.createElement("i");
      newIcon.classList.add("icon-like");
      newIcon.setAttribute("data-pokemon-id", pokemon.id);
      if (pokemon.isLiked) {
        newIcon.classList.add("fa-solid");
        newIcon.classList.add("fa-heart");
        newIcon.classList.add("text-red-500");
        likeBtn.appendChild(newIcon);
      } else if (pokemon.isLiked === false) {
        newIcon.classList.add("fa-regular");
        newIcon.classList.add("fa-heart");
        likeBtn.appendChild(newIcon);
      }

      // Ajout d'un événement pour le bouton like
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleLike(pokemon.id);
      });
    }

    // On ajoute d'abord la liste au DOM
    document.getElementById("pokemon-list").append(clone);
  },

  addPokemonsToDOM(pokemon) {
    const backgroundCardImg = [
      "/img/bg-card-1.jpg",
      "/img/bg-card-2.jpg",
      "/img/bg-card-3.jpg",
      "/img/bg-card-4.jpg",
      "/img/bg-card-5.jpg",
      "/img/bg-card-6.jpg",
      "/img/bg-card-7.jpg",
    ];
    const randomBackgroundCardImg =
      backgroundCardImg[Math.floor(Math.random() * backgroundCardImg.length)];
    const template = document.getElementById("pokemon-card-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector(
      ".card-container"
    ).style.backgroundImage = `url(${randomBackgroundCardImg})`;
    clone.querySelector(".card-container").style.backgroundSize = "cover";
    clone.querySelector(".card-container").style.backgroundPosition = "center";
    clone.querySelector(".card-container").style.backgroundRepeat = "no-repeat";
    const pokemonImgDiv = clone.querySelector(".img-container");
    const colors = [];
    pokemon.types.forEach((type) => {
      colors.push(`#${type.color}`);
    });
    // Appliquer un gradient si plusieurs couleurs, sinon une couleur unie
    if (colors.length > 1) {
      const gradient = `linear-gradient(130deg, ${colors.join(",")})`;
      pokemonImgDiv.style.background = gradient;
    } else if (colors.length === 1) {
      // Si une seule couleur, appliquer cette couleur comme fond
      pokemonImgDiv.style.background = colors[0];
    } else {
      // Cas où il n'y a pas de couleurs, appliquer une couleur par défaut
      pokemonImgDiv.style.background = "#000000"; // ou une autre couleur par défaut
    }

    clone.querySelector('[slot="pokemon-name"]').textContent = pokemon.name;
    clone.querySelector('[slot="pokemon-number"]').textContent =
      "#" + pokemon.id;
    clone.querySelector("img").src = `/img/${pokemon.id}.webp`;

    if (pokemon.types) {
      pokemon.types.forEach((type) => {
        const typeDiv = document.createElement("p");
        typeDiv.classList.add(
          "text-sm",
          "text-gray-700",
          "bg-gray-200",
          "px-3",
          "py-1",
          "rounded-full",
          "mt-1"
        );
        typeDiv.textContent = type.name;
        typeDiv.style.backgroundColor = `#${type.color}`;
        typeDiv.style.color = "#fff";
        clone.querySelector(".pokemon-types").appendChild(typeDiv);
      });
    }
    clone.querySelector(".pokemon-stat-pv").textContent = pokemon.hp;
    clone.querySelector(".pokemon-stat-atk").textContent = pokemon.atk;
    clone.querySelector(".pokemon-stat-def").textContent = pokemon.def;

    if (auth.isAuthenticated()) {
      const likeBtn = clone.querySelector(".like-btn");
      const newIcon = document.createElement("i");
      newIcon.classList.add("icon-like");
      newIcon.setAttribute("data-pokemon-id", pokemon.id);
      if (pokemon.isLiked) {
        newIcon.classList.add("fa-solid");
        newIcon.classList.add("fa-heart");
        newIcon.classList.add("text-red-500");
        likeBtn.appendChild(newIcon);
      } else if (pokemon.isLiked === false) {
        newIcon.classList.add("fa-solid");
        newIcon.classList.add("fa-heart");
        newIcon.classList.add("text-gray-500");
        likeBtn.appendChild(newIcon);
      }

      // Ajout d'un événement pour le bouton like
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleLike(pokemon.id);
      });
    }

    clone.querySelector(".card").addEventListener("click", () => {
      modal.editModal("#pkm_detail", pokemon);
    });

    document.getElementById("pokemon-list").append(clone);
  },

  async addPokemonToTeam() {
    try {
      // Récupérer l'id de l'équipe avec le dataset
      const teamId = document.querySelector("#pkm_detail form select").value;

      // Récupérer l'id du Pokémon
      const pokemonId = document
        .querySelector("#pkm_detail")
        .getAttribute("data-pokemon-id");

      // Ajouter le Pokémon à l'équipe
      if (teamId && pokemonId) {
        await api.addPokemonToTeam(teamId, pokemonId);
        toast.success("Pokémon ajouté à l'équipe");
        const teamList = document.getElementById("team-list");

        // Supprime tous les enfants sauf le premier
        while (teamList.children.length > 1) {
          teamList.removeChild(teamList.lastChild);
        }

        modal.close("#pkm_detail");
        teams.loadTeams();
      }
    } catch (error) {
      // Afficher le message d'erreur retourné par le serveur
      toast.error(error.message);
    }
  },

  async handleLike(pokemonId) {
    const icon = document.querySelector(
      ".icon-like[data-pokemon-id='" + pokemonId + "']"
    );

    if (icon.classList.contains("text-red-500")) {
      await api.togglePokemonLike(pokemonId);
      icon.classList.remove("text-red-500");
      icon.classList.add("text-gray-500");
      toast.error("Pokémon unliké");
    } else {
      await api.togglePokemonLike(pokemonId);
      icon.classList.remove("text-gray-500");
      icon.classList.add("text-red-500");
      toast.success("Pokémon liké");
    }
  },
};

export default pokemons;
