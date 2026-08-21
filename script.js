/* =========================================================
   FINPULSE V2
   FINANCIAL NEWS INTELLIGENCE DASHBOARD
   ========================================================= */


/* =========================================================
   RSS2JSON API
   ========================================================= */

const RSS2JSON_API =
    "https://api.rss2json.com/v1/api.json?rss_url=";


/* =========================================================
   FINANCIAL RSS FEEDS
   ========================================================= */

/*
   We intentionally use financial/business feeds only.
   The keyword filter below provides another layer of protection.
*/

const indiaFeeds = [
    {
        name: "Moneycontrol",
        url: "https://www.moneycontrol.com/rss/latestnews.xml"
    },
    {
        name: "Business Standard",
        url: "https://www.business-standard.com/rss/latest.xml"
    },
    {
        name: "Economic Times",
        url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms"
    }
];


const globalFeeds = [
    {
        name: "Reuters",
        url: "https://feeds.reuters.com/reuters/businessNews"
    },
    {
        name: "CNBC",
        url: "https://www.cnbc.com/id/100003114/device/rss/rss.html"
    },
    {
        name: "MarketWatch",
        url: "https://feeds.content.dowjones.io/public/rss/mw_topstories"
    }
];


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let allNews = [];

let currentRegion = "all";
let currentCategory = "all";
let currentSentiment = "all";
let searchQuery = "";


/* =========================================================
   FINANCIAL KEYWORDS
   ========================================================= */

/*
   These keywords decide whether a news article belongs
   on FINPULSE.

   The dashboard is deliberately strict.
*/

const financialKeywords = [

    // Stock market
    "stock",
    "stocks",
    "share",
    "shares",
    "equity",
    "equities",
    "nifty",
    "sensex",
    "nasdaq",
    "dow jones",
    "s&p",
    "market",
    "markets",
    "investor",
    "investors",
    "trading",
    "trader",
    "rally",
    "selloff",
    "sell-off",
    "bullish",
    "bearish",
    "ipo",
    "listing",
    "valuation",

    // Finance
    "finance",
    "financial",
    "revenue",
    "profit",
    "loss",
    "earnings",
    "eps",
    "margin",
    "cash flow",
    "debt",
    "investment",
    "investments",
    "funding",
    "capital",
    "private equity",
    "venture capital",
    "asset",
    "assets",

    // Economy
    "economy",
    "economic",
    "gdp",
    "inflation",
    "deflation",
    "interest rate",
    "interest rates",
    "repo rate",
    "monetary policy",
    "fiscal",
    "employment",
    "unemployment",
    "growth",
    "recession",
    "manufacturing",
    "industrial production",

    // Banking
    "bank",
    "banks",
    "banking",
    "loan",
    "loans",
    "credit",
    "npa",
    "deposit",
    "deposits",
    "rbi",
    "federal reserve",
    "fed",
    "central bank",

    // Companies
    "company",
    "companies",
    "corporate",
    "merger",
    "acquisition",
    "acquire",
    "deal",
    "partnership",
    "expansion",
    "restructuring",
    "layoffs",

    // Commodities
    "oil",
    "crude",
    "gold",
    "silver",
    "commodity",
    "commodities",

    // Currency
    "rupee",
    "dollar",
    "euro",
    "yen",
    "currency",
    "forex",

    // Technology with financial relevance
    "technology",
    "tech",
    "artificial intelligence",
    "artificial intelligence",
    "ai",
    "semiconductor",
    "semiconductors",
    "chip",
    "chips",
    "software",
    "cloud",
    "cybersecurity",
    "electric vehicle",
    "electric vehicles"
];


/* =========================================================
   EXCLUDED KEYWORDS
   ========================================================= */

/*
   These are intentionally excluded unless the article
   contains strong financial keywords.
*/

const excludedKeywords = [

    "fashion",
    "celebrity",
    "movie review",
    "film review",
    "bollywood",
    "hollywood",
    "cricket",
    "football",
    "soccer",
    "tennis",
    "match result",
    "sports",
    "recipe",
    "cooking",
    "travel guide",
    "tourism",
    "horoscope",
    "astrology",
    "entertainment",
    "music release",
    "concert",
    "lifestyle",
    "health tips",
    "beauty",
    "wedding",
    "relationship",
    "viral video"
];


/* =========================================================
   COMPANY / STOCK DETECTION
   ========================================================= */

const companies = [

    "Reliance",
    "TCS",
    "Tata Consultancy Services",
    "Infosys",
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "SBI",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "ITC",
    "Bharti Airtel",
    "Airtel",
    "Larsen & Toubro",
    "L&T",
    "Tata Motors",
    "Tata Steel",
    "Adani Enterprises",
    "Adani Ports",
    "Adani Green",
    "Hindustan Unilever",
    "HUL",
    "Asian Paints",
    "Maruti Suzuki",
    "Mahindra & Mahindra",
    "M&M",
    "Bajaj Finance",
    "Bajaj Finserv",
    "Wipro",
    "HCLTech",
    "HCL Technologies",
    "Tech Mahindra",
    "Sun Pharma",
    "Dr Reddy",
    "Dixon Technologies",
    "Nestle India",
    "Apple",
    "Microsoft",
    "Amazon",
    "Alphabet",
    "Google",
    "Meta",
    "Nvidia",
    "Tesla",
    "AMD",
    "Intel",
    "Samsung",
    "TSMC"
];


/* =========================================================
   INDUSTRY DETECTION
   ========================================================= */

const industryKeywords = {

    "Banking & Financial Services": [
        "bank",
        "banking",
        "loan",
        "credit",
        "npa",
        "rbi",
        "deposit",
        "insurance",
        "finance"
    ],

    "Technology": [
        "technology",
        "tech",
        "software",
        "artificial intelligence",
        "ai",
        "semiconductor",
        "chip",
        "cloud",
        "cybersecurity"
    ],

    "IT Services": [
        "tcs",
        "infosys",
        "wipro",
        "hcl",
        "tech mahindra",
        "software",
        "it services"
    ],

    "Automobile": [
        "automobile",
        "automotive",
        "car",
        "vehicle",
        "ev",
        "electric vehicle",
        "tata motors",
        "maruti",
        "mahindra"
    ],

    "Energy": [
        "oil",
        "crude",
        "gas",
        "energy",
        "renewable",
        "solar",
        "coal",
        "power"
    ],

    "Pharmaceuticals": [
        "pharma",
        "pharmaceutical",
        "drug",
        "medicine",
        "healthcare",
        "biotech"
    ],

    "Metals": [
        "steel",
        "metal",
        "copper",
        "aluminium",
        "iron ore"
    ],

    "Consumer Goods": [
        "fmcg",
        "consumer",
        "nestle",
        "hul",
        "hindustan unilever",
        "itc",
        "asian paints"
    ],

    "Telecommunications": [
        "telecom",
        "airtel",
        "jio",
        "vodafone",
        "5g"
    ],

    "Real Estate": [
        "real estate",
        "property",
        "housing",
        "residential",
        "commercial property"
    ],

    "Market & Economy": [
        "stock market",
        "sensex",
        "nifty",
        "inflation",
        "gdp",
        "interest rate",
        "economy",
        "economic growth",
        "recession"
    ]
};


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function cleanText(text) {

    if (!text) return "";

    const temp = document.createElement("div");

    temp.innerHTML = text;

    return temp.textContent
        .replace(/\s+/g, " ")
        .trim();
}


function containsKeyword(text, keywords) {

    const lower = text.toLowerCase();

    return keywords.some(keyword =>
        lower.includes(keyword.toLowerCase())
    );
}


function countKeywordMatches(text, keywords) {

    const lower = text.toLowerCase();

    return keywords.filter(keyword =>
        lower.includes(keyword.toLowerCase())
    ).length;
}


/* =========================================================
   CHECK IF ARTICLE IS FINANCIAL
   ========================================================= */

function isFinancialNews(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();

    const financialScore =
        countKeywordMatches(text, financialKeywords);

    const excludedScore =
        countKeywordMatches(text, excludedKeywords);

    /*
       Strong financial signals always take priority.
    */

    if (financialScore >= 2) {
        return true;
    }

    /*
       A single strong financial keyword can also qualify.
    */

    const strongFinancialWords = [
        "nifty",
        "sensex",
        "ipo",
        "earnings",
        "profit",
        "revenue",
        "rbi",
        "interest rate",
        "inflation",
        "gdp",
        "stock",
        "shares",
        "investor",
        "bank",
        "market",
        "funding",
        "merger",
        "acquisition"
    ];

    if (containsKeyword(text, strongFinancialWords)) {

        if (excludedScore === 0) {
            return true;
        }
    }

    return false;
}


/* =========================================================
   DETERMINE CATEGORY
   ========================================================= */

function detectCategory(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();


    if (
        containsKeyword(text, [
            "stock",
            "shares",
            "nifty",
            "sensex",
            "nasdaq",
            "dow jones",
            "equity",
            "ipo",
            "investor",
            "trading"
        ])
    ) {
        return "Stock Market";
    }


    if (
        containsKeyword(text, [
            "gdp",
            "inflation",
            "interest rate",
            "repo rate",
            "economy",
            "economic growth",
            "recession",
            "monetary policy",
            "fiscal"
        ])
    ) {
        return "Economy";
    }


    if (
        containsKeyword(text, [
            "technology",
            "artificial intelligence",
            "ai",
            "semiconductor",
            "chip",
            "software",
            "cloud",
            "cybersecurity"
        ])
    ) {
        return "Technology";
    }


    if (
        containsKeyword(text, [
            "bank",
            "banking",
            "loan",
            "credit",
            "rbi",
            "npa",
            "deposit"
        ])
    ) {
        return "Finance";
    }


    return "Finance";
}


/* =========================================================
   DETERMINE INDUSTRY
   ========================================================= */

function detectIndustry(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();


    let bestIndustry = "Financial Markets";
    let bestScore = 0;


    for (const industry in industryKeywords) {

        const score =
            countKeywordMatches(
                text,
                industryKeywords[industry]
            );

        if (score > bestScore) {

            bestScore = score;
            bestIndustry = industry;
        }
    }


    return bestIndustry;
}


/* =========================================================
   DETECT COMPANIES
   ========================================================= */

function detectCompanies(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();


    const found = [];


    companies.forEach(company => {

        if (
            text.includes(
                company.toLowerCase()
            )
        ) {

            if (!found.includes(company)) {
                found.push(company);
            }
        }

    });


    return found;
}


/* =========================================================
   SENTIMENT
   ========================================================= */

const positiveWords = [

    "growth",
    "profit",
    "profits",
    "surge",
    "surges",
    "rally",
    "gain",
    "gains",
    "rise",
    "rises",
    "higher",
    "strong",
    "stronger",
    "record",
    "beat",
    "beats",
    "upgrade",
    "upgraded",
    "positive",
    "expansion",
    "investment",
    "funding",
    "approval",
    "approved",
    "recovery",
    "improve",
    "improved",
    "increase",
    "increased"
];


const negativeWords = [

    "loss",
    "losses",
    "fall",
    "falls",
    "drop",
    "drops",
    "decline",
    "declines",
    "lower",
    "weak",
    "weaker",
    "crisis",
    "debt",
    "downgrade",
    "downgraded",
    "layoff",
    "layoffs",
    "cut",
    "cuts",
    "warning",
    "risk",
    "risks",
    "inflation",
    "recession",
    "penalty",
    "fine",
    "investigation",
    "lawsuit",
    "default"
];


function detectSentiment(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();


    let positive = 0;
    let negative = 0;


    positiveWords.forEach(word => {

        if (text.includes(word)) {
            positive++;
        }

    });


    negativeWords.forEach(word => {

        if (text.includes(word)) {
            negative++;
        }

    });


    if (positive > negative) {
        return "bullish";
    }


    if (negative > positive) {
        return "bearish";
    }


    return "neutral";
}


/* =========================================================
   ARTICLE-SPECIFIC EXPLANATION
   ========================================================= */

function generateAnalysis(article) {

    const title = article.title || "This news";

    const description =
        cleanText(
            article.description ||
            article.content ||
            ""
        );


    const category =
        detectCategory(article);


    const industry =
        detectIndustry(article);


    const companies =
        detectCompanies(article);


    const sentiment =
        detectSentiment(article);


    /* ---------------------------------------------
       1. SIMPLE EXPLANATION
       --------------------------------------------- */

    let simpleExplanation = "";


    if (description.length > 0) {

        simpleExplanation =
            simplifyNews(
                title,
                description,
                category
            );

    } else {

        simpleExplanation =
            `${title}. In simple terms, this means that the development could affect financial activity in the ${category.toLowerCase()} area.`;

    }


    /* ---------------------------------------------
       2. IMPACTED INDUSTRY
       --------------------------------------------- */

    let affectedIndustry =
        `The main area affected is ${industry}.`;


    if (companies.length > 0) {

        affectedIndustry +=
            ` The article specifically mentions ${companies.slice(0, 4).join(", ")}.`;
    }


    /* ---------------------------------------------
       3. CURRENT / FUTURE IMPACT
       --------------------------------------------- */

    let impactText = "";


    if (sentiment === "bullish") {

        impactText =
            `Currently, this is a positive development because the news contains signals such as growth, investment, stronger performance or improving business conditions. If the trend continues, it could support earnings, investor confidence or valuations in the affected area.`;
    }


    else if (sentiment === "bearish") {

        impactText =
            `Currently, this is a negative development because the news contains signals such as weaker performance, higher risk, losses, cost pressure or uncertainty. If the situation continues, companies in the affected area could face pressure on earnings, costs or investor confidence.`;
    }


    else {

        impactText =
            `The immediate impact appears mixed or uncertain. Investors would normally watch the next earnings results, management decisions, economic data or market reaction to understand whether this becomes a larger positive or negative development.`;
    }


    /* ---------------------------------------------
       4. WHO IS AFFECTED
       --------------------------------------------- */

    let affectedPeople = "";


    if (companies.length > 0) {

        affectedPeople =
            `The most directly affected are investors and shareholders of ${companies.slice(0, 4).join(", ")}. Employees, customers, suppliers and competitors may also be affected depending on how the development changes the company's business.`;

    } else if (category === "Stock Market") {

        affectedPeople =
            `The most directly affected are stock-market investors and shareholders. Companies mentioned in the news, their employees and competitors can also be affected depending on the market reaction.`;

    } else if (category === "Economy") {

        affectedPeople =
            `The impact can reach investors, companies, consumers and businesses because economic conditions can influence borrowing costs, spending, profits and investment decisions.`;

    } else if (category === "Technology") {

        affectedPeople =
            `Technology companies, investors, employees, customers and competing companies are the main groups potentially affected.`;

    } else {

        affectedPeople =
            `Investors, companies, customers and other participants in the affected financial sector are the main groups potentially affected.`;
    }


    return {

        simple: simpleExplanation,

        industry: affectedIndustry,

        impact: impactText,

        affected: affectedPeople

    };
}


/* =========================================================
   SIMPLIFY NEWS
   ========================================================= */

function simplifyNews(title, description, category) {

    let cleanDescription =
        cleanText(description);


    /*
       Remove excessive source descriptions.
    */

    cleanDescription =
        cleanDescription
            .replace(/\[[^\]]*\]/g, "")
            .replace(/\s+/g, " ")
            .trim();


    /*
       Limit length so the explanation remains readable.
    */

    if (cleanDescription.length > 350) {

        cleanDescription =
            cleanDescription.substring(0, 350) +
            "...";
    }


    return `${title}. In simple terms, the news means that ${cleanDescription}`;
}


/* =========================================================
   FETCH RSS FEED
   ========================================================= */

async function fetchFeed(feed, region) {

    try {

        const url =
            RSS2JSON_API +
            encodeURIComponent(feed.url);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Feed request failed"
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            !data.items
        ) {

            return [];
        }


        return data.items.map(item => {

            const article = {

                title:
                    cleanText(item.title),

                description:
                    cleanText(
                        item.description ||
                        item.content ||
                        ""
                    ),

                content:
                    cleanText(
                        item.content ||
                        item.description ||
                        ""
                    ),

                link:
                    item.link || "#",

                source:
                    feed.name,

                region:
                    region,

                pubDate:
                    item.pubDate || ""

            };


            article.category =
                detectCategory(article);


            article.industry =
                detectIndustry(article);


            article.sentiment =
                detectSentiment(article);


            article.companies =
                detectCompanies(article);


            article.analysis =
                generateAnalysis(article);


            return article;

        });


    } catch (error) {

        console.error(
            `Could not load ${feed.name}:`,
            error
        );


        return [];
    }
}


/* =========================================================
   LOAD ALL NEWS
   ========================================================= */

async function loadNews() {

    showLoading();


    try {

        const indiaPromises =
            indiaFeeds.map(feed =>
                fetchFeed(feed, "India")
            );


        const globalPromises =
            globalFeeds.map(feed =>
                fetchFeed(feed, "Global")
            );


        const results =
            await Promise.all([
                ...indiaPromises,
                ...globalPromises
            ]);


        let articles =
            results.flat();


        /*
           IMPORTANT:
           Only financial news survives this filter.
        */

        articles =
            articles.filter(
                article =>
                    isFinancialNews(article)
            );


        /*
           Remove duplicate headlines.
        */

        const seen =
            new Set();


        articles =
            articles.filter(article => {

                const key =
                    article.title
                        .toLowerCase()
                        .trim();


                if (seen.has(key)) {
                    return false;
                }


                seen.add(key);

                return true;
            });


        /*
           Sort newest first.
        */

        articles.sort(
            (a, b) =>
                new Date(b.pubDate) -
                new Date(a.pubDate)
        );


        allNews = articles;


        calculateMarketSentiment();


        updateDashboard();


        renderNews();


    } catch (error) {

        console.error(
            "News loading error:",
            error
        );


        showError();

    }
}


/* =========================================================
   MARKET SENTIMENT
   ========================================================= */

function calculateSentimentScore(news) {

    if (!news.length) {
        return 50;
    }


    let bullish = 0;
    let bearish = 0;


    news.forEach(article => {

        if (
            article.sentiment ===
            "bullish"
        ) {

            bullish++;

        } else if (
            article.sentiment ===
            "bearish"
        ) {

            bearish++;
        }

    });


    const total =
        bullish +
        bearish;


    if (total === 0) {
        return 50;
    }


    /*
       Score:
       0 = extremely bearish
       50 = neutral
       100 = extremely bullish
    */

    return Math.round(
        (bullish / total) * 100
    );
}


function getStatus(score) {

    if (score >= 65) {
        return "bullish";
    }


    if (score <= 35) {
        return "bearish";
    }


    return "neutral";
}


/* =========================================================
   UPDATE MARKET GAUGES
   ========================================================= */

function updateGauge(
    pointerId,
    scoreId,
    statusId,
    descriptionId,
    score
) {

    const pointer =
        document.getElementById(
            pointerId
        );


    const scoreElement =
        document.getElementById(
            scoreId
        );


    const statusElement =
        document.getElementById(
            statusId
        );


    const descriptionElement =
        document.getElementById(
            descriptionId
        );


    if (pointer) {

        pointer.style.left =
            `${score}%`;
    }


    if (scoreElement) {

        scoreElement.textContent =
            score;
    }


    const status =
        getStatus(score);


    if (statusElement) {

        statusElement.textContent =
            status.toUpperCase();


        statusElement.className =
            `status-badge ${status}`;
    }


    if (descriptionElement) {

        if (status === "bullish") {

            descriptionElement.textContent =
                "Financial news currently has more positive signals than negative signals.";

        } else if (status === "bearish") {

            descriptionElement.textContent =
                "Financial news currently has more negative signals than positive signals.";

        } else {

            descriptionElement.textContent =
                "Positive and negative financial signals are relatively balanced.";
        }
    }
}


/* =========================================================
   MARKET DASHBOARD
   ========================================================= */

function calculateMarketSentiment() {

    const indiaNews =
        allNews.filter(
            article =>
                article.region === "India"
        );


    const globalNews =
        allNews.filter(
            article =>
                article.region === "Global"
        );


    const indiaScore =
        calculateSentimentScore(
            indiaNews
        );


    const globalScore =
        calculateSentimentScore(
            globalNews
        );


    /*
       Try several possible IDs so this JS
       remains compatible with the HTML.
    */

    updateGauge(
        "indiaGaugePointer",
        "indiaScore",
        "indiaStatus",
        "indiaMarketDescription",
        indiaScore
    );


    updateGauge(
        "globalGaugePointer",
        "globalScore",
        "globalStatus",
        "globalMarketDescription",
        globalScore
    );


    /*
       Alternative IDs
    */

    const indiaPointer =
        document.getElementById(
            "india-pointer"
        );


    const globalPointer =
        document.getElementById(
            "global-pointer"
        );


    if (indiaPointer) {
        indiaPointer.style.left =
            `${indiaScore}%`;
    }


    if (globalPointer) {
        globalPointer.style.left =
            `${globalScore}%`;
    }
}


/* =========================================================
   DASHBOARD BREAKDOWN
   ========================================================= */

function updateDashboard() {

    updateBreakdown();

    updateSectors();

    updateStats();
}


/* =========================================================
   BREAKDOWN
   ========================================================= */

function updateBreakdown() {

    const bullish =
        allNews.filter(
            n =>
                n.sentiment ===
                "bullish"
        ).length;


    const neutral =
        allNews.filter(
            n =>
                n.sentiment ===
                "neutral"
        ).length;


    const bearish =
        allNews.filter(
            n =>
                n.sentiment ===
                "bearish"
        ).length;


    const total =
        bullish +
        neutral +
        bearish;


    setProgress(
        "bullishProgress",
        bullish,
        total
    );


    setProgress(
        "neutralProgress",
        neutral,
        total
    );


    setProgress(
        "bearishProgress",
        bearish,
        total
    );


    setText(
        "bullishCount",
        bullish
    );


    setText(
        "neutralCount",
        neutral
    );


    setText(
        "bearishCount",
        bearish
    );
}


/* =========================================================
   PROGRESS
   ========================================================= */

function setProgress(
    id,
    value,
    total
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (value / total) * 100
            );


    element.style.width =
        `${percentage}%`;
}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;
    }
}


/* =========================================================
   SECTORS
   ========================================================= */

function updateSectors() {

    const sectorCounts = {};


    allNews.forEach(article => {

        const industry =
            article.industry ||
            "Financial Markets";


        sectorCounts[industry] =
            (sectorCounts[industry] || 0) +
            1;
    });


    const container =
        document.getElementById(
            "sectorList"
        );


    if (!container) return;


    container.innerHTML = "";


    const sorted =
        Object.entries(
            sectorCounts
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 8);


    if (!sorted.length) {

        container.innerHTML =
            `<p style="color:var(--muted);font-size:12px;">
                No sector data available.
            </p>`;

        return;
    }


    const max =
        sorted[0][1];


    sorted.forEach(
        ([sector, count]) => {

            const percentage =
                Math.round(
                    (count / max) * 100
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "sector-row";


            row.innerHTML = `

                <div class="sector-top">

                    <span class="sector-name">
                        ${sector}
                    </span>

                    <span class="sector-count">
                        ${count} news
                    </span>

                </div>

                <div class="sector-bar">

                    <div
                        class="sector-bar-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            container.appendChild(row);
        }
    );
}


/* =========================================================
   MINI STATS
   ========================================================= */

function updateStats() {

    const india =
        allNews.filter(
            n =>
                n.region ===
                "India"
        ).length;


    const global =
        allNews.filter(
            n =>
                n.region ===
                "Global"
        ).length;


    const total =
        allNews.length;


    setText(
        "indiaNewsCount",
        india
    );


    setText(
        "globalNewsCount",
        global
    );


    setText(
        "totalNewsCount",
        total
    );
}


/* =========================================================
   FILTER NEWS
   ========================================================= */

function getFilteredNews() {

    return allNews.filter(
        article => {

            /*
               REGION
            */

            if (
                currentRegion !==
                "all" &&
                article.region !==
                currentRegion
            ) {

                return false;
            }


            /*
               CATEGORY
            */

            if (
                currentCategory !==
                "all" &&
                article.category !==
                currentCategory
            ) {

                return false;
            }


            /*
               SENTIMENT
            */

            if (
                currentSentiment !==
                "all" &&
                article.sentiment !==
                currentSentiment
            ) {

                return false;
            }


            /*
               SEARCH
            */

            if (searchQuery) {

                const searchableText =
                    (
                        article.title +
                        " " +
                        article.description +
                        " " +
                        article.industry +
                        " " +
                        article.companies.join(" ")
                    ).toLowerCase();


                if (
                    !searchableText.includes(
                        searchQuery
                    )
                ) {

                    return false;
                }
            }


            return true;
        }
    );
}


/* =========================================================
   RENDER NEWS
   ========================================================= */

function renderNews() {

    const container =
        document.getElementById(
            "newsContainer"
        );


    if (!container) {

        console.error(
            "newsContainer was not found."
        );

        return;
    }


    const news =
        getFilteredNews();


    container.innerHTML = "";


    updateResultsInfo(
        news.length
    );


    if (!news.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No financial news found
                </h3>

                <p>
                    Try another search or filter.
                </p>

            </div>

        `;

        return;
    }


    news.forEach(
        (article, index) => {

            container.appendChild(
                createNewsCard(
                    article,
                    index
                )
            );
        }
    );
}


/* =========================================================
   CREATE NEWS CARD
   ========================================================= */

function createNewsCard(
    article,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "news-card";


    const companiesText =
        article.companies.length
            ? article.companies
                .slice(0, 3)
                .join(", ")
            : "Financial market participants";


    card.innerHTML = `

        <div class="news-top">

            <div class="news-meta">

                <span class="news-source">
                    ${escapeHTML(article.source)}
                </span>

                <span class="news-industry">
                    ${escapeHTML(article.industry)}
                </span>

                <span class="news-industry">
                    ${escapeHTML(article.category)}
                </span>

            </div>

            <span class="sentiment-label ${article.sentiment}">
                ${article.sentiment.toUpperCase()}
            </span>

        </div>


        <h3>
            ${escapeHTML(article.title)}
        </h3>


        <p class="news-description">
            ${escapeHTML(
                shorten(
                    article.description,
                    300
                )
            )}
        </p>


        <div class="news-bottom">

            <a
                class="read-link"
                href="${article.link}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read full article →
            </a>


            <button
                class="explain-btn"
                data-index="${index}"
            >
                Explain this news
            </button>

        </div>


        <div
            class="news-analysis"
            id="analysis-${index}"
        >

            <div class="analysis-title">
                FINPULSE INTELLIGENCE
            </div>


            <div class="analysis-item">

                <strong>
                    1. What is this news saying?
                </strong>

                <span>
                    ${escapeHTML(
                        article.analysis.simple
                    )}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    2. Which industry / company is affected?
                </strong>

                <span>
                    ${escapeHTML(
                        article.analysis.industry
                    )}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    3. What is the current / future impact?
                </strong>

                <span>
                    ${escapeHTML(
                        article.analysis.impact
                    )}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    4. Who is affected?
                </strong>

                <span>
                    ${escapeHTML(
                        article.analysis.affected
                    )}
                </span>

            </div>

        </div>

    `;


    const button =
        card.querySelector(
            ".explain-btn"
        );


    button.addEventListener(
        "click",
        () => {

            const analysis =
                card.querySelector(
                    ".news-analysis"
                );


            if (
                analysis.classList.contains(
                    "show"
                )
            ) {

                analysis.classList.remove(
                    "show"
                );


                button.textContent =
                    "Explain this news";

            } else {

                analysis.classList.add(
                    "show"
                );


                button.textContent =
                    "Hide explanation";
            }

        }
    );


    return card;
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;
}


/* =========================================================
   SHORTEN TEXT
   ========================================================= */

function shorten(
    text,
    maxLength
) {

    if (!text) {
        return "No description available.";
    }


    if (
        text.length <=
        maxLength
    ) {

        return text;
    }


    return (
        text.substring(
            0,
            maxLength
        ) +
        "..."
    );
}


/* =========================================================
   RESULTS INFO
   ========================================================= */

function updateResultsInfo(
    count
) {

    const element =
        document.getElementById(
            "resultsInfo"
        );


    if (!element) return;


    element.textContent =
        `${count} financial ${
            count === 1
                ? "story"
                : "stories"
        } found`;
}


/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {

    const container =
        document.getElementById(
            "newsContainer"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="loading-card">

            <div class="loader"></div>

            <p>
                Loading financial news...
            </p>

        </div>

    `;
}


/* =========================================================
   ERROR
   ========================================================= */

function showError() {

    const container =
        document.getElementById(
            "newsContainer"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="empty-state">

            <h3>
                Unable to load news
            </h3>

            <p>
                The RSS feeds could not be reached.
                Please refresh the page and try again.
            </p>

        </div>

    `;
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        event => {

            searchQuery =
                event.target.value
                    .toLowerCase()
                    .trim();


            renderNews();

        }
    );
}


/* =========================================================
   CATEGORY FILTERS
   ========================================================= */

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    (
                        button.dataset.category ||
                        button.dataset.filter ||
                        button.textContent
                    )
                    .trim();


                /*
                   Normalize common labels.
                */

                if (
                    currentCategory
                        .toLowerCase() ===
                    "all"
                ) {

                    currentCategory =
                        "all";
                }


                renderNews();

            }
        );

    });
}


/* =========================================================
   SENTIMENT FILTERS
   ========================================================= */

function setupSentimentFilters() {

    const buttons =
        document.querySelectorAll(
            ".sentiment-filter"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentSentiment =
                    (
                        button.dataset.sentiment ||
                        button.textContent
                    )
                    .trim()
                    .toLowerCase();


                if (
                    currentSentiment ===
                    "all"
                ) {

                    currentSentiment =
                        "all";
                }


                renderNews();

            }
        );

    });
}


/* =========================================================
   REGION FILTER
   ========================================================= */

function setupRegionFilters() {

    const buttons =
        document.querySelectorAll(
            "[data-region]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentRegion =
                    button.dataset.region;


                renderNews();

            }
        );

    });
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function setupThemeToggle() {

    const button =
        document.getElementById(
            "themeToggle"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            localStorage.setItem(
                "finpulseTheme",
                isLight
                    ? "light"
                    : "dark"
            );


            button.textContent =
                isLight
                    ? "☀"
                    : "☾";
        }
    );


    const savedTheme =
        localStorage.getItem(
            "finpulseTheme"
        );


    if (
        savedTheme ===
        "light"
    ) {

        document.body.classList.add(
            "light-mode"
        );


        button.textContent =
            "☀";

    } else {

        button.textContent =
            "☾";
    }
}


/* =========================================================
   DATE
   ========================================================= */

function updateDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (!element) return;


    const now =
        new Date();


    element.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


/* =========================================================
   LAST UPDATED
   ========================================================= */

function updateLastUpdated() {

    const elements =
        document.querySelectorAll(
            ".update-text"
        );


    const time =
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    elements.forEach(
        element => {

            element.textContent =
                `Updated ${time}`;

        }
    );
}


/* =========================================================
   REFRESH
   ========================================================= */

function setupRefresh() {

    const buttons =
        document.querySelectorAll(
            "#refreshNews, .refresh-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                loadNews();

            }
        );

    });
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "FINPULSE V2 starting..."
        );


        setupSearch();

        setupCategoryFilters();

        setupSentimentFilters();

        setupRegionFilters();

        setupThemeToggle();

        setupRefresh();

        updateDate();

        loadNews();

        updateLastUpdated();


        /*
           Refresh financial news every 15 minutes.
        */

        setInterval(
            () => {

                loadNews();

                updateLastUpdated();

            },
            15 * 60 * 1000
        );

    }
);
