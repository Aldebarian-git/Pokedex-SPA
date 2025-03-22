import api from "../utils/api.js";
import { auth } from "./auth.js";
import pokemons from "../pages/pokemons.js";
/**
 * Gestion des modals générique
 * @namespace modal
 */
const modal = {
  init() {
    // Ajouter un écouteur d'événements sur l'overlay (la div avec la classe modal)
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        // Vérifier si le clic a été fait sur l'overlay (la div avec la classe modal)
        // et non sur la modal-card (le contenu de la modal)
        if (e.target === modal) {
          this.close();
        }
      });
    });

    // Garder les écouteurs sur les boutons de fermeture
    document.querySelectorAll(".close").forEach((element) => {
      element.addEventListener("click", () => {
        this.close();
      });
    });
  },

  open(selector) {
    document.querySelector(selector).classList.add("is-active");
    const body = document.body;
    body.classList.add("body-no-scroll");
  },

  close() {
    const element = document.querySelector(".is-active");
    if (element) {
      element.classList.remove("is-active");
    }
    if (element.id === "login-modal") {
      document.getElementById("login-form").reset();
      document.getElementById("error-message").textContent = "";
      document.getElementById("error-message").classList.add("hidden");
    }
    const body = document.body;
    body.classList.remove("body-no-scroll");
  },

  async editModal(selector, pokemon) {
    // Donnée l'id du Pokémon
    document.querySelector("#pkm_detail").dataset.pokemonId = pokemon.id;

    // Mise à jour du nom du Pokémon
    document.querySelector(".pkm_name").textContent = `${pokemon.name}`;
    document.querySelector(".pkm_number").textContent = `#${pokemon.id}`;

    // Mise à jour de l'image du Pokémon
    document.querySelector(".pkm_img_modal").src = `/img/${pokemon.id}.webp`;

    // Mise à jour de la vie du Pokémon
    document.querySelector(".pokemon-hp").textContent = pokemon.hp;

    // Mise à jour de l'attaque du Pokémon
    document.querySelector(".pokemon-atk").textContent = pokemon.atk;

    // Mise à jour de la défense du Pokémon
    document.querySelector(".pokemon-def").textContent = pokemon.def;

    // Mise à jour de l'attaque spéciale du Pokémon
    document.querySelector(".pokemon-atk_spe").textContent = pokemon.atk_spe;

    // Mise à jour de la défense spéciale du Pokémon
    document.querySelector(".pokemon-def_spe").textContent = pokemon.def_spe;

    // Mise à jour de la vitesse du Pokémon
    document.querySelector(".pokemon-speed").textContent = pokemon.speed;

    // Mise à jour des barres de progression
    document.querySelector(".progress-hp").value = pokemon.hp;
    document.querySelector(".progress-atk").value = pokemon.atk;
    document.querySelector(".progress-def").value = pokemon.def;
    document.querySelector(".progress-atk-spe").value = pokemon.atk_spe;
    document.querySelector(".progress-def-spe").value = pokemon.def_spe;
    document.querySelector(".progress-speed").value = pokemon.speed;

    // Ajout des types si ils existent
    const typesContainer = document.querySelector(".pokemon-types-modal");

    // Suppression des anciens types pour éviter les doublons

    typesContainer.innerHTML = "";

    if (pokemon.types && pokemon.types.length > 0) {
      pokemon.types.forEach((type) => {
        const cloneType = document
          .querySelector("#type-template")
          .content.cloneNode(true);
        cloneType.querySelector(".type-name").textContent = type.name;
        cloneType.querySelector(
          ".type-name"
        ).style.backgroundColor = `#${type.color}`;
        typesContainer.appendChild(cloneType);
      });
    }

    if (auth.isAuthenticated()) {
      const teams = await api.getTeams();

      // Mise à jour des équipes si elles existent
      if (teams) {
        const containerFormAddPkmTeam = document.querySelector(
          ".add_team_container"
        );
        containerFormAddPkmTeam.innerHTML = "";
        const cloneFormAddPkmTeam = document
          .querySelector("#add-pkm-team-template")
          .content.cloneNode(true);

        const inputSelect = cloneFormAddPkmTeam.querySelector(".select");
        while (inputSelect.children.length > 1) {
          inputSelect.removeChild(inputSelect.lastChild);
        }        

        teams.forEach((team) => {
          const newOption = document.createElement("option");
          newOption.dataset.teamId = team.id;
          newOption.value = team.id;
          newOption.textContent = team.name;
          inputSelect.appendChild(newOption);
        });

        

        // Ajout d'un événement sur le bouton d'ajout
        cloneFormAddPkmTeam
          .querySelector(".btn_add_team")
          .addEventListener("click", (e) => {
            e.preventDefault();
            pokemons.addPokemonToTeam();
          });
        containerFormAddPkmTeam.append(cloneFormAddPkmTeam);
      }
    }

    this.open(selector);
  },
};

export default modal;
