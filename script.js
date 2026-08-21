/* ==========================================
   FINPULSE V2
   Financial News Intelligence Dashboard
========================================== */


/* ==========================================
   RSS API
========================================== */

const RSS2JSON_API =
    "https://api.rss2json.com/v1/api.json?rss_url=";



/* ==========================================
   RSS FEEDS
========================================== */

const indiaFeeds = [

    "https://economictimes.indiatimes.com/rssfeedsdefault.cms",

    "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms"

];


const globalFeeds = [

    "https://finance.yahoo.com/news/rssindex",

    "https://www.cnbc.com/id/100003114/device/rss/rss.html"

];



/* ==========================================
   GLOBAL NEWS ARRAY
========================================== */

let allNews = [];



/* ==========================================
   FILTER STATE
========================================== */

let selectedRegion = "all";

let selectedSentiment = "all";

let searchTerm = "";



/* ==========================================
   SENTIMENT KEYWORDS
========================================== */

const positiveWords = [

    "growth",
    "profit",
    "surge",
    "increase",
    "rise",
    "gain",
    "record",
    "boost",
    "strong",
    "positive",
    "recovery",
    "expansion",
    "investment",
    "approval",
    "improve",
    "improvement",
    "success",
    "higher",
    "upbeat"

];


const negativeWords = [

    "loss",
    "fall",
    "decline",
    "drop",
    "crisis",
    "weak",
    "risk",
    "debt",
    "inflation",
    "layoff",
    "slowdown",
    "warning",
    "concern",
    "lower",
    "downgrade",
    "weakness",
    "deficit",
    "uncertainty",
    "cut"

];



/* ==========================================
   INDUSTRY KEYWORDS
========================================== */

const industryKeywords = {

    "Banking & Finance": [

        "bank",
        "banking",
        "loan",
        "credit",
        "interest rate",
        "rbi",
        "finance",
        "nbfc",
        "lending"

    ],


    "Technology": [

        "technology",
        "software",
        "ai",
        "artificial intelligence",
        "semiconductor",
        "chip",
        "it services",
        "cloud",
        "digital"

    ],


    "Automobile": [

        "car",
        "automobile",
        "vehicle",
        "ev",
        "electric vehicle",
        "auto",
        "motor",
        "suv"

    ],


    "Energy": [

        "oil",
        "gas",
        "energy",
        "petrol",
        "diesel",
        "renewable",
        "solar",
        "crude"

    ],


    "Pharmaceuticals": [

        "pharma",
        "drug",
        "medicine",
        "healthcare",
        "hospital",
        "biotech"

    ],


    "Consumer Goods": [

        "consumer",
        "fmcg",
        "food",
        "retail",
        "beverage",
        "product",
        "sales"

    ],


    "Real Estate": [

        "real estate",
        "property",
        "housing",
        "construction",
        "home"

    ],


    "Telecommunications": [

        "telecom",
        "5g",
        "mobile network",
        "jio",
        "airtel",
        "internet"

    ]

};



/* ==========================================
   FETCH NEWS
========================================== */

async function fetchNews(feedURL) {

    try {

        const response = await fetch(
            RSS2JSON_API +
            encodeURIComponent(feedURL)
        );


        const data = await response.json();


        return data.items || [];

    }

    catch (error) {

        console.error(
            "News fetch error:",
            error
        );

        return [];

    }

}



/* ==========================================
   SENTIMENT
========================================== */

function analyzeSentiment(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


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

        return "Bullish";

    }


    if (negative > positive) {

        return "Bearish";

    }


    return "Neutral";

}



/* ==========================================
   INDUSTRY DETECTION
========================================== */

function detectIndustry(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    let industries = [];


    for (
        const industry in industryKeywords
    ) {

        const keywords =
            industryKeywords[industry];


        const found =
            keywords.some(keyword =>
                text.includes(keyword)
            );


        if (found) {

            industries.push(industry);

        }

    }


    if (industries.length === 0) {

        return "General Market";

    }


    return industries
        .slice(0, 2)
        .join(" & ");

}



/* ==========================================
   SIMPLE NEWS EXPLANATION
========================================== */

function simplifyNews(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    if (
        text.includes("interest rate") ||
        text.includes("rbi") ||
        text.includes("rate cut")
    ) {

        return `
        The news is related to interest rates or
        monetary policy. In simple terms, changes
        in interest rates affect how expensive it is
        for people and businesses to borrow money.
        `;

    }


    if (
        text.includes("profit") ||
        text.includes("earnings") ||
        text.includes("revenue")
    ) {

        return `
        The company has reported a change in its
        financial performance. In simple terms,
        investors are checking whether the company
        is making more or less money than before.
        `;

    }


    if (
        text.includes("oil") ||
        text.includes("crude")
    ) {

        return `
        The news is related to oil prices. In simple
        terms, changes in oil prices can affect
        transportation, manufacturing and the cost
        of many everyday products.
        `;

    }


    if (
        text.includes("inflation")
    ) {

        return `
        The news is about inflation, which means
        prices of goods and services are changing.
        Higher inflation can make everyday products
        more expensive and reduce purchasing power.
        `;

    }


    if (
        text.includes("stock") ||
        text.includes("shares") ||
        text.includes("market")
    ) {

        return `
        The news is related to the stock market or
        a company's shares. Investors may change
        their buying or selling decisions depending
        on whether they think the news is positive
        or negative.
        `;

    }


    return `
    This news describes a recent development that
    could affect a company, industry or the wider
    economy. Investors and businesses may need to
    monitor how this development changes future
    business conditions.
    `;

}



/* ==========================================
   IMPACT ANALYSIS
========================================== */

function determineImpact(
    title,
    description,
    sentiment
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    if (
        text.includes("profit") ||
        text.includes("growth") ||
        text.includes("surge") ||
        text.includes("expansion") ||
        text.includes("investment")
    ) {

        return `
        The current impact is generally positive.
        The development may support business growth,
        investor confidence or company earnings.
        If the trend continues, the effect could
        remain positive in the future.
        `;

    }


    if (
        text.includes("loss") ||
        text.includes("decline") ||
        text.includes("fall") ||
        text.includes("crisis") ||
        text.includes("layoff")
    ) {

        return `
        The current impact may be negative because
        the development can put pressure on company
        performance, employment or investor confidence.
        If it continues, the effect could become more
        significant in the future.
        `;

    }


    if (
        text.includes("government") ||
        text.includes("policy") ||
        text.includes("tax") ||
        text.includes("regulation")
    ) {

        return `
        The immediate impact depends on how businesses
        respond to the policy or regulatory change.
        In the future, companies may need to adjust
        their costs, operations or investment decisions.
        `;

    }


    return `
    The impact is still developing. Investors and
    businesses will need to monitor whether this event
    creates changes in demand, costs, profits or
    overall market sentiment.
    `;

}



/* ==========================================
   AFFECTED STAKEHOLDERS
========================================== */

function identifyAffected(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    let affected = [];


    if (
        text.includes("stock") ||
        text.includes("shares") ||
        text.includes("investor") ||
        text.includes("market")
    ) {

        affected.push(
            "Investors"
        );

    }


    if (
        text.includes("company") ||
        text.includes("corporate") ||
        text.includes("business")
    ) {

        affected.push(
            "Companies"
        );

    }


    if (
        text.includes("consumer") ||
        text.includes("price") ||
        text.includes("inflation")
    ) {

        affected.push(
            "Consumers"
        );

    }


    if (
        text.includes("government") ||
        text.includes("policy") ||
        text.includes("tax")
    ) {

        affected.push(
            "Government"
        );

    }


    if (
        text.includes("employee") ||
        text.includes("job") ||
        text.includes("layoff")
    ) {

        affected.push(
            "Employees"
        );

    }


    if (
        affected.length === 0
    ) {

        affected.push(
            "Businesses and investors"
        );

    }


    return affected.join(", ");

}



/* ==========================================
   CREATE NEWS ANALYSIS
========================================== */

function createNewsAnalysis(
    article
) {

    const title =
        article.title || "";


    const description =
        article.description || "";


    const explanation =
        simplifyNews(
            title,
            description
        );


    const industry =
        detectIndustry(
            title,
            description
        );


    const sentiment =
        analyzeSentiment(
            title,
            description
        );


    const impact =
        determineImpact(
            title,
            description,
            sentiment
        );


    const affected =
        identifyAffected(
            title,
            description
        );


    return `

        <div class="news-analysis">

            <div class="analysis-title">
                🧠 NEWS SIMPLIFIED
            </div>


            <div class="analysis-item">

                <strong>
                    💡 What is this news saying?
                </strong>

                <span>
                    ${explanation}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    🏭 Which industry is affected?
                </strong>

                <span>
                    ${industry}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    📈 What is the impact?
                </strong>

                <span>
                    ${impact}
                </span>

            </div>


            <div class="analysis-item">

                <strong>
                    👥 Who is affected?
                </strong>

                <span>
                    ${affected}
                </span>

            </div>

        </div>

    `;

}



/* ==========================================
   CREATE NEWS CARD
========================================== */

function createNewsCard(
    article,
    index
) {

    const sentiment =
        analyzeSentiment(
            article.title || "",
            article.description || ""
        );


    const industry =
        detectIndustry(
            article.title || "",
            article.description || ""
        );


    const source =
        article.author ||
        "Financial News";


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "news-card";


    card.dataset.index =
        index;


    card.innerHTML = `

        <div class="news-top">

            <div class="news-meta">

                <span class="news-source">
                    ${source}
                </span>

                <span class="news-industry">
                    ${industry}
                </span>

            </div>


            <span class="sentiment-label ${sentiment.toLowerCase()}">
                ${sentiment}
            </span>

        </div>


        <h3>
            ${article.title}
        </h3>


        <p class="news-description">
            ${article.description ||
              "No description available."}
        </p>


        <div class="news-bottom">

            <a
                class="read-link"
                href="${article.link}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read Full News →
            </a>


            <button
                class="explain-btn"
                onclick="toggleAnalysis(${index})"
            >
                ▼ Understand this news
            </button>

        </div>


        ${createNewsAnalysis(article)}

    `;


    return card;

}



/* ==========================================
   DISPLAY NEWS
========================================== */

function displayNews(
    news
) {

    const container =
        document.getElementById(
            "newsContainer"
        );


    container.innerHTML = "";


    if (
        news.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No news found
                </h3>

                <p>
                    Try changing your search
                    or filters.
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


    document.getElementById(
        "resultsCount"
    ).textContent =
        `${news.length} articles displayed`;

}



/* ==========================================
   TOGGLE NEWS EXPLANATION
========================================== */

function toggleAnalysis(
    index
) {

    const cards =
        document.querySelectorAll(
            ".news-card"
        );


    const card =
        cards[index];


    if (!card) return;


    const analysis =
        card.querySelector(
            ".news-analysis"
        );


    const button =
        card.querySelector(
            ".explain-btn"
        );


    analysis.classList.toggle(
        "show"
    );


    if (
        analysis.classList.contains(
            "show"
        )
    ) {

        button.textContent =
            "▲ Hide explanation";

    }

    else {

        button.textContent =
            "▼ Understand this news";

    }

}



/* ==========================================
   FILTER NEWS
========================================== */

function filterNews() {

    const filtered =
        allNews.filter(article => {


            const title =
                article.title ||
                "";


            const description =
                article.description ||
                "";


            const text =
                `${title} ${description}`
                .toLowerCase();


            const sentiment =
                analyzeSentiment(
                    title,
                    description
                );


            const regionMatch =

                selectedRegion === "all" ||

                article.region ===
                    selectedRegion;


            const sentimentMatch =

                selectedSentiment === "all" ||

                sentiment ===
                    selectedSentiment;


            const searchMatch =

                searchTerm === "" ||

                text.includes(
                    searchTerm
                );


            return (
                regionMatch &&
                sentimentMatch &&
                searchMatch
            );

        });


    displayNews(
        filtered
    );

}



/* ==========================================
   CALCULATE SENTIMENT
========================================== */

function calculateSentiment(
    news
) {

    let bullish = 0;

    let neutral = 0;

    let bearish = 0;


    news.forEach(article => {

        const sentiment =
            analyzeSentiment(
                article.title || "",
                article.description || ""
            );


        if (
            sentiment === "Bullish"
        ) {

            bullish++;

        }

        else if (
            sentiment === "Bearish"
        ) {

            bearish++;

        }

        else {

            neutral++;

        }

    });


    const total =
        bullish +
        neutral +
        bearish;


    if (total === 0) {

        return {
            score: 50,
            bullish: 0,
            neutral: 0,
            bearish: 0
        };

    }


    /*
       Convert sentiment into 0-100.

       100 = strongly bullish
       50  = neutral
       0   = strongly bearish
    */

    const rawScore =
        (
            (bullish - bearish) /
            total
        ) * 50 + 50;


    return {

        score:
            Math.round(
                Math.max(
                    0,
                    Math.min(
                        100,
                        rawScore
                    )
                )
            ),

        bullish,

        neutral,

        bearish

    };

}



/* ==========================================
   GET MARKET STATUS
========================================== */

function getMarketStatus(
    score
) {

    if (score >= 65) {

        return "Bullish";

    }


    if (score <= 35) {

        return "Bearish";

    }


    return "Neutral";

}



/* ==========================================
   UPDATE MARKET GAUGE
========================================== */

function updateMarketGauge(
    type,
    news
) {

    const sentiment =
        calculateSentiment(
            news
        );


    const score =
        sentiment.score;


    const status =
        getMarketStatus(
            score
        );


    /*
       Score already ranges from 0-100,
       so it directly represents the
       pointer position.
    */

    const pointer =
        document.getElementById(
            `${type}Pointer`
        );


    pointer.style.left =
        `${score}%`;


    document.getElementById(
        `${type}Score`
    ).textContent =
        score;


    const statusElement =
        document.getElementById(
            `${type}Status`
        );


    statusElement.textContent =
        status;


    statusElement.className =
        `status-badge ${status.toLowerCase()}`;


    document.getElementById(
        `${type}Bullish`
    ).textContent =
        sentiment.bullish;


    document.getElementById(
        `${type}Neutral`
    ).textContent =
        sentiment.neutral;


    document.getElementById(
        `${type}Bearish`
    ).textContent =
        sentiment.bearish;


    const description =
        document.getElementById(
            `${type}Description`
        );


    if (status === "Bullish") {

        description.textContent =
            "Most analyzed news is currently positive, indicating a relatively optimistic market mood.";

    }

    else if (status === "Bearish") {

        description.textContent =
            "Negative news currently outweighs positive news, indicating a cautious market mood.";

    }

    else {

        description.textContent =
            "Positive and negative news are relatively balanced, indicating a mixed market mood.";

    }

}



/* ==========================================
   NEWS BREAKDOWN
========================================== */

function updateNewsBreakdown() {

    const sentiment =
        calculateSentiment(
            allNews
        );


    const total =
        sentiment.bullish +
        sentiment.neutral +
        sentiment.bearish;


    if (total === 0) return;


    const bullishPercent =
        Math.round(
            sentiment.bullish /
            total *
            100
        );


    const neutralPercent =
        Math.round(
            sentiment.neutral /
            total *
            100
        );


    const bearishPercent =
        100 -
        bullishPercent -
        neutralPercent;


    document.getElementById(
        "bullishPercent"
    ).textContent =
        `${bullishPercent}%`;


    document.getElementById(
        "neutralPercent"
    ).textContent =
        `${neutralPercent}%`;


    document.getElementById(
        "bearishPercent"
    ).textContent =
        `${bearishPercent}%`;


    document.getElementById(
        "bullishBar"
    ).style.width =
        `${bullishPercent}%`;


    document.getElementById(
        "neutralBar"
    ).style.width =
        `${neutralPercent}%`;


    document.getElementById(
        "bearishBar"
    ).style.width =
        `${bearishPercent}%`;

}



/* ==========================================
   TRENDING SECTORS
========================================== */

function updateTrendingSectors() {

    const sectorCounts = {};


    allNews.forEach(article => {

        const industry =
            detectIndustry(
                article.title || "",
                article.description || ""
            );


        /*
           A news article may belong to
           two industries.
        */

        industry
            .split(" & ")
            .forEach(sector => {

                if (
                    !sectorCounts[sector]
                ) {

                    sectorCounts[sector] = 0;

                }


                sectorCounts[sector]++;

            });

    });


    const sectors =
        Object.entries(
            sectorCounts
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 5);


    const container =
        document.getElementById(
            "sectorList"
        );


    container.innerHTML = "";


    if (sectors.length === 0) {

        container.innerHTML =
            "<p>No sector data available.</p>";

        return;

    }


    const max =
        sectors[0][1];


    sectors.forEach(
        ([sector, count]) => {

            const percentage =
                Math.round(
                    count /
                    max *
                    100
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
                        ${count} articles
                    </span>

                </div>


                <div class="sector-bar">

                    <div
                        class="sector-bar-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            /*
               Clicking a sector searches
               for that industry.
            */

            row.addEventListener(
                "click",
                () => {

                    document.getElementById(
                        "searchInput"
                    ).value =
                        sector;

                    searchTerm =
                        sector.toLowerCase();

                    filterNews();

                    window.scrollTo({

                        top:
                            document.querySelector(
                                ".news-section"
                            ).offsetTop - 80,

                        behavior:
                            "smooth"

                    });

                }
            );


            container.appendChild(
                row
            );

        }
    );

}



/* ==========================================
   LOAD INDIA NEWS
========================================== */

async function loadIndiaNews() {

    let news = [];


    for (
        const feed of indiaFeeds
    ) {

        const data =
            await fetchNews(
                feed
            );


        news =
            news.concat(
                data
            );

    }


    news =
        news.map(
            article => ({

                ...article,

                region: "india"

            })
        );


    return news;

}



/* ==========================================
   LOAD GLOBAL NEWS
========================================== */

async function loadGlobalNews() {

    let news = [];


    for (
        const feed of globalFeeds
    ) {

        const data =
            await fetchNews(
                feed
            );


        news =
            news.concat(
                data
            );

    }


    news =
        news.map(
            article => ({

                ...article,

                region: "global"

            })
        );


    return news;

}



/* ==========================================
   LOAD EVERYTHING
========================================== */

async function loadDashboard() {

    try {

        const [
            indiaNews,
            globalNews
        ] = await Promise.all([

            loadIndiaNews(),

            loadGlobalNews()

        ]);


        /*
           Keep the latest articles.
        */

        allNews = [

            ...indiaNews.slice(0, 15),

            ...globalNews.slice(0, 15)

        ];


        /*
           Market gauges
        */

        updateMarketGauge(
            "india",
            indiaNews
        );


        updateMarketGauge(
            "global",
            globalNews
        );


        /*
           Dashboard sections
        */

        updateNewsBreakdown();

        updateTrendingSectors();


        /*
           Display all news
        */

        displayNews(
            allNews
        );

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById(
            "newsContainer"
        ).innerHTML = `

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

}



/* ==========================================
   REGION FILTER BUTTONS
========================================== */

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                selectedRegion =
                    button.dataset.region;


                filterNews();

            }
        );

    });



/* ==========================================
   SENTIMENT FILTER BUTTONS
========================================== */

document
    .querySelectorAll(
        ".sentiment-filter"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".sentiment-filter"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                selectedSentiment =
                    button.dataset.sentiment;


                filterNews();

            }
        );

    });



/* ==========================================
   SEARCH
========================================== */

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        event => {

            searchTerm =
                event.target.value
                    .toLowerCase()
                    .trim();


            filterNews();

        }
    );



/* ==========================================
   DARK / LIGHT MODE
========================================== */

document
    .getElementById(
        "themeToggle"
    )
    .addEventListener(
        "click",
        () => {

            document.body
                .classList.toggle(
                    "light-mode"
                );


            const isLight =
                document.body
                    .classList.contains(
                        "light-mode"
                    );


            document.getElementById(
                "themeToggle"
            ).textContent =
                isLight
                    ? "🌙"
                    : "☀️";

        }
    );



/* ==========================================
   CURRENT DATE
========================================== */

const dateElement =
    document.getElementById(
        "currentDate"
    );


const today =
    new Date();


dateElement.textContent =
    today.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );



/* ==========================================
   START APPLICATION
========================================== */

loadDashboard();
