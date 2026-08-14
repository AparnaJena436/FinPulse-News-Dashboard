// Categorized RSS Feeds by Region
const FEEDS = [
  // --- India Market Feeds ---
  { 
    region: 'india',
    category: 'economy', 
    source: 'Economic Times (Economy)', 
    url: 'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms' 
  },
  { 
    region: 'india',
    category: 'markets', 
    source: 'Economic Times (Markets)', 
    url: 'https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms' 
  },
  { 
    region: 'india',
    category: 'economy', 
    source: 'Times of India (Business)', 
    url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms' 
  },

  // --- Global Market Feeds ---
  { 
    region: 'global',
    category: 'markets', 
    source: 'Yahoo Finance', 
    url: 'https://finance.yahoo.com/news/rssindex' 
  },
  { 
    region: 'global',
    category: 'economy', 
    source: 'CNBC Economy', 
    url: 'https://search.cnbc.com/rs/search/combinednavbar/rss?partnerId=wr2012&id=20910258' 
  },
  { 
    region: 'global',
    category: 'crypto', 
    source: 'CoinDesk', 
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' 
  }
];

// Contextual Fallbacks
const FALLBACK_NEWS = [
  {
    title: "RBI Monetary Policy Committee Maintains Repo Rate to Balance Growth and Inflation",
    description: "The Reserve Bank of India keeps benchmark lending rates unchanged while monitoring rural consumption.",
    link: "https://economictimes.indiatimes.com",
    source: "Economic Times",
    category: "economy",
    region: "india",
    pubDate: new Date().toISOString()
  },
  {
    title: "Global Central Banks Coordinate Policy Stance as Equity Markets Adjust",
    description: "International monetary authorities evaluate employment data while technology benchmarks move steadily.",
    link: "https://finance.yahoo.com",
    source: "Yahoo Finance",
    category: "markets",
    region: "global",
    pubDate: new Date().toISOString()
  }
];

const POSITIVE_WORDS = ['surge', 'rally', 'gain', 'growth', 'profit', 'boost', 'record', 'bullish', 'exceed', 'rise', 'positive', 'strong', 'jump', 'expansion', 'soars'];
const NEGATIVE_WORDS = ['drop', 'fall', 'slump', 'recession', 'inflation', 'loss', 'bearish', 'cut', 'lawsuit', 'warning', 'risk', 'decline', 'crisis', 'default', 'deficit'];

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
  grid.innerHTML = `<div class="loading-state card"><i class="fa-solid fa-spinner fa-spin"></i> Fetching India & Global feeds...</div>`;

  let fetchedArticles = [];

  for (const feed of FEEDS) {
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();

      if (data && data.items && data.items.length > 0) {
        const parsed = data.items.slice(0, 6).map(item => ({
          title: item.title,
          description: stripHTML(item.description || item.content || ''),
          link: item.link,
          source: feed.source,
          category: feed.category,
          region: feed.region,
          pubDate: item.pubDate
        }));
        fetchedArticles.push(...parsed);
      }
    } catch (err) {
      console.warn(`Feed issue on ${feed.source}:`, err);
    }
  }

  if (fetchedArticles.length < 4) {
    fetchedArticles = [...fetchedArticles, ...FALLBACK_NEWS];
  }

  allArticles = fetchedArticles.map(article => {
    const sentiment = calculateSentiment(`${article.title} ${article.description}`);
    return { ...article, sentiment };
  });

  // Calculate separate market sentiments!
  calculateRegionSentiment('india', 'indiaScore', 'indiaStatus', 'indiaGaugePointer');
  calculateRegionSentiment('global', 'globalScore', 'globalStatus', 'globalGaugePointer');

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

function calculateRegionSentiment(region, scoreElId, statusElId, pointerElId) {
  const regionArticles = allArticles.filter(a => a.region === region);
  if (regionArticles.length === 0) return;

  const total = regionArticles.length;
  const positive = regionArticles.filter(a => a.sentiment.type === 'positive').length;
  const negative = regionArticles.filter(a => a.sentiment.type === 'negative').length;

  const netRatio = (positive - negative) / total;
  const normalizedScore = Math.round(netRatio * 100);

  const scoreEl = document.getElementById(scoreElId);
  const statusEl = document.getElementById(statusElId);
  const pointerEl = document.getElementById(pointerElId);

  scoreEl.textContent = (normalizedScore > 0 ? '+' : '') + normalizedScore;

  const pointerPercent = ((normalizedScore + 100) / 200) * 100;
  pointerEl.style.left = `${pointerPercent}%`;

  if (normalizedScore > 10) {
    statusEl.textContent = "Bullish Sentiment";
    statusEl.className = "sentiment-status bullish";
  } else if (normalizedScore < -10) {
    statusEl.textContent = "Bearish Caution";
    statusEl.className = "sentiment-status bearish";
  } else {
    statusEl.textContent = "Neutral / Balanced";
    statusEl.className = "sentiment-status neutral";
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
    grid.innerHTML = `<div class="loading-state card">No headlines matching "${searchQuery}".</div>`;
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
        <p class="news-snippet">${item.description || 'Click below to read article...'}</p>
      </div>
      <div class="card-bottom">
        <span class="sentiment-badge ${item.sentiment.type}">${item.sentiment.label}</span>
        <a href="${item.link}" target="_blank" style="color: var(--accent); font-size:0.8rem; text-decoration:none; font-weight:600;">
          Read Article <i class="fa-solid fa-arrow-up-right-from-square"></i>
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
  if (!dateStr) return 'Today';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Today' : `${d.getMonth() + 1}/${d.getDate()}`;
}
