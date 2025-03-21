const baseUrl = "http://pokedex-api-production-8e5a.up.railway.app";


const auth = {
    async login(email, password) {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la connexion");
        }

        const data = await response.json(); 
        return data;
    },

    async register(email, password) {
        const response = await fetch(`${baseUrl}/register`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'inscription");
        }

        const data = await response.json();
        return data;
    },

    async logout() {
        const response = await fetch(`${baseUrl}/logout`, {
            method: "POST",
        }); 

        if (!response.ok) {
            throw new Error("Erreur lors de la déconnexion");
        }

        const data = await response.json();
        return data;
    }

}

export { auth };