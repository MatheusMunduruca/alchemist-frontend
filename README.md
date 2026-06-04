# 🧪 Empório do Rudolf — Frontend

Loja de alquimia com temática de fantasia imersiva, onde o alquimista **Rudolf** vende poções, ingredientes, grimórios e equipamentos. O usuário gasta as **Gold Coins** que ganhou cumprindo missões na [Taverna do Gregor](https://github.com/MatheusMunduruca/todo-frontend) — os dois sistemas compartilham login e economia.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![React Router](https://img.shields.io/badge/React%20Router-6-ca4245?logo=reactrouter)
![Axios](https://img.shields.io/badge/Axios-HTTP-5a29e4?logo=axios)

---

## 🌌 Universo compartilhado

Este frontend conversa com **dois backends**:

| Backend | Porta | Usado para |
|---|---|---|
| [todo-api](https://github.com/MatheusMunduruca/todo-api) (Taverna) | 5000 | Login compartilhado e saldo de ouro |
| [ecommerce-api](https://github.com/MatheusMunduruca/ecommerce-api) (Empório) | 5252 | Produtos, carrinho e pedidos |

Uma conta criada na Taverna do Gregor **já funciona aqui** — mesmo login, mesmo ouro. Ganhe ouro cumprindo tarefas com o Gregor e gaste comprando itens com o Rudolf.

---

## 🎮 Conceito

O usuário entra no laboratório de Rudolf, que o recebe com falas contextuais:

> *"O que você procura hoje, viajante? Tenho poções para qualquer necessidade..."*

Ao se cadastrar, Rudolf entrega 1.000 de ouro de boas-vindas:

> *"Aqui, tome esse pequeno agrado, para você poder testar a qualidade de meus itens..."*

Os itens têm estoque que **muda a cada 6 horas** e podem aparecer com **descontos** (selo "-X%" com preço riscado), tudo controlado pelo backend.

---

## ✨ Funcionalidades

- **Login/registro compartilhado** com a Taverna do Gregor (mesma conta nos dois sites)
- **Saldo de ouro** exibido no cabeçalho, sincronizado com o backend
- **Vitrine de produtos** com filtro por categoria (Poções, Ingredientes, Grimórios, Equipamentos)
- **Cartas de poção animadas** — bolhas, brilho e cor por categoria
- **Selo de desconto** com preço original riscado e preço final destacado
- **Carrinho** ("Bolsa de Couro") com checkout que deduz o ouro e cria o pedido
- **Som de moedas** ao comprar itens
- **Música de fundo** (Alchemy Lab) que **continua tocando entre as páginas** — só para ao mutar ou trocar de conta
- **Cenário imersivo do Rudolf**: laboratório com prateleiras de poções, velas tremeluzentes e fumaça mágica
- Link cruzado para a Taverna do Gregor

---

## 🛠️ Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Roteamento | React Router DOM 6 |
| HTTP Client | Axios (duas instâncias: Taverna + Empório, com interceptor JWT) |
| Estilização | CSS Modules + CSS custom properties |
| Áudio | HTML5 Audio (singleton de módulo p/ música persistir entre rotas) |
| Tipografia | Google Fonts (Cinzel, Crimson Text) |
| Persistência local | localStorage (token JWT, ouro, volume) |

---

## 📁 Estrutura

```
src/
├── components/
│   ├── Rudolf.jsx          # Cena do laboratório (retrato + prateleiras + velas + fumaça)
│   ├── PotionCard.jsx      # Carta de produto animada com selo de desconto
│   ├── GoldCounter.jsx     # Contador de ouro (variante fixa e inline p/ cabeçalho)
│   ├── MusicControl.jsx    # Play/pause + volume no cabeçalho
│   └── DialogBox.jsx       # Balão de fala do Rudolf
├── pages/
│   ├── Login.jsx           # Login via tavernApi (compartilhado)
│   ├── Register.jsx        # Registro + 1.000 de ouro + fala do Rudolf
│   ├── Shop.jsx            # Vitrine + Rudolf + filtros
│   └── Cart.jsx            # Bolsa + checkout
├── services/
│   └── api.js              # tavernApi (5000) e shopApi (5252) com JWT
└── utils/
    ├── gold.js             # formatação e som de ouro
    └── music.js            # singleton de áudio que sobrevive à navegação
```

---

## ⚙️ Como rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+
- [todo-api](https://github.com/MatheusMunduruca/todo-api) rodando em `http://localhost:5000`
- [ecommerce-api](https://github.com/MatheusMunduruca/ecommerce-api) rodando em `http://localhost:5252`

### Instalação
```bash
npm install
npm run dev
```
Acesse `http://localhost:5174`.

### Assets
Para a experiência completa, coloque em `public/sounds/`:

| Arquivo | Descrição |
|---|---|
| `alchemy-lab.mp3` | Música de fundo do laboratório (loop) |
| `gold.mp3` | Efeito de moedas ao comprar / receber ouro |

E o retrato do Rudolf em `src/assets/rudolf.jpg`. Sem os áudios, a aplicação funciona normalmente em silêncio.

---

## 🧠 Decisões técnicas

- **Singleton de áudio em nível de módulo** (`utils/music.js`): o objeto `Audio` vive fora do ciclo de vida dos componentes, então a música não reinicia ao navegar entre Loja e Bolsa — só para ao mutar ou no logout.
- **Duas instâncias de Axios**: separam claramente as chamadas de autenticação/ouro (Taverna) das de catálogo/carrinho (Empório), ambas anexando o mesmo JWT.
- **CSS Modules + variáveis CSS** para a paleta de alquimia (roxo profundo, verde esmeralda, âmbar) sem dependências extras.
- **Cena do Rudolf 100% em CSS** (prateleiras, velas, fumaça) sobre o retrato, evitando assets pesados.

---

## 👨‍💻 Autor

**Matheus Munduruca** · [GitHub](https://github.com/MatheusMunduruca) · [LinkedIn](https://linkedin.com/in/matheusmunduruca644200209)
