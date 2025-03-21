const api = {
  baseUrl: "https://pokedex-api-production-8e5a.up.railway.app",

  /**
   * Fonction pour appeler l'API de récupération des listes et les retourner
   */
  async getPokemons() {
    try {
      const token = localStorage.getItem("token");
      const url = token
        ? `${api.baseUrl}/pokemons/with-likes`
        : `${api.baseUrl}/pokemons`;

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des Pokémon:",
        error.message
      );
      return null;
    }
  },

  async getPokemon(id) {
    try {
      if (!id) {
        throw new Error("ID du Pokémon manquant");
      }

      const response = await fetch(api.baseUrl + `/pokemons/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du Pokémon ${id}:`,
        error.message
      );
      return null;
    }
  },

  async getTypes() {
    try {
      const response = await fetch(api.baseUrl + `/types`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des types:", error.message);
      return null;
    }
  },

  async getType(id) {
    try {
      if (!id) {
        throw new Error("ID du type manquant");
      }

      const response = await fetch(api.baseUrl + `/types/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du type ${id}:`,
        error.message
      );
      return null;
    }
  },

  async getTeams() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(api.baseUrl + "/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des équipes:",
        error.message
      );
      throw error;
    }
  },

  async addTeam(teamData) {
    try {
      if (!teamData || !teamData.name) {
        throw new Error("Données d'équipe invalides");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(api.baseUrl + `/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajouter le token ici
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipe:", error.message);
      throw error; // Propager l'erreur au lieu de retourner null
    }
  },

  async addPokemonToTeam(id, pokemonId) {
    try {
      if (!id || !pokemonId) {
        throw new Error("ID ou données d'équipe manquants");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(
        `${api.baseUrl}/teams/${id}/pokemons/${pokemonId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pokemonId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Erreur lors de l'ajout du Pokémon ${pokemonId} à l'équipe ${id}:`,
        error.message
      );
      throw error;
    }
  },

  async deleteTeam(id) {
    try {
      if (!id) {
        throw new Error("ID de l'équipe manquant");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(api.baseUrl + `/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur lors de la suppression de l'équipe (${response.status})`);
      }

      return true;
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'équipe ${id}:`,
        error.message
      );
      throw error;
    }
  },

  async deletePokemonFromTeam(teamId, pokemonId) {
    try {
      if (!teamId || !pokemonId) {
        throw new Error("ID de l'équipe ou du Pokémon manquant");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(
        `${api.baseUrl}/teams/${teamId}/pokemons/${pokemonId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur lors de la suppression du Pokémon (${response.status})`);
      }

      return true;
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du Pokémon ${pokemonId} de l'équipe ${teamId}:`,
        error.message
      );
      throw error;
    }
  },

  async updateTeam(teamId, data) {
    const response = await fetch(api.baseUrl + `/teams/${teamId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  async login(data) {
    try {
      const response = await fetch(api.baseUrl + `/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Vérifie si la réponse est une erreur HTTP
      if (!response.ok) {
        const errorData = await response.json(); // Tente de lire la réponse d'erreur
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

      return await response.json(); // Si tout est bon, retourne la réponse JSON
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      return { success: false, message: error.message }; // Retourne une structure d'erreur propre
    }
  },

  async register(data) {
    try {
      const response = await fetch(api.baseUrl + `/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Tente de lire la réponse d'erreur
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

      return await response.json(); // Si tout est bon, retourne la réponse JSON
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      return { success: false, message: error.message };
    }
  },

  async togglePokemonLike(pokemonId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(
        `${api.baseUrl}/pokemons/${pokemonId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Erreur lors du like/unlike du Pokémon ${pokemonId}:`,
        error.message
      );
      throw error;
    }
  },
};

export default api;
