import api from "../utils/api.js";
import modal from "./modal.js";
import toast from "./toast.js";
import teams from "../pages/teams.js";
import pokemons from "../pages/pokemons.js";

const auth = {
  init() {
    document
      .getElementById("login-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleLogin(event);
      });

    document.getElementById("nav-item-logout").addEventListener("click", () => {
      this.handleLogout();
    });

    document.getElementById("register-button").addEventListener("click", () => {
      modal.open("#register-modal");
    });

    document.getElementById("register-form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleRegister(event);
    });
  },

  isAuthenticated() {
    return localStorage.getItem("token") !== null;
  },  


  updateUi() {
    if (this.isAuthenticated()) { 
      document.getElementById("pokemon-list").innerHTML = "";
      pokemons.init();     
      teams.init();      
      document.getElementById("search-container").classList.remove("hidden");
      document.getElementById("nav-item-login").classList.add("hidden");
      document.getElementById("nav-item-logout").classList.remove("hidden");
      document.getElementById("nav-item-team").classList.remove("hidden");
      
    }
  },

  handleLogout() {
     
    localStorage.removeItem("token"); // Supprime le token  
    window.location.reload();
    // document.getElementById("search-container").classList.remove("hidden");
    toast.success("Déconnexion réussie");
    
  },

  async handleLogin(event) {
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await api.login(data);
    if (response.success === false) {
      const errorMessage = document.getElementById("error-message");
      errorMessage.classList.remove("hidden");
      errorMessage.textContent = response.message;
    } else {
      modal.close("#login-modal");
      toast.success(response.message);
      localStorage.setItem("token", response.token);
      this.updateUi();
    }
  },

  async handleRegister(event) {    
    
    // Récupérer les données du formulaire
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));


    // Modifier les données pour qu'elles soient compatibles avec le backend
    const dataModified = {
      username: data["username-register"],
      email: data["email-register"],
      password: data["password-register"]
    }    

    // Appeler l'API pour enregistrer l'utilisateur
    const response = await api.register(dataModified);
    if (response.success === false) {
      const errorMessageRegister = document.getElementById("error-message-register");
      errorMessageRegister.classList.remove("hidden");
      errorMessageRegister.textContent = response.message;
    } else {
      modal.close("#register-modal");            
      toast.success(response.message);
      localStorage.setItem("token", response.token);
      this.updateUi();
    }

  },

 

  

  

};

export { auth };
