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
   NEWS SOURCES
   ========================================================= */

const indiaFeeds = [
    {
        name: "Moneycontrol",
        url: "https://www.moneycontrol.com/rss/latestnews.xml"
    },
    {
        name: "Economic Times",
        url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms"
    },
    {
        name: "Business Standard",
        url: "https://www.business-standard.com/rss/latest.xml"
    }
];


const globalFeeds = [
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

let currentSentiment = "all";

let searchQuery = "";


/* =========================================================
   FINANCIAL KEYWORDS
   ========================================================= */

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
    "s&p 500",
    "market",
    "markets",
    "investor",
    "investors",
    "trading",
    "trader",
    "rally",
    "selloff",
    "sell-off",
    "ipo",
    "listing",
    "valuation",

    // Finance
    "finance",
    "financial",
    "revenue",
    "profit",
    "profits",
    "loss",
    "losses",
    "earnings",
    "eps",
    "margin",
    "cash flow",
    "debt",
    "investment",
    "investments",
    "funding",
    "capital",

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
    "fiscal policy",
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

    // Business
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

    // Financially relevant technology
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
   EXCLUDED NON-FINANCIAL TOPICS
   ========================================================= */

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
   INDUSTRIES
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
   POSITIVE / NEGATIVE WORDS
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


/* =========================================================
   CLEAN TEXT
   ========================================================= */

function cleanText(text) {

    if (!text) {
        return "";
    }

    const temp =
        document.createElement("div");

    temp.innerHTML = text;

    return temp.textContent
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   COUNT KEYWORDS
   ========================================================= */

function countKeywordMatches(
    text,
    keywords
) {

    const lower =
        text.toLowerCase();

    return keywords.filter(
        keyword =>
            lower.includes(
                keyword.toLowerCase()
            )
    ).length;
}


/* =========================================================
   CHECK FINANCIAL NEWS
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
        countKeywordMatches(
            text,
            financialKeywords
        );


    const excludedScore =
        countKeywordMatches(
            text,
            excludedKeywords
        );


    /*
       At least two financial signals
       are required for normal articles.
    */

    if (financialScore >= 2) {

        /*
           If the article contains a clearly
           non-financial topic, make sure it also
           has a strong financial signal.
        */

        if (
            excludedScore > 0 &&
            !containsStrongFinancialKeyword(text)
        ) {

            return false;
        }

        return true;
    }


    /*
       A strong financial keyword can qualify
       an article on its own.
    */

    if (
        containsStrongFinancialKeyword(text) &&
        excludedScore === 0
    ) {

        return true;
    }


    return false;
}


/* =========================================================
   STRONG FINANCIAL KEYWORDS
   ========================================================= */

function containsStrongFinancialKeyword(text) {

    const strongWords = [

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


    return strongWords.some(
        word =>
            text.includes(
                word.toLowerCase()
            )
    );
}


/* =========================================================
   CATEGORY
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
        containsAny(
            text,
            [
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
            ]
        )
    ) {

        return "Stock Market";
    }


    if (
        containsAny(
            text,
            [
                "gdp",
                "inflation",
                "interest rate",
                "repo rate",
                "economy",
                "economic growth",
                "recession",
                "monetary policy",
                "fiscal"
            ]
        )
    ) {

        return "Economy";
    }


    if (
        containsAny(
            text,
            [
                "technology",
                "artificial intelligence",
                "ai",
                "semiconductor",
                "chip",
                "software",
                "cloud",
                "cybersecurity"
            ]
        )
    ) {

        return "Technology";
    }


    if (
        containsAny(
            text,
            [
                "bank",
                "banking",
                "loan",
                "credit",
                "rbi",
                "npa",
                "deposit"
            ]
        )
    ) {

        return "Finance";
    }


    return "Finance";
}


/* =========================================================
   CONTAINS ANY
   ========================================================= */

function containsAny(
    text,
    words
) {

    return words.some(
        word =>
            text.includes(
                word.toLowerCase()
            )
    );
}


/* =========================================================
   INDUSTRY
   ========================================================= */

function detectIndustry(article) {

    const text = (
        article.title +
        " " +
        article.description +
        " " +
        article.content
    ).toLowerCase();


    let bestIndustry =
        "Financial Markets";


    let bestScore = 0;


    for (
        const industry in industryKeywords
    ) {

        const score =
            countKeywordMatches(
                text,
                industryKeywords[industry]
            );


        if (
            score > bestScore
        ) {

            bestScore =
                score;

            bestIndustry =
                industry;
        }
    }


    return bestIndustry;
}


/* =========================================================
   COMPANY DETECTION
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


    companies.forEach(
        company => {

            if (
                text.includes(
                    company.toLowerCase()
                )
            ) {

                if (
                    !found.includes(company)
                ) {

                    found.push(company);
                }
            }

        }
    );


    return found;
}


/* =========================================================
   SENTIMENT
   ========================================================= */

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


    positiveWords.forEach(
        word => {

            if (
                text.includes(word)
            ) {

                positive++;
            }

        }
    );


    negativeWords.forEach(
        word => {

            if (
                text.includes(word)
            ) {

                negative++;
            }

        }
    );


    if (
        positive > negative
    ) {

        return "bullish";
    }


    if (
        negative > positive
    ) {

        return "bearish";
    }


    return "neutral";
}


/* =========================================================
   ARTICLE-SPECIFIC ANALYSIS
   ========================================================= */

function generateAnalysis(article) {

    const title =
        article.title || "This news";


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


    const companiesFound =
        detectCompanies(article);


    const sentiment =
        detectSentiment(article);


    /* -----------------------------------------
       SIMPLE EXPLANATION
       ----------------------------------------- */

    let simple =
        "";


    if (
        description.length > 0
    ) {

        let shortDescription =
            description;


        if (
            shortDescription.length > 350
        ) {

            shortDescription =
                shortDescription.substring(
                    0,
                    350
                ) +
                "...";
        }


        simple =
            `The news is about ${title}. In simple terms, it means that ${shortDescription}`;

    } else {

        simple =
            `The news is about ${title}. In simple terms, this development is related to the ${category.toLowerCase()} and could influence financial decisions or market expectations.`;
    }


    /* -----------------------------------------
       INDUSTRY IMPACT
       ----------------------------------------- */

    let industryImpact =
        `The main industry affected is ${industry}.`;


    if (
        companiesFound.length > 0
    ) {

        industryImpact +=
            ` The specific company or companies mentioned are ${companiesFound.slice(0, 4).join(", ")}.`;
    }


    /* -----------------------------------------
       CURRENT / FUTURE IMPACT
       ----------------------------------------- */

    let impact =
        "";


    if (
        sentiment === "bullish"
    ) {

        impact =
            `The current signal is positive. If this development continues, it could support revenue growth, profitability, investor confidence or the valuation of the affected company or industry. Investors would watch upcoming results and market reaction to see whether the positive effect actually materialises.`;

    } else if (
        sentiment === "bearish"
    ) {

        impact =
            `The current signal is negative. If this situation continues, it could put pressure on revenue, profitability, costs, valuation or investor confidence. Investors would watch future company results and management actions to see whether the risk becomes more significant.`;

    } else {

        impact =
            `The immediate financial impact is not clearly positive or negative. Investors would normally watch future earnings, company announcements, economic data and market reaction before deciding whether this development has a larger financial impact.`;
    }


    /* -----------------------------------------
       WHO IS AFFECTED
       ----------------------------------------- */

    let affected =
        "";


    if (
        companiesFound.length > 0
    ) {

        affected =
            `The people most directly affected are investors and shareholders of ${companiesFound.slice(0, 4).join(", ")}. Employees, customers, suppliers and competitors may also be affected depending on how the development changes the company's business.`;

    } else if (
        category === "Stock Market"
    ) {

        affected =
            `The most directly affected are investors and shareholders. Companies mentioned in the news, their employees and competitors may also be affected depending on how the market reacts.`;

    } else if (
        category === "Economy"
    ) {

        affected =
            `The impact can reach investors, companies and consumers because economic conditions influence borrowing costs, spending, investment and business profitability.`;

    } else if (
        category === "Technology"
    ) {

        affected =
            `Technology companies, investors, employees, customers and competing companies are the main groups that could be affected.`;

    } else {

        affected =
            `Investors, companies, customers and other participants in the affected financial sector are the main groups that could be affected.`;
    }


    return {

        simple,
        industry: industryImpact,
        impact,
        affected

    };
}


/* =========================================================
   FETCH FEED
   ========================================================= */

async function fetchFeed(
    feed,
    region
) {

    try {

        const apiURL =
            RSS2JSON_API +
            encodeURIComponent(
                feed.url
            );


        const response =
            await fetch(
                apiURL
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Feed request failed"
            );
        }


        const data =
            await response.json();


        if (
            !data.items
        ) {

            return [];
        }


        return data.items.map(
            item => {

                const article = {

                    title:
                        cleanText(
                            item.title
                        ),

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
                        item.link ||
                        "#",

                    source:
                        feed.name,

                    region:
                        region,

                    pubDate:
                        item.pubDate ||
                        ""
                };


                article.category =
                    detectCategory(
                        article
                    );


                article.industry =
                    detectIndustry(
                        article
                    );


                article.sentiment =
                    detectSentiment(
                        article
                    );


                article.companies =
                    detectCompanies(
                        article
                    );


                article.analysis =
                    generateAnalysis(
                        article
                    );


                return article;

            }
        );


    } catch (error) {

        console.error(
            "Error loading:",
            feed.name,
            error
        );


        return [];
    }
}


/* =========================================================
   LOAD NEWS
   ========================================================= */

async function loadNews() {

    showLoading();


    try {

        const indiaPromises =
            indiaFeeds.map(
                feed =>
                    fetchFeed(
                        feed,
                        "india"
                    )
            );


        const globalPromises =
            globalFeeds.map(
                feed =>
                    fetchFeed(
                        feed,
                        "global"
                    )
            );


        const results =
            await Promise.all(
                [
                    ...indiaPromises,
                    ...globalPromises
                ]
            );


        let news =
            results.flat();


        /* -----------------------------------------
           ONLY FINANCIAL NEWS
           ----------------------------------------- */

        news =
            news.filter(
                article =>
                    isFinancialNews(
                        article
                    )
            );


        /* -----------------------------------------
           REMOVE DUPLICATES
           ----------------------------------------- */

        const seen =
            new Set();


        news =
            news.filter(
                article => {

                    const key =
                        article.title
                            .toLowerCase()
                            .trim();


                    if (
                        seen.has(key)
                    ) {

                        return false;
                    }


                    seen.add(key);

                    return true;
                }
            );


        /* -----------------------------------------
           NEWEST FIRST
           ----------------------------------------- */

        news.sort(
            (a, b) => {

                return (
                    new Date(
                        b.pubDate
                    ) -
                    new Date(
                        a.pubDate
                    )
                );

            }
        );


        allNews =
            news;


        updateMarketCards();

        updateBreakdown();

        updateSectors();

        updateResults();

        renderNews();


        updateLastUpdated();


        console.log(
            `FINPULSE loaded ${allNews.length} financial stories.`
        );


    } catch (error) {

        console.error(
            "FINPULSE error:",
            error
        );


        showError();
    }
}


/* =========================================================
   MARKET SENTIMENT SCORE
   ========================================================= */

function calculateScore(
    articles
) {

    if (
        articles.length === 0
    ) {

        return 50;
    }


    let bullish = 0;

    let bearish = 0;


    articles.forEach(
        article => {

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

        }
    );


    const total =
        bullish +
        bearish;


    if (
        total === 0
    ) {

        return 50;
    }


    return Math.round(
        (
            bullish /
            total
        ) * 100
    );
}


/* =========================================================
   MARKET STATUS
   ========================================================= */

function getMarketStatus(
    score
) {

    if (
        score >= 65
    ) {

        return "bullish";
    }


    if (
        score <= 35
    ) {

        return "bearish";
    }


    return "neutral";
}


/* =========================================================
   UPDATE MARKET CARDS
   ========================================================= */

function updateMarketCards() {

    const indiaNews =
        allNews.filter(
            article =>
                article.region ===
                "india"
        );


    const globalNews =
        allNews.filter(
            article =>
                article.region ===
                "global"
        );


    updateSingleMarket(
        indiaNews,
        "india"
    );


    updateSingleMarket(
        globalNews,
        "global"
    );
}


/* =========================================================
   UPDATE ONE MARKET
   ========================================================= */

function updateSingleMarket(
    articles,
    market
) {

    const score =
        calculateScore(
            articles
        );


    const status =
        getMarketStatus(
            score
        );


    const pointer =
        document.getElementById(
            `${market}Pointer`
        );


    const scoreElement =
        document.getElementById(
            `${market}Score`
        );


    const statusElement =
        document.getElementById(
            `${market}Status`
        );


    const description =
        document.getElementById(
            `${market}Description`
        );


    /* -----------------------------------------
       POINTER
       ----------------------------------------- */

    if (
        pointer
    ) {

        pointer.style.left =
            `${score}%`;
    }


    /* -----------------------------------------
       SCORE
       ----------------------------------------- */

    if (
        scoreElement
    ) {

        scoreElement.textContent =
            score;
    }


    /* -----------------------------------------
       STATUS
       ----------------------------------------- */

    if (
        statusElement
    ) {

        statusElement.textContent =
            status.charAt(0).toUpperCase() +
            status.slice(1);


        statusElement.className =
            `status-badge ${status}`;
    }


    /* -----------------------------------------
       DESCRIPTION
       ----------------------------------------- */

    if (
        description
    ) {

        if (
            status ===
            "bullish"
        ) {

            description.textContent =
                "Financial news currently contains more positive signals than negative ones.";

        } else if (
            status ===
            "bearish"
        ) {

            description.textContent =
                "Financial news currently contains more negative signals than positive ones.";

        } else {

            description.textContent =
                "Positive and negative financial signals are relatively balanced.";
        }
    }


    /* -----------------------------------------
       MINI STATS
       ----------------------------------------- */

    const bullish =
        articles.filter(
            article =>
                article.sentiment ===
                "bullish"
        ).length;


    const neutral =
        articles.filter(
            article =>
                article.sentiment ===
                "neutral"
        ).length;


    const bearish =
        articles.filter(
            article =>
                article.sentiment ===
                "bearish"
        ).length;


    const bullishElement =
        document.getElementById(
            `${market}Bullish`
        );


    const neutralElement =
        document.getElementById(
            `${market}Neutral`
        );


    const bearishElement =
        document.getElementById(
            `${market}Bearish`
        );


    if (
        bullishElement
    ) {

        bullishElement.textContent =
            bullish;
    }


    if (
        neutralElement
    ) {

        neutralElement.textContent =
            neutral;
    }


    if (
        bearishElement
    ) {

        bearishElement.textContent =
            bearish;
    }
}


/* =========================================================
   NEWS BREAKDOWN
   ========================================================= */

function updateBreakdown() {

    const total =
        allNews.length;


    if (
        total === 0
    ) {

        setText(
            "bullishPercent",
            "0%"
        );

        setText(
            "neutralPercent",
            "0%"
        );

        setText(
            "bearishPercent",
            "0%"
        );

        setWidth(
            "bullishBar",
            0
        );

        setWidth(
            "neutralBar",
            0
        );

        setWidth(
            "bearishBar",
            0
        );

        return;
    }


    const bullish =
        allNews.filter(
            article =>
                article.sentiment ===
                "bullish"
        ).length;


    const neutral =
        allNews.filter(
            article =>
                article.sentiment ===
                "neutral"
        ).length;


    const bearish =
        allNews.filter(
            article =>
                article.sentiment ===
                "bearish"
        ).length;


    const bullishPercent =
        Math.round(
            bullish / total * 100
        );


    const neutralPercent =
        Math.round(
            neutral / total * 100
        );


    const bearishPercent =
        Math.round(
            bearish / total * 100
        );


    setText(
        "bullishPercent",
        `${bullishPercent}%`
    );


    setText(
        "neutralPercent",
        `${neutralPercent}%`
    );


    setText(
        "bearishPercent",
        `${bearishPercent}%`
    );


    setWidth(
        "bullishBar",
        bullishPercent
    );


    setWidth(
        "neutralBar",
        neutralPercent
    );


    setWidth(
        "bearishBar",
        bearishPercent
    );
}


/* =========================================================
   SECTOR TRACKER
   ========================================================= */

function updateSectors() {

    const sectorList =
        document.getElementById(
            "sectorList"
        );


    if (
        !sectorList
    ) {

        return;
    }


    const sectors = {};


    allNews.forEach(
        article => {

            const sector =
                article.industry ||
                "Financial Markets";


            if (
                !sectors[sector]
            ) {

                sectors[sector] =
                    0;
            }


            sectors[sector]++;
        }
    );


    const sorted =
        Object.entries(
            sectors
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(
            0,
            6
        );


    if (
        sorted.length === 0
    ) {

        sectorList.innerHTML = `

            <p style="color:var(--muted);font-size:12px;">
                No sector information available.
            </p>

        `;

        return;
    }


    const max =
        sorted[0][1];


    sectorList.innerHTML = "";


    sorted.forEach(
        ([sector, count]) => {

            const percentage =
                Math.round(
                    count / max * 100
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
                        ${escapeHTML(sector)}
                    </span>

                    <span class="sector-count">
                        ${count} ${count === 1 ? "story" : "stories"}
                    </span>

                </div>

                <div class="sector-bar">

                    <div
                        class="sector-bar-fill"
                        style="width:${percentage}%">
                    </div>

                </div>

            `;


            sectorList.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function getFilteredNews() {

    return allNews.filter(
        article => {

            /* REGION */

            if (
                currentRegion !==
                "all" &&
                article.region !==
                currentRegion
            ) {

                return false;
            }


            /* SENTIMENT */

            if (
                currentSentiment !==
                "all" &&
                article.sentiment !==
                currentSentiment
            ) {

                return false;
            }


            /* SEARCH */

            if (
                searchQuery
            ) {

                const text = (

                    article.title +
                    " " +
                    article.description +
                    " " +
                    article.industry +
                    " " +
                    article.category +
                    " " +
                    article.companies.join(" ")

                ).toLowerCase();


                if (
                    !text.includes(
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


    if (
        !container
    ) {

        return;
    }


    const news =
        getFilteredNews();


    container.innerHTML = "";


    updateResults(
        news.length
    );


    if (
        news.length === 0
    ) {

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

            const card =
                createNewsCard(
                    article,
                    index
                );


            container.appendChild(
                card
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
        article.companies.length > 0
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
                href="${escapeHTML(article.link)}"
                class="read-link"
                target="_blank"
                rel="noopener noreferrer">

                Read full article →

            </a>


            <button
                class="explain-btn"
                type="button">

                Explain this news

            </button>

        </div>


        <div class="news-analysis">

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


            <div class="analysis-item">

                <strong>
                    Specific companies detected
                </strong>

                <span>
                    ${escapeHTML(companiesText)}
                </span>

            </div>

        </div>

    `;


    const button =
        card.querySelector(
            ".explain-btn"
        );


    const analysis =
        card.querySelector(
            ".news-analysis"
        );


    button.addEventListener(
        "click",
        () => {

            analysis.classList.toggle(
                "show"
            );


            if (
                analysis.classList.contains(
                    "show"
                )
            ) {

                button.textContent =
                    "Hide explanation";

            } else {

                button.textContent =
                    "Explain this news";
            }
        }
    );


    return card;
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;
}


/* =========================================================
   SHORTEN
   ========================================================= */

function shorten(
    text,
    maxLength
) {

    if (
        !text
    ) {

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
   RESULTS COUNT
   ========================================================= */

function updateResults(
    count
) {

    const element =
        document.getElementById(
            "resultsCount"
        );


    if (
        !element
    ) {

        return;
    }


    element.textContent =
        `${count} financial ${
            count === 1
                ? "story"
                : "stories"
        }`;
}


/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {

    const container =
        document.getElementById(
            "newsContainer"
        );


    if (
        !container
    ) {

        return;
    }


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


    if (
        !container
    ) {

        return;
    }


    container.innerHTML = `

        <div class="empty-state">

            <h3>
                Unable to load financial news
            </h3>

            <p>
                The news feeds could not be reached.
                Please refresh the page and try again.
            </p>

        </div>

    `;
}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.textContent =
            value;
    }
}


/* =========================================================
   SET WIDTH
   ========================================================= */

function setWidth(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.style.width =
            `${value}%`;
    }
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (
        !input
    ) {

        return;
    }


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
   REGION FILTERS
   ========================================================= */

function setupRegionFilters() {

    const buttons =
        document.querySelectorAll(
            "[data-region]"
        );


    buttons.forEach(
        button => {

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

        }
    );
}


/* =========================================================
   SENTIMENT FILTERS
   ========================================================= */

function setupSentimentFilters() {

    const buttons =
        document.querySelectorAll(
            "[data-sentiment]"
        );


    buttons.forEach(
        button => {

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
                        button.dataset.sentiment
                            .toLowerCase();


                    renderNews();

                }
            );

        }
    );
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function setupThemeToggle() {

    const button =
        document.getElementById(
            "themeToggle"
        );


    if (
        !button
    ) {

        return;
    }


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
                    ? "🌙"
                    : "☀️";
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
            "🌙";

    } else {

        button.textContent =
            "☀️";
    }
}


/* =========================================================
   CURRENT DATE
   ========================================================= */

function updateDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (
        !element
    ) {

        return;
    }


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


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    elements.forEach(
        element => {

            element.textContent =
                `Updated ${time} • Based on latest financial news`;

        }
    );
}


/* =========================================================
   START FINPULSE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "FinPulse V2 started."
        );


        setupSearch();

        setupRegionFilters();

        setupSentimentFilters();

        setupThemeToggle();

        updateDate();

        loadNews();


        /*
           Refresh every 15 minutes.
        */

        setInterval(
            () => {

                loadNews();

            },
            15 * 60 * 1000
        );

    }
);
