/**
 * MÓDULO: StorageService (js/storage.js)
 * 
 * Responsabilidade: Gerenciar a persistência de dados no navegador do usuário
 * utilizando a API do localStorage (Favoritos e Preferência de Tema).
 */

// Chaves utilizadas para salvar os dados no localStorage
const FAVORITES_KEY = 'fakestore_spa_favorites';
const THEME_KEY = 'fakestore_spa_theme';

export const StorageService = {
  /**
   * Obtém a lista de IDs de produtos favoritados.
   * Como o localStorage só armazena strings, usamos JSON.parse para converter de volta para Array.
   * @returns {Array<number>} Array contendo os IDs dos produtos favoritos.
   */
  getFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      // Se existir, converte string JSON para Array; se não, retorna um array vazio []
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler favoritos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva o array de IDs de favoritos no localStorage em formato string JSON.
   * @param {Array<number>} favoritesArray 
   */
  saveFavorites(favoritesArray) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error);
    }
  },

  /**
   * Verifica se um determinado ID de produto já está nos favoritos.
   * @param {number} productId 
   * @returns {boolean} true se for favorito, false caso contrário.
   */
  isFavorite(productId) {
    const favorites = this.getFavorites();
    return favorites.includes(productId);
  },

  /**
   * Alterna o estado de favorito de um produto (Adiciona se não existir, remove se já existir).
   * @param {number} productId 
   * @returns {boolean} Retorna true se foi adicionado, false se foi removido.
   */
  toggleFavorite(productId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(productId);
    let isNowFavorited = false;

    if (index === -1) {
      // Não estava nos favoritos: adiciona o ID
      favorites.push(productId);
      isNowFavorited = true;
    } else {
      // Já estava nos favoritos: remove o ID usando splice
      favorites.splice(index, 1);
      isNowFavorited = false;
    }

    // Salva a lista atualizada
    this.saveFavorites(favorites);
    return isNowFavorited;
  },

  /**
   * Retorna o tema salvo ('light' ou 'dark') ou 'light' como padrão.
   * @returns {string}
   */
  getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  },

  /**
   * Salva a preferência de tema do usuário no localStorage.
   * @param {string} theme ('light' ou 'dark')
   */
  saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }
};
