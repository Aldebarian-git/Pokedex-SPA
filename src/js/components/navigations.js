import pokemons from "../pages/pokemons.js";
import types from "../pages/types.js";
import searchContainer from "./searchContainer.js";
import modal from "./modal.js";



const navigations = {
  init() {
    // On cache d'abord toutes les listes
    this.hideAllLists();
    // On charge les pokemons par défaut
    pokemons.init();  

    // On charge le searchContainer
    searchContainer.init();   

    document.getElementById("search-container").classList.remove("hidden");

    // On récupère tous les liens de navigation
    const links = document.querySelectorAll("[data-page]");
    
    

    // On ajoute un écouteur d'événements sur chaque lien
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;        
        this.navigateTo(page);
      });
    });

    // On ajoute un écouteur d'événements sur le bouton de connexion
    document.getElementById("nav-item-login").addEventListener("click", (e) => {
      modal.open("#login-modal");
    });
    
    
  },

  hideAllLists() {
    // On cache toutes les listes
    document.getElementById("pokemon-list").classList.add("hidden");
    document.getElementById("type-list").classList.add("hidden");
    document.getElementById("team-list").classList.add("hidden");
    if (document.querySelector(".no-pokemon-found")) {
      document.querySelector(".no-pokemon-found").remove();
    }
  },

  navigateTo(page) {
    // On cache d'abord toutes les listes
    this.hideAllLists();

    // On gère la navigation en fonction de la page
    switch (page) {
      case "home":
        // On cache le bouton d'ajout d'équipe
        
        document.getElementById("search-container").classList.remove("hidden");
        document.getElementById("pokemon-list").classList.remove("hidden");
        // On ne recharge les pokemons que si la liste est vide
        if (!document.querySelector("#pokemon-list").children.length) {
          pokemons.init();
        }
        break;
      case "types":
        document.getElementById("type-list").classList.remove("hidden");
        // On ne recharge les types que si la liste est vide
        if (!document.querySelector("#type-list").children.length) {
          types.init();
        }
        break;
      case "teams":

      
        document.getElementById("team-list").classList.remove("hidden");        
        
        // On ne recharge les équipes que si la liste est vide
        if (!document.querySelector("#team-list").children.length) {
          document.getElementById("team-list").innerHTML = "";                            
        }
       
              
        

        break;

      default:
        document.getElementById("pokemon-list").classList.remove("hidden");
        // On ne recharge les pokemons que si la liste est vide
        if (!document.querySelector("#pokemon-list").children.length) {
          pokemons.init();
        }
    }
  },
};

export default navigations;
