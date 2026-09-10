/**
 * COMPONENTE: Header (js/components/header.js)
 * 
 * Responsabilidade: Renderizar o cabeçalho superior da aplicação.
 * - Gerencia os botões de navegação SPA (Produtos vs Favoritos).
 * - Exibe o contador dinâmico de produtos favoritados.
 * - Permite alternar o tema da aplicação (Claro / Escuro - Bônus).
 */

/**
 * Inicializa e renderiza o Header no container fornecido.
 * 
 * @param {HTMLElement} container - O elemento <header> onde o conteúdo será inserido.
 * @param {Object} options - Objeto de opções e callbacks.
 * @param {Function} options.onNavigate - Função chamada quando o usuário clica em uma aba de navegação.
 * @param {Function} options.onToggleTheme - Função chamada ao clicar no botão de tema.
 * @param {string} options.currentTheme - 'light' ou 'dark'.
 * @param {number} options.favoritesCount - Quantidade inicial de itens favoritados.
 * @returns {Object} Métodos para atualizar o header externamente (ex: atualizar contador).
 */
export function setupHeader(container, { onNavigate, onToggleTheme, currentTheme, favoritesCount }) {
  // Estrutura HTML do Header
  container.innerHTML = `
    <div class="header-container">
      <!-- Logotipo da Loja -->
      <a href="#" class="brand-logo" id="brand-link">
        <span class="logo-icon">🛍️</span>
        <span>FakeStore SPA</span>
      </a>

      <!-- Ações de Navegação e Tema -->
      <div class="header-actions">
        <nav class="nav-tabs" aria-label="Navegação Principal">
          <button 
            type="button" 
            class="nav-btn active" 
            id="nav-products" 
            data-target="products"
          >
            📦 Produtos
          </button>
          
          <button 
            type="button" 
            class="nav-btn" 
            id="nav-favorites" 
            data-target="favorites"
          >
            ⭐ Favoritos
            <span class="badge" id="favorites-badge">${favoritesCount}</span>
          </button>
        </nav>

        <!-- Botão de Alternância de Tema Claro / Escuro -->
        <button 
          type="button" 
          class="theme-toggle-btn" 
          id="btn-theme-toggle" 
          title="Alternar entre tema claro e escuro"
          aria-label="Alternar tema"
        >
          ${currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  `;

  // Seletores dos elementos do cabeçalho
  const navProducts = container.querySelector('#nav-products');
  const navFavorites = container.querySelector('#nav-favorites');
  const brandLink = container.querySelector('#brand-link');
  const themeToggleBtn = container.querySelector('#btn-theme-toggle');
  const favoritesBadge = container.querySelector('#favorites-badge');

  /**
   * Atualiza visualmente o botão ativo no menu
   */
  function setActiveTab(target) {
    if (target === 'products') {
      navProducts.classList.add('active');
      navFavorites.classList.remove('active');
    } else {
      navFavorites.classList.add('active');
      navProducts.classList.remove('active');
    }
  }

  // Evento de clique na aba de Produtos
  navProducts.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveTab('products');
    onNavigate('products');
  });

  // Evento de clique no logo (leva para produtos)
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveTab('products');
    onNavigate('products');
  });

  // Evento de clique na aba de Favoritos
  navFavorites.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveTab('favorites');
    onNavigate('favorites');
  });

  // Evento de clique no botão de alternar Tema
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = onToggleTheme();
    themeToggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  });

  // Retorna funções utilitárias para o app.js controlar o header
  return {
    setActiveTab,
    updateFavoritesCount(count) {
      if (favoritesBadge) {
        favoritesBadge.textContent = count;
      }
    }
  };
}
