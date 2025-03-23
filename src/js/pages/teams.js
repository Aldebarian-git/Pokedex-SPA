import api from "../utils/api.js";
import modal from "../components/modal.js";
import toast from "../components/toast.js";

const teams = {
  init() {
    this.loadTeams();
    this.bindEvents();
  },

  bindEvents() {
    // Ajout d'un événement pour modifier l'équipe
    document
      .querySelector("#edit-team form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const previousName = document
          .getElementById("edit-team")
          .getAttribute("data-team-name");
        const previousDescription = document
          .getElementById("edit-team")
          .getAttribute("data-team-description");
        const teamId = document
          .getElementById("edit-team")
          .getAttribute("data-team-id");
        const data = {
          name: document.getElementById("team-name").value,
          description: document.getElementById("team-description").value,
        };

        if(data.name === "" || data.description === ""){
          toast.error("Veuillez remplir tous les champs");
          return;
        }

        if(previousName === data.name && previousDescription === data.description){
          toast.error("Aucune modification apportée");
          document.getElementById("team-name").value = previousName;
          document.getElementById("team-description").value = previousDescription;
          return;
        }

        const response = this.updateTeam(teamId, data);
        if (response) {
          // Mise à jour du nom et de la description de l'équipe dans le DOM
          document
            .querySelector(`[data-team-id="${teamId}"]`)
            .querySelector('[slot="team-name"]').textContent = data.name;
          document
            .querySelector(`[data-team-id="${teamId}"]`)
            .querySelector('[slot="team-description"]').textContent =
            data.description;

          // Remplir le modal avec les informations de l'équipe
          
        } else {
          console.error("Erreur lors de la mise à jour de l'équipe");
        }

        modal.close("#edit-team");
      });

    // Ajout d'un événement pour supprimer l'équipe
    document
      .querySelector("#confirm-modal form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const teamId = document
          .getElementById("confirm-modal")
          .getAttribute("data-team-id");
        this.deleteTeam(teamId);
        modal.close("#confirm-modal");
      });

    // Ajout d'un événement pour ajouter une équipe
    document.querySelector(".btn-add-team").addEventListener("click", () => {
      modal.open("#add_pkm_team");
    });

    // Ajout d'un événement pour ajouter une équipe après la soumission du formulaire
    document.querySelector("#add-team-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("create-team-name").value,
        description: document.getElementById("create-team-description").value,
      };
      this.addTeam(data);
    });   
    
  },

  async loadTeams() {
    const teams = await api.getTeams();
    if (!teams) {
      console.error("Impossible de charger les équipes");
      return;
    }
    teams.forEach((team) => {
      this.addTeamToDOM(team);
    });
  },

  addTeamToDOM(team) {
    const template = document.getElementById("team-template");
    const clone = template.content.cloneNode(true);
    clone.querySelector('[slot="team-name"]').textContent = team.name;
    clone.querySelector('[slot="team-name"]').dataset.teamName = team.name;
    clone.querySelector('[slot="team-description"]').textContent =
      team.description;
    clone.querySelector('[slot="team-description"]').dataset.teamDescription =
      team.description;
    clone.querySelector(".team-card").setAttribute("data-team-id", team.id);

    if (team.pokemons) {
      const teamPokemonsContainer = clone.querySelector(
        '[slot="team-pokemons"]'
      );

      team.pokemons.forEach((pokemon) => {
        const pokemonClone = document
          .getElementById("pokemon-template")
          .content.cloneNode(true);
        pokemonClone.querySelector('[slot="pokemon-name"]').textContent =
          pokemon.name;
        pokemonClone.querySelector('[slot="pokemon-number"]').textContent =
          "#" + pokemon.id;
        pokemonClone.querySelector(
          ".pkm_img"
        ).src = `/img/${pokemon.id}.webp`;

        // Ajout du bouton de suppression
        const deleteButton = document.createElement("i");        
        deleteButton.classList.add(
          "fa",
          "fa-trash",
          "button-delete-pokemon",
          "absolute",
          "top-2",
          "right-2",
          "text-red-500",
          "cursor-pointer",
          "hover:text-red-700",
          "transition-all",
          "duration-300"
        );

        const card = pokemonClone.querySelector(".card");
        card.classList.add("relative");
        card.setAttribute("data-id", pokemon.id);        
        card.setAttribute("data-team-id", team.id);
        card.style.maxHeight = "300px";
        card.style.width = "220px";
        card.querySelector(".pkm_img").style.width = "90px";
        card.querySelector(".pkm_img").style.height = "90px";
        card.appendChild(deleteButton);

        // Ajout du bouton pour voir le détail du Pokémon
        const detailButton = document.createElement("i");
        detailButton.classList.add(
          "fa",
          "fa-eye",
          "button-detail-pokemon",
          "absolute",
          "top-2",
          "left-2",
          "text-blue-500",
          "cursor-pointer",
          "hover:text-blue-700",
          "transition-all",
          "duration-300"
        );
        card.appendChild(detailButton);

        // Ajout d'un événement de suppression sur le bouton de suppression du Pokémon
        deleteButton.addEventListener("click", () => {          
          this.deletePokemonFromTeam(team.id, pokemon.id);
        });

        // Ajout d'un événement pour voir le détail du Pokémon
        detailButton.addEventListener("click", () => {          
          modal.editModal("#pkm_detail", pokemon);          
        });

        if (pokemon.types) {
          pokemon.types.forEach((type) => {
            const template = document.getElementById("type-template");
            const typeClone = template.content.cloneNode(true);
            typeClone.querySelector('[slot="type-name"]').textContent =
              type.name;
            typeClone.querySelector(
              ".type-name"
            ).style.backgroundColor = `#${type.color}`;
            typeClone.querySelector(".type-name").classList.add("text-white");
            pokemonClone.querySelector(".pokemon-types").appendChild(typeClone);
          });
        }        
        teamPokemonsContainer.appendChild(pokemonClone);
      });

      // Ajout d'un événement pour supprimer l'équipe
      const deleteTeamButton = clone.querySelector(".button-delete-team");

      deleteTeamButton.addEventListener("click", () => {
        document
          .getElementById("confirm-modal")
          .setAttribute("data-team-id", team.id);
        modal.open("#confirm-modal");
      });

      // Ajout d'un événement pour ouvrir le modal de modification de l'équipe
      const editTeamButton = clone.querySelector(".button-edit-team");

      editTeamButton.addEventListener("click", (event) => {
        const teamCard = event.target.closest(".team-card");
        const teamId = teamCard.getAttribute("data-team-id");
        const teamName = teamCard.querySelector('[slot="team-name"]').textContent;
        const teamDescription = teamCard.querySelector('[slot="team-description"]').textContent;
        
        // Remplir le modal avec les informations actuelles de l'équipe
        document.getElementById("edit-team").setAttribute("data-team-id", teamId);
        document.getElementById("edit-team").setAttribute("data-team-name", teamName);
        document.getElementById("edit-team").setAttribute("data-team-description", teamDescription);
        document.getElementById("team-name").value = teamName;
        document.getElementById("team-description").value = teamDescription;
        modal.open("#edit-team");
      });      
    }

    // On ajoute d'abord la liste au DOM
    document.getElementById("team-list").append(clone);
  },

  async deletePokemonFromTeam(team, pokemon) {
    const response = await api.deletePokemonFromTeam(team, pokemon);
    if (response) {
      const teamCard = document.querySelector(`[data-id="${pokemon}"][data-team-id="${team}"]`);
      teamCard.remove();
    } else {
      console.error("Erreur lors de la suppression du Pokémon");
    }
  },

  async deleteTeam(team) {
    const response = await api.deleteTeam(team);
    if (response) {
      toast.success("Équipe supprimée");
      const teamCard = document.querySelector(`[data-team-id="${team}"]`);
      teamCard.remove();
    } else {
      toast.error("Erreur lors de la suppression de l'équipe");
    }
  },

  async updateTeam(teamId, data) {
    const response = await api.updateTeam(teamId, data);
    if (response) {
      toast.success("Équipe mise à jour avec succès");      
    } else {
      toast.error("Erreur lors de la mise à jour de l'équipe");
    }
  },

  async addTeam(data) {
    if (data.name && data.description) {
      const response = await api.addTeam(data);
      if (response) {
        // Afficher un message de succès
        toast.success("Équipe ajoutée avec succès");

        // Fermer le modal
        modal.close("#add_pkm_team");

        // Réinitialiser le formulaire
        document.getElementById("add-team-form").reset();

        // Effacer toutes les équipes existantes du DOM
        const teamList = document.getElementById("team-list");
        while (teamList.children.length > 1) {
          teamList.removeChild(teamList.lastChild);
        }

        // Charger les équipes mises à jour
        this.loadTeams();
      } else {
        toast.error("Erreur lors de l'ajout de l'équipe");
      }
    }
  },
};

export default teams;
