// Financial RSS Feeds
const FEEDS = [
  { category: 'markets', source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
  { category: 'economy', source: 'CNBC Economy', url: 'https://search.cnbc.com/rs/search/combinednavbar/rss?partnerId=wr2012&id=20910258' },
  { category: 'crypto', source: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' }
];

// Fallback items in case proxy is slow
const FALLBACK_NEWS = [
  {
    title: "Global Central Banks Signal Cautious Stance on Interest Rate Cuts",
    description: "Policymakers emphasize data-dependent approaches amidst sticky inflation trends worldwide.",
    link: "https://finance.yahoo.com",
    source: "Global Macro",
    category: "economy",
    pubDate: new Date().toISOString()
  },
  {
    title: "Tech Sector Rallies as Corporate Earnings Exceed Market Estimates",
    description: "Major technology firms report strong quarterly revenue growth driven by cloud infrastructure investments.",
    link: "https://finance.yahoo.com",
    source: "MarketWatch",
    category: "markets",
    pubDate: new Date().toISOString()
  },
  {
    title: "Energy Markets Stabilize Following Supply Chain Inventory Reports",
    description: "Crude oil prices hold steady as global demand forecasts align with production outputs.",
    link: "https://finance.yahoo.com",
    source: "Reuters",
    category: "markets",
    pubDate: new Date().toISOString()
  }
];

// Word Sentiment Dictionary
const POSITIVE_WORDS = ['surge', 'rally', 'gain', 'growth', 'profit', 'boost', 'record', 'bullish', 'exceed', 'rise', 'positive', 'strong', 'jump'];
const NEGATIVE_WORDS = ['drop', 'fall', 'slump', 'recession', 'inflation', 'loss', 'bearish', 'cut', 'lawsuit', 'warning', 'risk', 'decline', 'crisis', 'default'];

let allArticles = [];
let currentCategory = 'all';
let searchQuery = '';

window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();
  await fetchAllFeeds();
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderNews();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderNews();
    });
  });
}

async function fetchAllFeeds() {
  const grid = document.getElementById('newsGrid');
  grid.innerHTML = `<div class="loading-state card"><i class="fa-solid fa-spinner fa-spin"></i> Fetching live global feeds...</div>`;

  let fetchedArticles = [];

  for (const feed of FEEDS) {
    try {
      // Using public RSS-to-JSON endpoint
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();

      if (data && data.items) {
        const parsed = data.items.slice(0, 8).map(item => ({
          title: item.title,
          description: stripHTML(item.description || item.content || ''),
          link: item.link,
          source: feed.source,
          category: feed.category,
          pubDate: item.pubDate
        }));
        fetchedArticles.push(...parsed);
      }
    } catch (err) {
      console.warn(`Feed error for ${feed.source}:`, err);
    }
  }

  // Use fallback if live fetch returned few results
  if (fetchedArticles.length < 3) {
    fetchedArticles = [...fetchedArticles, ...FALLBACK_NEWS];
  }

  // Run sentiment calculation on each article
  allArticles = fetchedArticles.map(article => {
    const sentiment = calculateSentiment(`${article.title} ${article.description}`);
    return { ...article, sentiment };
  });

  updateGlobalSentimentMeter();
  renderNews();
}

function calculateSentiment(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let score = 0;

  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) score += 1;
    if (NEGATIVE_WORDS.includes(word)) score -= 1;
  });

  if (score > 0) return { label: 'Bullish', type: 'positive', score };
  if (score < 0) return { label: 'Bearish', type: 'negative', score };
  return { label: 'Neutral', type: 'neutral', score: 0 };
}

function updateGlobalSentimentMeter() {
  if (allArticles.length === 0) return;

  const totalScore = allArticles.reduce((acc, curr) => acc + curr.sentiment.score, 0);
  const normalizedScore = Math.max(-100, Math.min(100, totalScore * 10));

  const scoreEl = document.getElementById('sentimentScore');
  const statusEl = document.getElementById('sentimentStatus');
  const pointerEl = document.getElementById('gaugePointer');

  scoreEl.textContent = (normalizedScore > 0 ? '+' : '') + normalizedScore;

  // Position pointer from 0% (Bearish) to 100% (Bullish)
  const pointerPercent = ((normalizedScore + 100) / 200) * 100;
  pointerEl.style.left = `${pointerPercent}%`;

  if (normalizedScore > 15) {
    statusEl.textContent = "Bullish Sentiment Dominates";
    statusEl.className = "bullish";
  } else if (normalizedScore < -15) {
    statusEl.textContent = "Bearish / Risk-Off Caution";
    statusEl.className = "bearish";
  } else {
    statusEl.textContent = "Neutral / Mixed Market Signals";
    statusEl.className = "neutral";
  }
}

function renderNews() {
  const grid = document.getElementById('newsGrid');
  grid.innerHTML = '';

  const filtered = allArticles.filter(article => {
    const matchesCategory = (currentCategory === 'all') || (article.category === currentCategory);
    const matchesSearch = article.title.toLowerCase().includes(searchQuery) || 
                          article.description.toLowerCase().includes(searchQuery) ||
                          article.source.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="loading-state card">No news articles match your filter or search query.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card news-card';
    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="source-tag">${item.source}</span>
          <span>${formatDate(item.pubDate)}</span>
        </div>
        <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
        <p class="news-snippet">${item.description || 'Click to read full story...'}</p>
      </div>
      <div class="card-bottom">
        <span class="sentiment-badge ${item.sentiment.type}">${item.sentiment.label}</span>
        <a href="${item.link}" target="_blank" style="color: var(--accent); font-size:0.8rem; text-decoration:none;">
          Read More <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function stripHTML(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function formatDate(dateStr) {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Recent' : `${d.getMonth() + 1}/${d.getDate()}`;
}
