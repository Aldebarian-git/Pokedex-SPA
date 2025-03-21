
import modal from "./js/components/modal.js";
import navigations from "./js/components/navigations.js";
import toast from "./js/components/toast.js";
import { auth } from "./js/components/auth.js";
import pokemons from "./js/pages/pokemons.js";

const app = {
    /**
     * Initialise l'application
     */
    init() {           
        // On initialise d'abord la modal
        modal.init();
        // On initialise la navigation (qui va gérer l'affichage initial des pokemons)
        navigations.init();
        // On initialise le toast
        toast.init();        
        // // On initialise l'authentification
        auth.init();
    },
};

// On initialise l'application au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    if(auth.isAuthenticated()){          
        auth.updateUi();
        app.init();
    } else {        
        app.init();
    }
    
});