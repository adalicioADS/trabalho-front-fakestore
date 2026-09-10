/**
 * MÓDULO: ApiService (js/api.js)
 * 
 * Responsabilidade: Gerenciar todas as requisições HTTP para a Fake Store API.
 * - Utiliza a Fetch API de forma assíncrona (async/await).
 * - Realiza o parsing dos dados para JSON.
 * - Trata possíveis erros de rede ou de resposta HTTP (try/catch).
 */

const BASE_URL = 'https://fakestoreapi.com';

export const ApiService = {
  /**
   * Busca todos os produtos da Fake Store API.
   * @returns {Promise<Array>} Lista de produtos retornados pela API.
   * @throws {Error} Mensagem de erro caso a requisição falhe.
   */
  async getProducts() {
    try {
      // Faz a requisição HTTP GET usando fetch
      const response = await fetch(`${BASE_URL}/products`);

      // response.ok verifica se o status HTTP está na faixa de sucesso (200-299)
      if (!response.ok) {
        throw new Error(`Erro na requisição: status ${response.status} (${response.statusText})`);
      }

      // Converte a resposta em formato JSON para um objeto/array JavaScript
      const data = await response.json();
      return data;
    } catch (error) {
      // Exibe o erro no console para depuração
      console.error('Falha ao buscar produtos da API:', error);
      // Repassa o erro para ser tratado pela interface do usuário (UI)
      throw error;
    }
  },

  /**
   * Busca todas as categorias disponíveis (Bônus para o filtro por categoria).
   * @returns {Promise<Array>} Lista de nomes das categorias.
   */
  async getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Não foi possível carregar categorias da API, usando extração local.', error);
      return [];
    }
  }
};
