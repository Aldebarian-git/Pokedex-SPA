import modal from "./js/components/modal.js";
import navigations from "./js/components/navigations.js";
import toast from "./js/components/toast.js";
import { auth } from "./js/components/auth.js";
import searchContainer from "./js/components/searchContainer.js";

const app = {
    /**
     * Initialise l'application
     */
    init() {           
        // On initialise d'abord la modal
        modal.init();
        // On initialise le toast
        toast.init();        
        // On initialise l'authentification
        auth.init();
        // On initialise le searchContainer dans tous les cas
        searchContainer.init();
        // On initialise la navigation en dernier (qui va gérer l'affichage initial des pokemons)
        navigations.init();
    },
};

// On initialise l'application au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    if(auth.isAuthenticated()){ 
        document.getElementById("pokemon-list").classList.remove("hidden");
        auth.updateUi();
    } else {
        document.getElementById("pokemon-list").innerHTML = "";        
    }
    
    app.init();
});