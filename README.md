# Avaliação Parcial 1 (AP1) - Fake Store SPA

Trabalho desenvolvido para a disciplina de **Aplicações Front-end** do curso de Análise e Desenvolvimento de Sistemas (ADS) da **ULBRA Torres**.  
**Professor:** Juliano Ramos Matos  
**Aluno:** [Seu Nome Aqui]  

---

## Sobre o Projeto

O objetivo deste trabalho foi criar uma SPA (Single Page Application) simples utilizando apenas **HTML, CSS e JavaScript puro (Vanilla)**, consumindo os produtos da [Fake Store API](https://fakestoreapi.com/products).

A aplicação não utiliza frameworks (como React ou Vue) nem bibliotecas prontas. Para organizar o código, separei tudo em módulos ES6 (`import` e `export`), dividindo as responsabilidades de cada parte do sistema.

---

## O que foi implementado

### Requisitos Obrigatórios:
- **JavaScript Vanilla:** Desenvolvido sem nenhum framework ou biblioteca externa.
- **Módulos ES6:** Código separado em arquivos com responsabilidades definidas:
  - `js/api.js`: faz as chamadas para a API com `fetch` e `async/await`, tratando erros com `try/catch`.
  - `js/storage.js`: cuida de salvar e carregar os favoritos e o tema no `localStorage`.
  - `js/components/header.js`: renderiza o cabeçalho e controla a navegação entre as páginas.
  - `js/components/productCard.js`: cria o card de cada produto com imagem, título, preço, avaliação e botão de favoritar.
  - `js/app.js`: script principal que junta os módulos, gerencia os filtros e controla o que aparece na tela.
- **Consumo da API:** Busca a lista de produtos da Fake Store API de forma assíncrona.
- **Sistema de Favoritos:** O usuário pode favoritar ou desfavoritar qualquer produto, e os favoritos continuam salvos mesmo se recarregar a página (`localStorage`).
- **Navegação SPA:** Alternância entre a tela de produtos e a tela de favoritos apenas manipulando o DOM (ocultando e mostrando seções), sem dar refresh na página.
- **Filtro de busca:** Campo de texto para pesquisar produtos pelo nome em tempo real.
- **Loading:** Indicador visual de carregamento enquanto a API está respondendo.
- **Responsividade:** Layout adaptável para computador, tablet e celular usando CSS Grid e Flexbox.

### Requisitos Extras / Bônus:
- **Filtro por categoria:** Menu para filtrar os itens pelas categorias da loja.
- **Ordenação:** Opção de ordenar por menor preço, maior preço e melhor avaliação.
- **Tema Claro / Escuro (Dark Mode):** Botão no topo para alternar entre modo claro e escuro, salvando a preferência no `localStorage`.
- **Contador no menu:** Mostra no botão de favoritos quantos produtos estão salvos no momento.

---

## Estrutura das Pastas

```
Trabalho Front/
├── index.html
├── styles.css
├── README.md
├── .gitignore
└── js/
    ├── app.js
    ├── api.js
    ├── storage.js
    └── components/
        ├── header.js
        └── productCard.js
```

---

## Como Rodar o Projeto

Como o projeto utiliza módulos ES6 (`type="module"`), os navegadores modernos bloqueiam o carregamento se o arquivo `index.html` for aberto diretamente com dois cliques (por conta da política de segurança de arquivos locais). É necessário rodar com um servidor local:

1. Abra a pasta do projeto no **VS Code**.
2. Tenha instalada a extensão **Live Server**.
3. Clique com o botão direito no arquivo `index.html` e escolha a opção **"Open with Live Server"**.
4. O projeto vai abrir automaticamente no seu navegador padrão (geralmente em `http://127.0.0.1:5500`).
