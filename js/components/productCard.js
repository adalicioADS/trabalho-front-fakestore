/**
 * COMPONENTE: ProductCard (js/components/productCard.js)
 * 
 * Responsabilidade: Criar e retornar o elemento HTML (Card) de um produto individual.
 * - Exibe imagem, título, preço, categoria e estrelas de avaliação.
 * - Gerencia o botão de favoritar e dispara um evento quando clicado.
 */

/**
 * Cria o elemento DOM representando o card do produto.
 * 
 * @param {Object} product - Dados do produto vindo da API Fake Store.
 * @param {boolean} isFavorite - Indica se o produto já está favoritado.
 * @param {Function} onToggleFavorite - Função callback acionada ao clicar no botão de favoritar.
 * @returns {HTMLElement} Elemento <article> pronto para ser inserido no DOM.
 */
export function createProductCard(product, isFavorite, onToggleFavorite) {
  // Cria o container principal do card com a tag semântica <article>
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-id', product.id);

  // Formata o preço para o padrão de moeda brasileiro (R$) ou dólares ($)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price * 5); // Multiplicado por 5 para simular conversão aproximada em Real

  // Formata a avaliação (estrelas e quantidade de avaliações)
  const ratingRate = product.rating ? product.rating.rate : 'N/A';
  const ratingCount = product.rating ? product.rating.count : 0;

  // Monta a estrutura HTML interna do card
  card.innerHTML = `
    <div class="card-image-wrapper">
      <img 
        src="${product.image}" 
        alt="${product.title}" 
        class="card-image"
        loading="lazy"
      >
      <button 
        type="button" 
        class="btn-favorite ${isFavorite ? 'favorited' : ''}" 
        title="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
        aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
      >
        ${isFavorite ? '★' : '☆'}
      </button>
    </div>

    <div class="card-body">
      <span class="card-category">${product.category}</span>
      <h3 class="card-title" title="${product.title}">${product.title}</h3>
      
      <div class="card-rating">
        <span class="star-icon">★</span>
        <span>${ratingRate}</span>
        <span class="rating-count">(${ratingCount} avaliações)</span>
      </div>

      <div class="card-footer">
        <span class="card-price">${formattedPrice}</span>
      </div>
    </div>
  `;

  // Adiciona o ouvinte de evento (Event Listener) no botão de favoritar
  const favButton = card.querySelector('.btn-favorite');
  favButton.addEventListener('click', (event) => {
    // Impede comportamentos indesejados
    event.stopPropagation();

    // Chama o callback passando o produto clicado
    const newFavStatus = onToggleFavorite(product);

    // Atualiza a aparência visual do botão instantaneamente no card
    if (newFavStatus) {
      favButton.classList.add('favorited');
      favButton.innerHTML = '★';
      favButton.title = 'Remover dos favoritos';
    } else {
      favButton.classList.remove('favorited');
      favButton.innerHTML = '☆';
      favButton.title = 'Adicionar aos favoritos';
    }
  });

  return card;
}
