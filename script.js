/* =========================================================
   FINPULSE V2
   Financial News Intelligence Dashboard
   ========================================================= */


/* =========================================================
   RSS API
========================================================= */

const RSS2JSON_API =
    "https://api.rss2json.com/v1/api.json?rss_url=";


/* =========================================================
   RSS FEEDS
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
        url: "https://www.business-standard.com/rss/home_page_top_stories.rss"
    }
];


const globalFeeds = [
    {
        name: "Reuters",
        url: "https://feeds.reuters.com/reuters/businessNews"
    },

    {
        name: "CNBC",
        url: "https://www.cnbc.com/id/10001147/device/rss/rss.html"
    },

    {
        name: "MarketWatch",
        url: "https://feeds.marketwatch.com/marketwatch/topstories/"
    }
];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allNews = [];

let currentMarket =
    "all";

let currentIndustry =
    "all";

let currentSentiment =
    "all";

let searchTerm =
    "";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const newsContainer =
    document.getElementById("newsContainer");

const resultsInfo =
    document.getElementById("resultsInfo");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const sentimentButtons =
    document.querySelectorAll(".sentiment-filter");

const themeButton =
    document.getElementById("themeToggle");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        loadNews();

        setupSearch();

        setupFilters();

        setupTheme();

    }
);


/* =========================================================
   LOAD NEWS
========================================================= */

async function loadNews() {

    showLoading();

    try {

        const indiaNews =
            await fetchFeeds(indiaFeeds, "India");

        const globalNews =
            await fetchFeeds(globalFeeds, "Global");

        allNews = [
            ...indiaNews,
            ...globalNews
        ];

        allNews =
            removeDuplicates(allNews);

        allNews =
            allNews.map(
                news => {

                    return {
                        ...news,

                        sentiment:
                            detectSentiment(
                                news.title +
                                " " +
                                news.description
                            ),

                        industry:
                            detectIndustry(
                                news.title +
                                " " +
                                news.description
                            ),

                        market:
                            detectMarket(
                                news.title +
                                " " +
                                news.description
                            ),

                        analysis:
                            generateNewsAnalysis(news)

                    };

                }
            );

        updateDashboard();

        renderNews();

    }

    catch (error) {

        console.error(
            "News loading error:",
            error
        );

        showError();

    }

}


/* =========================================================
   FETCH RSS FEEDS
========================================================= */

async function fetchFeeds(
    feeds,
    market
) {

    const results = [];

    for (
        const feed of feeds
    ) {

        try {

            const response =
                await fetch(
                    RSS2JSON_API +
                    encodeURIComponent(
                        feed.url
                    )
                );

            if (
                !response.ok
            ) {
                continue;
            }

            const data =
                await response.json();

            if (
                !data.items
            ) {
                continue;
            }

            data.items.forEach(
                item => {

                    results.push({

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

                        link:
                            item.link,

                        source:
                            feed.name,

                        market:
                            market,

                        date:
                            item.pubDate,

                        timestamp:
                            new Date(
                                item.pubDate
                            ).getTime()

                    });

                }
            );

        }

        catch (error) {

            console.warn(
                `Could not load ${feed.name}`,
                error
            );

        }

    }

    return results;

}


/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(text) {

    if (!text) {
        return "";
    }

    const temporary =
        document.createElement(
            "div"
        );

    temporary.innerHTML =
        text;

    return temporary.textContent
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   REMOVE DUPLICATES
========================================================= */

function removeDuplicates(news) {

    const seen =
        new Set();

    return news.filter(
        item => {

            const key =
                item.title
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]/g,
                        ""
                    );

            if (
                seen.has(key)
            ) {
                return false;
            }

            seen.add(key);

            return true;

        }
    );

}


/* =========================================================
   SENTIMENT DETECTION
========================================================= */

function detectSentiment(text) {

    const content =
        text.toLowerCase();


    const bullishWords = [

        "surge",
        "surges",
        "rally",
        "rallies",
        "gain",
        "gains",
        "growth",
        "profit",
        "profits",
        "record",
        "strong",
        "positive",
        "boost",
        "rise",
        "rises",
        "raised",
        "upgrade",
        "upbeat",
        "expansion",
        "recovery",
        "increase",
        "increased",
        "approval",
        "approved",
        "investment",
        "deal",
        "partnership",
        "acquisition"

    ];


    const bearishWords = [

        "fall",
        "falls",
        "fell",
        "drop",
        "drops",
        "decline",
        "declines",
        "loss",
        "losses",
        "weak",
        "negative",
        "crisis",
        "risk",
        "risks",
        "downgrade",
        "cut",
        "cuts",
        "slump",
        "slumps",
        "debt",
        "fraud",
        "penalty",
        "lawsuit",
        "warning",
        "shutdown",
        "delay",
        "delayed",
        "concern"

    ];


    let bullishScore =
        0;

    let bearishScore =
        0;


    bullishWords.forEach(
        word => {

            if (
                content.includes(
                    word
                )
            ) {

                bullishScore++;

            }

        }
    );


    bearishWords.forEach(
        word => {

            if (
                content.includes(
                    word
                )
            ) {

                bearishScore++;

            }

        }
    );


    if (
        bullishScore >
        bearishScore
    ) {

        return "bullish";

    }


    if (
        bearishScore >
        bullishScore
    ) {

        return "bearish";

    }


    return "neutral";

}


/* =========================================================
   INDUSTRY DETECTION
========================================================= */

function detectIndustry(text) {

    const content =
        text.toLowerCase();


    const industries = {

        "Banking & Finance": [
            "bank",
            "banking",
            "loan",
            "credit",
            "nbfc",
            "rbi",
            "interest rate",
            "financial"
        ],

        "Technology": [
            "technology",
            "software",
            "it services",
            "artificial intelligence",
            "ai",
            "cloud",
            "semiconductor",
            "chip"
        ],

        "Automobile": [
            "automobile",
            "automotive",
            "car",
            "vehicle",
            "ev",
            "electric vehicle",
            "two-wheeler",
            "truck"
        ],

        "Pharmaceuticals": [
            "pharma",
            "pharmaceutical",
            "drug",
            "medicine",
            "healthcare",
            "fda"
        ],

        "Energy": [
            "oil",
            "gas",
            "energy",
            "solar",
            "renewable",
            "power",
            "electricity"
        ],

        "FMCG": [
            "fmcg",
            "consumer goods",
            "food",
            "beverage",
            "personal care",
            "household"
        ],

        "Telecom": [
            "telecom",
            "5g",
            "mobile network",
            "jio",
            "airtel",
            "vodafone"
        ],

        "Real Estate": [
            "real estate",
            "property",
            "housing",
            "residential",
            "commercial property"
        ],

        "Metals & Mining": [
            "steel",
            "aluminium",
            "metal",
            "mining",
            "iron ore",
            "copper"
        ],

        "Retail": [
            "retail",
            "e-commerce",
            "shopping",
            "consumer spending"
        ]

    };


    let bestIndustry =
        "General Market";

    let bestScore =
        0;


    for (
        const industry in industries
    ) {

        let score =
            0;

        industries[industry]
            .forEach(
                keyword => {

                    if (
                        content.includes(
                            keyword
                        )
                    ) {

                        score++;

                    }

                }
            );


        if (
            score >
            bestScore
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
   MARKET DETECTION
========================================================= */

function detectMarket(text) {

    const content =
        text.toLowerCase();


    const indiaKeywords = [

        "india",
        "indian",
        "nifty",
        "sensex",
        "bse",
        "nse",
        "rbi",
        "sebi",
        "rupee",
        "₹",
        "inr",
        "mumbai",
        "delhi"

    ];


    let indiaScore =
        0;


    indiaKeywords.forEach(
        keyword => {

            if (
                content.includes(
                    keyword
                )
            ) {

                indiaScore++;

            }

        }
    );


    if (
        indiaScore > 0
    ) {

        return "India";

    }


    return "Global";

}


/* =========================================================
   GENERATE NEWS-SPECIFIC ANALYSIS
========================================================= */

function generateNewsAnalysis(news) {

    const text =
        (
            news.title +
            " " +
            news.description
        ).toLowerCase();


    const company =
        extractCompany(
            news.title +
            " " +
            news.description
        );


    const industry =
        news.industry ||
        detectIndustry(text);


    const sentiment =
        news.sentiment ||
        detectSentiment(text);


    const impact =
        determineImpact(
            text,
            sentiment
        );


    const timing =
        determineTiming(
            text
        );


    const affected =
        determineAffectedParties(
            text,
            industry
        );


    const simple =
        simplifyNews(
            news,
            company,
            industry,
            sentiment
        );


    return {

        simple:
            simple,

        company:
            company,

        industry:
            industry,

        impact:
            impact,

        timing:
            timing,

        affected:
            affected

    };

}


/* =========================================================
   COMPANY / STOCK EXTRACTION
========================================================= */

function extractCompany(text) {

    const knownCompanies = [

        "Reliance Industries",
        "Tata Motors",
        "Tata Consultancy Services",
        "TCS",
        "Infosys",
        "HDFC Bank",
        "ICICI Bank",
        "State Bank of India",
        "SBI",
        "Axis Bank",
        "ITC",
        "Hindustan Unilever",
        "HUL",
        "Nestle India",
        "Dixon Technologies",
        "Bharti Airtel",
        "Airtel",
        "Adani Enterprises",
        "Adani Ports",
        "Larsen & Toubro",
        "L&T",
        "Maruti Suzuki",
        "Mahindra & Mahindra",
        "M&M",
        "Sun Pharma",
        "Dr Reddy's Laboratories",
        "Wipro",
        "HCLTech",
        "Bajaj Finance",
        "Asian Paints",
        "Titan",
        "Zomato",
        "Eternal",
        "Nykaa",
        "Tesla",
        "Apple",
        "Microsoft",
        "Amazon",
        "Nvidia",
        "Alphabet",
        "Meta",
        "Samsung",
        "Toyota"

    ];


    const found =
        knownCompanies.find(
            company =>
                text.toLowerCase()
                    .includes(
                        company.toLowerCase()
                    )
        );


    if (
        found
    ) {

        return found;

    }


    return "The companies directly mentioned in this news";

}


/* =========================================================
   SIMPLIFY NEWS
========================================================= */

function simplifyNews(
    news,
    company,
    industry,
    sentiment
) {

    const title =
        news.title;


    let direction =
        "neutral";


    if (
        sentiment === "bullish"
    ) {

        direction =
            "positive";

    }

    else if (
        sentiment === "bearish"
    ) {

        direction =
            "negative";

    }


    if (
        company !==
        "The companies directly mentioned in this news"
    ) {

        return `${title}. In simple terms, this news is mainly about ${company}. The development is currently showing a ${direction} signal and may affect the company's business, earnings, valuation or investor expectations depending on how significant the development becomes.`;

    }


    return `${title}. In simple terms, the news describes a ${direction} development related to the ${industry} sector. Its importance depends on whether the development changes company earnings, costs, demand, regulation or investor expectations.`;

}


/* =========================================================
   IMPACT DETECTION
========================================================= */

function determineImpact(
    text,
    sentiment
) {

    const impacts = [];


    if (
        text.includes("profit") ||
        text.includes("earnings") ||
        text.includes("revenue")
    ) {

        impacts.push(
            "company earnings"
        );

    }


    if (
        text.includes("investment") ||
        text.includes("expansion") ||
        text.includes("capacity")
    ) {

        impacts.push(
            "business expansion and future growth"
        );

    }


    if (
        text.includes("interest rate") ||
        text.includes("rbi") ||
        text.includes("inflation")
    ) {

        impacts.push(
            "borrowing costs and demand"
        );

    }


    if (
        text.includes("regulation") ||
        text.includes("sebi") ||
        text.includes("government") ||
        text.includes("policy")
    ) {

        impacts.push(
            "regulatory conditions"
        );

    }


    if (
        text.includes("oil") ||
        text.includes("crude") ||
        text.includes("commodity")
    ) {

        impacts.push(
            "input costs and margins"
        );

    }


    if (
        impacts.length ===
        0
    ) {

        if (
            sentiment === "bullish"
        ) {

            impacts.push(
                "investor expectations and potential business growth"
            );

        }

        else if (
            sentiment === "bearish"
        ) {

            impacts.push(
                "investor confidence, costs or business performance"
            );

        }

        else {

            impacts.push(
                "investor expectations and business outlook"
            );

        }

    }


    const current =
        sentiment === "bullish"
            ? "The immediate impact is likely to be positive if investors see the development as beneficial."
            : sentiment === "bearish"
                ? "The immediate impact could be negative if the development increases risk, costs or uncertainty."
                : "The immediate market impact may remain limited until more information becomes available.";


    const future =
        "The longer-term impact will depend on whether the development actually changes earnings, demand, costs, regulation or future growth.";


    return `${current} It is particularly relevant to ${impacts.join(", ")}. ${future}`;

}


/* =========================================================
   TIMING
========================================================= */

function determineTiming(text) {

    if (
        text.includes("today") ||
        text.includes("surge") ||
        text.includes("falls") ||
        text.includes("rises") ||
        text.includes("shares")
    ) {

        return "Investors can react immediately because the information is already public. The share price may reflect expectations before the company's actual financial results change.";

    }


    if (
        text.includes("quarter") ||
        text.includes("earnings") ||
        text.includes("results")
    ) {

        return "The effect may become clearer when the company reports its next quarterly results.";

    }


    if (
        text.includes("investment") ||
        text.includes("factory") ||
        text.includes("expansion") ||
        text.includes("capacity")
    ) {

        return "The market may react now based on expectations, while the actual business impact may take several months or years as the investment or expansion takes place.";

    }


    if (
        text.includes("policy") ||
        text.includes("government") ||
        text.includes("regulation")
    ) {

        return "The immediate reaction depends on investor expectations. The actual business impact becomes clearer once the policy or regulation is implemented.";

    }


    return "The market can react once investors interpret the information, while the actual business impact may take time to appear in sales, costs or earnings.";

}


/* =========================================================
   AFFECTED PARTIES
========================================================= */

function determineAffectedParties(
    text,
    industry
) {

    const affected = [];


    if (
        text.includes("investor") ||
        text.includes("shares") ||
        text.includes("stock") ||
        text.includes("market")
    ) {

        affected.push(
            "investors and shareholders"
        );

    }


    if (
        text.includes("customer") ||
        text.includes("consumer") ||
        text.includes("demand")
    ) {

        affected.push(
            "customers or consumers"
        );

    }


    if (
        text.includes("employee") ||
        text.includes("hiring") ||
        text.includes("jobs")
    ) {

        affected.push(
            "employees and job seekers"
        );

    }


    if (
        text.includes("supplier") ||
        text.includes("raw material")
    ) {

        affected.push(
            "suppliers"
        );

    }


    if (
        text.includes("government") ||
        text.includes("tax") ||
        text.includes("regulation")
    ) {

        affected.push(
            "government and regulators"
        );

    }


    if (
        affected.length ===
        0
    ) {

        affected.push(
            "companies, investors and other participants in the " +
            industry.toLowerCase() +
            " industry"
        );

    }


    return affected.join(
        ", "
    ) + ".";

}


/* =========================================================
   RENDER NEWS
========================================================= */

function renderNews() {

    if (
        !newsContainer
    ) {
        return;
    }


    let filteredNews =
        [...allNews];


    /* MARKET FILTER */

    if (
        currentMarket !==
        "all"
    ) {

        filteredNews =
            filteredNews.filter(
                news =>
                    news.market ===
                    currentMarket
            );

    }


    /* INDUSTRY FILTER */

    if (
        currentIndustry !==
        "all"
    ) {

        filteredNews =
            filteredNews.filter(
                news =>
                    news.industry ===
                    currentIndustry
            );

    }


    /* SENTIMENT FILTER */

    if (
        currentSentiment !==
        "all"
    ) {

        filteredNews =
            filteredNews.filter(
                news =>
                    news.sentiment ===
                    currentSentiment
            );

    }


    /* SEARCH */

    if (
        searchTerm
    ) {

        filteredNews =
            filteredNews.filter(
                news => {

                    const combined =
                        (
                            news.title +
                            " " +
                            news.description +
                            " " +
                            news.industry
                        ).toLowerCase();


                    return combined.includes(
                        searchTerm
                    );

                }
            );

    }


    /* SORT BY DATE */

    filteredNews.sort(
        (a, b) =>
            b.timestamp -
            a.timestamp
    );


    /* RESULTS */

    if (
        resultsInfo
    ) {

        resultsInfo.textContent =
            `${filteredNews.length} news stories found`;

    }


    /* EMPTY STATE */

    if (
        filteredNews.length ===
        0
    ) {

        newsContainer.innerHTML = `

            <div class="empty-state">

                <h3>No news found</h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

        return;

    }


    /* LIMIT */

    const displayNews =
        filteredNews.slice(
            0,
            50
        );


    newsContainer.innerHTML =
        displayNews
            .map(
                createNewsCard
            )
            .join("");

}


/* =========================================================
   CREATE NEWS CARD
========================================================= */

function createNewsCard(
    news,
    index
) {

    const sentimentClass =
        news.sentiment;


    const sentimentText =
        news.sentiment === "bullish"
            ? "BULLISH"
            : news.sentiment === "bearish"
                ? "BEARISH"
                : "NEUTRAL";


    const formattedDate =
        formatDate(
            news.date
        );


    const analysis =
        news.analysis;


    return `

        <article
            class="news-card"
            data-index="${index}"
        >

            <div class="news-top">

                <div class="news-meta">

                    <span class="news-source">
                        ${escapeHTML(news.source)}
                    </span>

                    <span class="news-industry">
                        ${escapeHTML(news.industry)}
                    </span>

                </div>


                <span
                    class="sentiment-label ${sentimentClass}"
                >
                    ${sentimentText}
                </span>

            </div>


            <h3>
                ${escapeHTML(news.title)}
            </h3>


            <p class="news-description">

                ${escapeHTML(
                    shortenDescription(
                        news.description
                    )
                )}

            </p>


            <div class="news-bottom">

                <a
                    class="read-link"
                    href="${news.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Read full article →
                </a>


                <button
                    class="explain-btn"
                    onclick="toggleAnalysis(${index})"
                >
                    Understand this news
                </button>

            </div>


            <div
                class="news-analysis"
                id="analysis-${index}"
            >

                <div class="analysis-title">
                    🧠 Understand This News
                </div>


                <div class="analysis-item">

                    <strong>
                        1. What is the news saying?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.simple
                        )}
                    </span>

                </div>


                <div class="analysis-item">

                    <strong>
                        2. Which company / stock is involved?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.company
                        )}
                    </span>

                </div>


                <div class="analysis-item">

                    <strong>
                        3. Which industry is affected?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.industry
                        )}
                    </span>

                </div>


                <div class="analysis-item">

                    <strong>
                        4. What is the current / future impact?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.impact
                        )}
                    </span>

                </div>


                <div class="analysis-item">

                    <strong>
                        5. When will the impact become visible?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.timing
                        )}
                    </span>

                </div>


                <div class="analysis-item">

                    <strong>
                        6. Who is affected?
                    </strong>

                    <span>
                        ${escapeHTML(
                            analysis.affected
                        )}
                    </span>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   TOGGLE NEWS ANALYSIS
========================================================= */

function toggleAnalysis(
    index
) {

    const analysis =
        document.getElementById(
            `analysis-${index}`
        );


    if (
        !analysis
    ) {
        return;
    }


    const button =
        analysis
            .closest(".news-card")
            ?.querySelector(
                ".explain-btn"
            );


    const isOpen =
        analysis.classList.contains(
            "show"
        );


    /* Close */

    if (
        isOpen
    ) {

        analysis.classList.remove(
            "show"
        );

        if (
            button
        ) {

            button.textContent =
                "Understand this news";

        }

        return;

    }


    /* Open */

    analysis.classList.add(
        "show"
    );


    if (
        button
    ) {

        button.textContent =
            "Hide explanation";

    }

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (
        !searchInput
    ) {
        return;
    }


    searchInput.addEventListener(
        "input",
        event => {

            searchTerm =
                event.target.value
                    .trim()
                    .toLowerCase();


            renderNews();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {


    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    currentMarket =
                        button.dataset.market ||
                        button.dataset.filter ||
                        "all";


                    renderNews();

                }
            );

        }
    );


    sentimentButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    sentimentButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    currentSentiment =
                        button.dataset.sentiment ||
                        "all";


                    renderNews();

                }
            );

        }
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    updateMarketGauge(
        "india",
        "India"
    );

    updateMarketGauge(
        "global",
        "Global"
    );

    updateSentimentBreakdown();

    updateSectorBreakdown();

    updateDate();

}


/* =========================================================
   MARKET GAUGE
========================================================= */

function updateMarketGauge(
    type,
    market
) {

    const news =
        allNews.filter(
            item =>
                item.market ===
                market
        );


    if (
        news.length ===
        0
    ) {
        return;
    }


    let bullish =
        0;

    let bearish =
        0;

    let neutral =
        0;


    news.forEach(
        item => {

            if (
                item.sentiment ===
                "bullish"
            ) {

                bullish++;

            }

            else if (
                item.sentiment ===
                "bearish"
            ) {

                bearish++;

            }

            else {

                neutral++;

            }

        }
    );


    const total =
        bullish +
        bearish +
        neutral;


    /* Sentiment score from 0 to 100 */

    const score =
        total === 0
            ? 50
            : Math.round(
                (
                    (
                        bullish +
                        neutral * 0.5
                    ) /
                    total
                ) * 100
            );


    const pointer =
        document.getElementById(
            `${type}GaugePointer`
        );


    const scoreElement =
        document.getElementById(
            `${type}Score`
        );


    const statusElement =
        document.getElementById(
            `${type}Status`
        );


    if (
        pointer
    ) {

        pointer.style.left =
            `${score}%`;

    }


    if (
        scoreElement
    ) {

        scoreElement.textContent =
            score;

    }


    if (
        statusElement
    ) {

        statusElement.classList.remove(
            "bullish",
            "bearish",
            "neutral"
        );


        if (
            score >= 60
        ) {

            statusElement.textContent =
                "BULLISH";

            statusElement.classList.add(
                "bullish"
            );

        }

        else if (
            score <= 40
        ) {

            statusElement.textContent =
                "BEARISH";

            statusElement.classList.add(
                "bearish"
            );

        }

        else {

            statusElement.textContent =
                "NEUTRAL";

            statusElement.classList.add(
                "neutral"
            );

        }

    }


    const description =
        document.getElementById(
            `${type}Description`
        );


    if (
        description
    ) {

        if (
            score >= 60
        ) {

            description.textContent =
                `News sentiment is currently leaning positive, with more bullish stories than bearish ones.`;

        }

        else if (
            score <= 40
        ) {

            description.textContent =
                `News sentiment is currently leaning negative, with more bearish stories than bullish ones.`;

        }

        else {

            description.textContent =
                `News sentiment is relatively balanced, with no strong bullish or bearish direction.`;

        }

    }


    updateMiniStats(
        type,
        bullish,
        neutral,
        bearish
    );

}


/* =========================================================
   MINI STATS
========================================================= */

function updateMiniStats(
    type,
    bullish,
    neutral,
    bearish
) {

    const bullishElement =
        document.getElementById(
            `${type}Bullish`
        );

    const neutralElement =
        document.getElementById(
            `${type}Neutral`
        );

    const bearishElement =
        document.getElementById(
            `${type}Bearish`
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
   SENTIMENT BREAKDOWN
========================================================= */

function updateSentimentBreakdown() {

    const total =
        allNews.length;


    if (
        total === 0
    ) {
        return;
    }


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


    setProgress(
        "bullishProgress",
        bullish /
        total *
        100
    );


    setProgress(
        "neutralProgress",
        neutral /
        total *
        100
    );


    setProgress(
        "bearishProgress",
        bearish /
        total *
        100
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
   SECTOR BREAKDOWN
========================================================= */

function updateSectorBreakdown() {

    const sectorCounts =
        {};


    allNews.forEach(
        news => {

            const sector =
                news.industry;

            sectorCounts[sector] =
                (
                    sectorCounts[sector] ||
                    0
                ) + 1;

        }
    );


    const sorted =
        Object.entries(
            sectorCounts
        )
            .sort(
                (a, b) =>
                    b[1] -
                    a[1]
            )
            .slice(
                0,
                8
            );


    const container =
        document.getElementById(
            "sectorList"
        );


    if (
        !container
    ) {
        return;
    }


    const max =
        sorted.length
            ? sorted[0][1]
            : 1;


    container.innerHTML =
        sorted
            .map(
                ([sector, count]) => `

                    <div class="sector-row">

                        <div class="sector-top">

                            <span class="sector-name">
                                ${escapeHTML(sector)}
                            </span>

                            <span class="sector-count">
                                ${count} stories
                            </span>

                        </div>


                        <div class="sector-bar">

                            <div
                                class="sector-bar-fill"
                                style="width:${(
                                    count /
                                    max *
                                    100
                                )}%"
                            ></div>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   UPDATE DATE
========================================================= */

function updateDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );


    if (
        !dateElement
    ) {
        return;
    }


    const now =
        new Date();


    dateElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );

}


/* =========================================================
   THEME
========================================================= */

function setupTheme() {

    if (
        !themeButton
    ) {
        return;
    }


    themeButton.addEventListener(
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
                "finpulse-theme",
                isLight
                    ? "light"
                    : "dark"
            );


            themeButton.textContent =
                isLight
                    ? "☀️"
                    : "🌙";

        }
    );

}


/* =========================================================
   INITIALIZE THEME
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "finpulse-theme"
        );


    if (
        savedTheme ===
        "light"
    ) {

        document.body.classList.add(
            "light-mode"
        );


        if (
            themeButton
        ) {

            themeButton.textContent =
                "☀️";

        }

    }

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    if (
        !newsContainer
    ) {
        return;
    }


    newsContainer.innerHTML = `

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

    if (
        !newsContainer
    ) {
        return;
    }


    newsContainer.innerHTML = `

        <div class="empty-state">

            <h3>
                Unable to load news
            </h3>

            <p>
                Please check your internet
                connection and try again.
            </p>

        </div>

    `;

}


/* =========================================================
   HELPER: PROGRESS
========================================================= */

function setProgress(
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
            `${Math.min(
                100,
                Math.max(
                    0,
                    value
                )
            )}%`;

    }

}


/* =========================================================
   HELPER: TEXT
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
   FORMAT DATE
========================================================= */

function formatDate(
    date
) {

    if (
        !date
    ) {

        return "";

    }


    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.toLocaleString(
        "en-IN",
        {
            day:
                "numeric",

            month:
                "short",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


/* =========================================================
   SHORTEN DESCRIPTION
========================================================= */

function shortenDescription(
    text
) {

    if (
        !text
    ) {

        return "No additional description available.";

    }


    if (
        text.length <= 350
    ) {

        return text;

    }


    return (
        text.substring(
            0,
            350
        ) +
        "..."
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    text
) {

    if (
        text === undefined ||
        text === null
    ) {

        return "";

    }


    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   REFRESH NEWS
========================================================= */

function refreshNews() {

    loadNews();

}


/* =========================================================
   AUTO REFRESH
========================================================= */

setInterval(
    () => {

        loadNews();

    },
    15 * 60 * 1000
);


/* =========================================================
   END OF FINPULSE
========================================================= */
