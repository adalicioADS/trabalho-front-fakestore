/**
 * MÓDULO PRINCIPAL: App (js/app.js)
 * 
 * Responsabilidade: Ponto de entrada da SPA (Single Page Application).
 * - Integra os módulos de API, Storage e Componentes (ES6).
 * - Gerencia o estado global (produtos carregados, filtros, navegação).
 * - Controla a alternância de seções sem recarregar a página (Roteamento SPA).
 */

// Importação dos módulos ES6
import { ApiService } from './api.js';
import { StorageService } from './storage.js';
import { setupHeader } from './components/header.js';
import { createProductCard } from './components/productCard.js';

/* ==========================================================================
   ESTADO DA APLICAÇÃO (Application State)
   ========================================================================== */
const state = {
  products: [],              // Lista de todos os produtos retornados da Fake Store API
  activeSection: 'products', // Seção atual exibida na SPA: 'products' ou 'favorites'
  searchQuery: '',           // Termo digitado no campo de busca por nome
  selectedCategory: 'all',   // Categoria selecionada no filtro
  sortOption: 'default'      // Opção de ordenação selecionada (preço, avaliação)
};

/* ==========================================================================
   REFERÊNCIAS AOS ELEMENTOS DO DOM
   ========================================================================== */
const DOM = {
  header: document.getElementById('app-header'),
  loadingIndicator: document.getElementById('loading-indicator'),
  errorMessage: document.getElementById('error-message'),
  btnRetry: document.getElementById('btn-retry'),
  
  // Seções da SPA
  controlsSection: document.querySelector('.controls-section'),
  productsSection: document.getElementById('products-section'),
  favoritesSection: document.getElementById('favorites-section'),
  
  // Grids de exibição
  productsGrid: document.getElementById('products-grid'),
  favoritesGrid: document.getElementById('favorites-grid'),
  
  // Contadores
  productsCounter: document.getElementById('products-counter'),
  favoritesCounter: document.getElementById('favorites-counter'),
  
  // Estados vazios (Empty States)
  noProductsFound: document.getElementById('no-products-found'),
  noFavoritesState: document.getElementById('no-favorites-state'),
  btnGoToProducts: document.getElementById('btn-go-to-products'),
  
  // Controles de Filtro
  searchInput: document.getElementById('search-input'),
  categoryFilter: document.getElementById('category-filter'),
  sortFilter: document.getElementById('sort-filter'),
  btnClearFilters: document.getElementById('btn-clear-filters')
};

// Controlador do Header (criado na inicialização)
let headerController = null;

/* ==========================================================================
   FUNÇÕES DE NAVEGAÇÃO SPA (Alternância de Seções sem Reload)
   ========================================================================== */

/**
 * Alterna entre as seções da SPA manipulando classes do DOM sem recarregar a página.
 * @param {string} sectionName - 'products' ou 'favorites'
 */
function navigateTo(sectionName) {
  state.activeSection = sectionName;

  if (sectionName === 'products') {
    // Exibe a seção de produtos e oculta a de favoritos
    DOM.productsSection.classList.remove('hidden');
    DOM.favoritesSection.classList.add('hidden');
    
    // Na tela de produtos, os filtros ficam visíveis
    DOM.controlsSection.classList.remove('hidden');
    
    // Atualiza a renderização dos produtos
    renderProducts();
  } else if (sectionName === 'favorites') {
    // Exibe a seção de favoritos e oculta a de produtos
    DOM.favoritesSection.classList.remove('hidden');
    DOM.productsSection.classList.add('hidden');
    
    // Na tela de favoritos, ocultamos a barra de filtros para simplificar a visualização
    DOM.controlsSection.classList.add('hidden');
    
    // Renderiza a lista de favoritos
    renderFavorites();
  }

  // Sincroniza a aba ativa no Header
  if (headerController) {
    headerController.setActiveTab(sectionName);
  }

  // Rola a página suavemente para o topo ao navegar
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   FUNÇÕES DE FAVORITAR PRODUTOS
   ========================================================================== */

/**
 * Ação executada ao clicar no botão de favoritar em qualquer card.
 * @param {Object} product - Objeto do produto
 * @returns {boolean} Novo estado de favorito (true se favoritado, false se removido)
 */
function handleToggleFavorite(product) {
  // Alterna o produto no localStorage
  const isNowFav = StorageService.toggleFavorite(product.id);
  
  // Atualiza a contagem no badge do cabeçalho
  const currentFavs = StorageService.getFavorites();
  headerController.updateFavoritesCount(currentFavs.length);

  // Se o usuário estiver na tela de favoritos e desfavoritar um item, re-renderiza a lista
  if (state.activeSection === 'favorites') {
    renderFavorites();
  }

  return isNowFav;
}

/* ==========================================================================
   FUNÇÕES DE FILTRAGEM E ORDENAÇÃO
   ========================================================================== */

/**
 * Aplica os filtros de busca, categoria e ordenação sobre a lista de produtos.
 * @param {Array} productsList - Lista de produtos a serem filtrados
 * @returns {Array} Lista filtrada e ordenada
 */
function getFilteredProducts(productsList) {
  let result = [...productsList];

  // 1. Filtro por Busca Textual (Nome/Título do produto)
  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase().trim();
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  // 2. Filtro por Categoria (Bônus AP1)
  if (state.selectedCategory !== 'all') {
    result = result.filter(item => item.category === state.selectedCategory);
  }

  // 3. Ordenação por Preço ou Avaliação (Bônus AP1)
  if (state.sortOption === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (state.sortOption === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (state.sortOption === 'rating-desc') {
    result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
  }

  return result;
}

/* ==========================================================================
   RENDERIZAÇÃO DE TELAS E CARDS
   ========================================================================== */

/**
 * Renderiza os produtos na seção Catálogo de Produtos.
 */
function renderProducts() {
  // Limpa o grid antes de renderizar os novos cards
  DOM.productsGrid.innerHTML = '';

  // Aplica filtros e ordenação
  const filtered = getFilteredProducts(state.products);
  
  // Atualiza o contador da seção
  DOM.productsCounter.textContent = `Exibindo ${filtered.length} de ${state.products.length} produtos`;

  // Se nenhum produto for encontrado com os filtros atuais
  if (filtered.length === 0) {
    DOM.noProductsFound.classList.remove('hidden');
    return;
  }
  
  DOM.noProductsFound.classList.add('hidden');

  // Obtém a lista atual de IDs favoritos para marcar os cards
  const favoriteIds = StorageService.getFavorites();

  // Cria e adiciona cada card no DOM
  filtered.forEach(product => {
    const isFav = favoriteIds.includes(product.id);
    const cardElement = createProductCard(product, isFav, handleToggleFavorite);
    DOM.productsGrid.appendChild(cardElement);
  });
}

/**
 * Renderiza os produtos na seção Meus Favoritos.
 */
function renderFavorites() {
  DOM.favoritesGrid.innerHTML = '';

  const favoriteIds = StorageService.getFavorites();
  
  // Filtra apenas os produtos da Fake Store que estão na lista de favoritos
  const favProducts = state.products.filter(product => favoriteIds.includes(product.id));

  // Atualiza contador
  DOM.favoritesCounter.textContent = `${favProducts.length} ${favProducts.length === 1 ? 'item salvo' : 'itens salvos'}`;

  // Se não houver favoritos salvos, exibe o aviso amigável
  if (favProducts.length === 0) {
    DOM.noFavoritesState.classList.remove('hidden');
    return;
  }

  DOM.noFavoritesState.classList.add('hidden');

  // Renderiza os cards dos favoritos
  favProducts.forEach(product => {
    const cardElement = createProductCard(product, true, handleToggleFavorite);
    DOM.favoritesGrid.appendChild(cardElement);
  });
}

/**
 * Preenche o elemento <select> com as categorias retornadas da API.
 * @param {Array<string>} categories 
 */
function populateCategories(categories) {
  // Remove opções antigas exceto a padrão ("Todas as categorias")
  DOM.categoryFilter.innerHTML = '<option value="all">Todas as categorias</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    DOM.categoryFilter.appendChild(option);
  });
}

/* ==========================================================================
   CONFIGURAÇÃO DE EVENTOS E CONTROLES
   ========================================================================== */
function setupEventListeners() {
  // Filtro de busca por nome com evento 'input' (busca em tempo real)
  DOM.searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    renderProducts();
  });

  // Filtro de categoria com evento 'change'
  DOM.categoryFilter.addEventListener('change', (event) => {
    state.selectedCategory = event.target.value;
    renderProducts();
  });

  // Ordenação com evento 'change'
  DOM.sortFilter.addEventListener('change', (event) => {
    state.sortOption = event.target.value;
    renderProducts();
  });

  // Botão Limpar Filtros
  DOM.btnClearFilters.addEventListener('click', () => {
    state.searchQuery = '';
    state.selectedCategory = 'all';
    state.sortOption = 'default';

    DOM.searchInput.value = '';
    DOM.categoryFilter.value = 'all';
    DOM.sortFilter.value = 'default';

    renderProducts();
  });

  // Botão Tentar Novamente (caso ocorra erro no fetch)
  DOM.btnRetry.addEventListener('click', () => {
    loadData();
  });

  // Botão de "Ver Catálogo" exibido na tela vazia de favoritos
  DOM.btnGoToProducts.addEventListener('click', () => {
    navigateTo('products');
  });
}

/* ==========================================================================
   CARREGAMENTO DE DADOS (Consumo Assíncrono da API)
   ========================================================================== */
async function loadData() {
  try {
    // 1. Exibe o indicador de carregamento e oculta possíveis erros anteriores
    DOM.loadingIndicator.classList.remove('hidden');
    DOM.errorMessage.classList.add('hidden');
    DOM.productsSection.classList.add('hidden');
    DOM.controlsSection.classList.add('hidden');

    // 2. Faz as chamadas assíncronas via ApiService
    const [products, categories] = await Promise.all([
      ApiService.getProducts(),
      ApiService.getCategories()
    ]);

    // 3. Armazena os produtos no estado da aplicação
    state.products = products;

    // 4. Preenche o select de categorias
    // Se a API não retornou categorias, extrai dinamicamente dos próprios produtos
    const categoryList = categories.length > 0 
      ? categories 
      : [...new Set(products.map(p => p.category))];
    populateCategories(categoryList);

    // 5. Oculta o loading e exibe os dados
    DOM.loadingIndicator.classList.add('hidden');
    DOM.controlsSection.classList.remove('hidden');
    DOM.productsSection.classList.remove('hidden');

    // 6. Renderiza os produtos na tela
    renderProducts();

  } catch (error) {
    // Tratamento de erro com feedback visual para o usuário
    console.error('Erro na inicialização da aplicação:', error);
    DOM.loadingIndicator.classList.add('hidden');
    DOM.errorMessage.classList.remove('hidden');
  }
}

/* ==========================================================================
   INICIALIZAÇÃO DA APLICAÇÃO
   ========================================================================== */
function init() {
  // 1. Recupera e aplica o tema salvo (Claro ou Escuro)
  const savedTheme = StorageService.getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);

  // 2. Inicializa o componente Header
  const currentFavorites = StorageService.getFavorites();
  headerController = setupHeader(DOM.header, {
    currentTheme: savedTheme,
    favoritesCount: currentFavorites.length,
    onNavigate: (targetSection) => {
      navigateTo(targetSection);
    },
    onToggleTheme: () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      // Atualiza atributo no HTML e salva no localStorage
      document.documentElement.setAttribute('data-theme', nextTheme);
      StorageService.saveTheme(nextTheme);
      return nextTheme;
    }
  });

  // 3. Configura os ouvintes de eventos da interface
  setupEventListeners();

  // 4. Inicia a busca de dados da Fake Store API
  loadData();
}

// Executa a inicialização quando o HTML estiver totalmente carregado
document.addEventListener('DOMContentLoaded', init);
