import modal from "./js/components/modal.js";
import navigations from "./js/components/navigations.js";
import toast from "./js/components/toast.js";
import { auth } from "./js/components/auth.js";

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
        
        // On initialise la navigation seulement si l'utilisateur est authentifié
        if(auth.isAuthenticated()) {
            navigations.init();
        }
    },
};

// On initialise l'application au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});