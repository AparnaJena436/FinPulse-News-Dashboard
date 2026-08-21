const RSS2JSON_API = "https://api.rss2json.com/v1/api.json?rss_url=";


/* -----------------------------------
   RSS FEEDS
----------------------------------- */

const indiaFeeds = [
    "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
    "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms"
];

const globalFeeds = [
    "https://finance.yahoo.com/news/rssindex",
    "https://www.cnbc.com/id/100003114/device/rss/rss.html"
];


/* -----------------------------------
   POSITIVE / NEGATIVE KEYWORDS
----------------------------------- */

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
    "expansion"
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
    "warning"
];


/* -----------------------------------
   INDUSTRY KEYWORDS
----------------------------------- */

const industryKeywords = {

    "Banking & Finance": [
        "bank",
        "banking",
        "loan",
        "credit",
        "interest rate",
        "rbi",
        "finance",
        "nbfc"
    ],

    "Technology": [
        "technology",
        "software",
        "ai",
        "artificial intelligence",
        "semiconductor",
        "chip",
        "it services"
    ],

    "Automobile": [
        "car",
        "automobile",
        "vehicle",
        "ev",
        "electric vehicle",
        "auto",
        "motor"
    ],

    "Energy": [
        "oil",
        "gas",
        "energy",
        "petrol",
        "diesel",
        "renewable",
        "solar"
    ],

    "Pharmaceuticals": [
        "pharma",
        "drug",
        "medicine",
        "healthcare",
        "hospital"
    ],

    "Consumer Goods": [
        "consumer",
        "fmcg",
        "food",
        "retail",
        "beverage"
    ],

    "Real Estate": [
        "real estate",
        "property",
        "housing",
        "construction"
    ],

    "Telecommunications": [
        "telecom",
        "5g",
        "mobile network",
        "jio",
        "airtel"
    ]
};


/* -----------------------------------
   FETCH NEWS
----------------------------------- */

async function fetchNews(feedURL) {

    try {

        const response = await fetch(
            RSS2JSON_API + encodeURIComponent(feedURL)
        );

        const data = await response.json();

        return data.items || [];

    } catch (error) {

        console.error("Error fetching news:", error);

        return [];

    }
}


/* -----------------------------------
   SENTIMENT ANALYSIS
----------------------------------- */

function analyzeSentiment(title, description) {

    const text = `${title} ${description}`.toLowerCase();

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


/* -----------------------------------
   INDUSTRY DETECTION
----------------------------------- */

function detectIndustry(title, description) {

    const text = `${title} ${description}`.toLowerCase();

    let industries = [];

    for (const industry in industryKeywords) {

        const keywords = industryKeywords[industry];

        const found = keywords.some(keyword =>
            text.includes(keyword)
        );

        if (found) {
            industries.push(industry);
        }
    }

    if (industries.length === 0) {
        return "General Market";
    }

    return industries.slice(0, 2).join(" & ");
}


/* -----------------------------------
   SIMPLE NEWS EXPLANATION
----------------------------------- */

function simplifyNews(title, description) {

    const text = `${title} ${description}`.toLowerCase();

    let explanation = "";

    if (
        text.includes("interest rate") ||
        text.includes("rbi") ||
        text.includes("rate cut")
    ) {

        explanation =
            "The news is related to interest rates or monetary policy. " +
            "In simple terms, changes in interest rates can affect how expensive " +
            "it is for people and businesses to borrow money.";

    }

    else if (
        text.includes("profit") ||
        text.includes("earnings") ||
        text.includes("revenue")
    ) {

        explanation =
            "The company has reported a change in its financial performance. " +
            "In simple terms, investors are looking at whether the company is " +
            "making more or less money than before.";

    }

    else if (
        text.includes("oil") ||
        text.includes("crude")
    ) {

        explanation =
            "The news is related to oil prices or the oil market. " +
            "In simple terms, changes in oil prices can affect transportation, " +
            "manufacturing and the cost of many everyday products.";

    }

    else if (
        text.includes("inflation")
    ) {

        explanation =
            "The news is about inflation, which means prices of goods and " +
            "services are changing. In simple terms, higher inflation can make " +
            "everyday products more expensive and reduce people's purchasing power.";

    }

    else if (
        text.includes("stock") ||
        text.includes("shares") ||
        text.includes("market")
    ) {

        explanation =
            "The news is related to the stock market or a company's shares. " +
            "In simple terms, investors may change their buying or selling decisions " +
            "depending on whether they think the news is good or bad for the company.";

    }

    else {

        explanation =
            "This news describes a recent development that could affect a company, " +
            "industry or the wider economy. In simple terms, investors and businesses " +
            "may need to watch how this development changes future business conditions.";

    }

    return explanation;
}


/* -----------------------------------
   IMPACT ANALYSIS
----------------------------------- */

function determineImpact(title, description, sentiment) {

    const text = `${title} ${description}`.toLowerCase();

    let impact = "";

    if (
        text.includes("profit") ||
        text.includes("growth") ||
        text.includes("surge") ||
        text.includes("expansion") ||
        text.includes("investment")
    ) {

        impact =
            "The current impact is generally positive because the development " +
            "may support business growth, investor confidence or company earnings. " +
            "If the trend continues, it could have a positive effect in the future.";

    }

    else if (
        text.includes("loss") ||
        text.includes("decline") ||
        text.includes("fall") ||
        text.includes("crisis") ||
        text.includes("layoff")
    ) {

        impact =
            "The current impact may be negative because the development can put " +
            "pressure on company performance, employment or investor confidence. " +
            "If it continues, the effect could become more significant in the future.";

    }

    else if (
        text.includes("regulation") ||
        text.includes("government") ||
        text.includes("policy") ||
        text.includes("tax")
    ) {

        impact =
            "The immediate impact depends on how businesses respond to the policy " +
            "change. In the future, companies may need to change their costs, " +
            "operations or investment decisions.";

    }

    else {

        impact =
            "The impact is still developing. Investors and businesses will need " +
            "to monitor whether this event creates changes in demand, costs, " +
            "profits or market sentiment.";

    }

    return impact;
}


/* -----------------------------------
   WHO IS AFFECTED?
----------------------------------- */

function identifyAffected(title, description) {

    const text = `${title} ${description}`.toLowerCase();

    let affected = [];

    if (
        text.includes("stock") ||
        text.includes("shares") ||
        text.includes("investor") ||
        text.includes("market")
    ) {

        affected.push("Investors");
    }

    if (
        text.includes("company") ||
        text.includes("corporate") ||
        text.includes("business")
    ) {

        affected.push("Companies");
    }

    if (
        text.includes("consumer") ||
        text.includes("price") ||
        text.includes("inflation")
    ) {

        affected.push("Consumers");
    }

    if (
        text.includes("government") ||
        text.includes("policy") ||
        text.includes("tax")
    ) {

        affected.push("Government");
    }

    if (affected.length === 0) {

        affected.push("Businesses and investors");

    }

    return affected.join(", ");
}


/* -----------------------------------
   CREATE NEWS ANALYSIS
----------------------------------- */

function createNewsAnalysis(article) {

    const title = article.title || "";
    const description = article.description || "";

    const simpleExplanation =
        simplifyNews(title, description);

    const industry =
        detectIndustry(title, description);

    const sentiment =
        analyzeSentiment(title, description);

    const impact =
        determineImpact(title, description, sentiment);

    const affected =
        identifyAffected(title, description);


    return `
        <div class="news-analysis">

            <h4>🧠 News Simplified</h4>

            <div class="analysis-item">

                <strong>💡 What is this news saying?</strong>

                <span>
                    ${simpleExplanation}
                </span>

            </div>


            <div class="analysis-item">

                <strong>🏭 Which industry is affected?</strong>

                <span>
                    ${industry}
                </span>

            </div>


            <div class="analysis-item">

                <strong>📈 What is the impact?</strong>

                <span>
                    ${impact}
                </span>

            </div>


            <div class="analysis-item">

                <strong>👥 Who is affected?</strong>

                <span>
                    ${affected}
                </span>

            </div>

        </div>
    `;
}


/* -----------------------------------
   DISPLAY NEWS
----------------------------------- */

function displayNews(news, containerID) {

    const container =
        document.getElementById(containerID);

    container.innerHTML = "";


    news.forEach(article => {

        const sentiment =
            analyzeSentiment(
                article.title || "",
                article.description || ""
            );


        const card =
            document.createElement("div");

        card.className = "news-card";


        card.innerHTML = `

            <span class="sentiment">
                ${sentiment}
            </span>

            <h3>
                ${article.title}
            </h3>

            <p>
                ${article.description || "No description available."}
            </p>

            <a
                href="${article.link}"
                target="_blank"
            >
                Read Full News →
            </a>

            ${createNewsAnalysis(article)}

        `;


        container.appendChild(card);

    });

}


/* -----------------------------------
   CALCULATE MARKET SENTIMENT
----------------------------------- */

function calculateMarketSentiment(news) {

    let bullish = 0;
    let bearish = 0;
    let neutral = 0;


    news.forEach(article => {

        const sentiment =
            analyzeSentiment(
                article.title || "",
                article.description || ""
            );


        if (sentiment === "Bullish") {
            bullish++;
        }

        else if (sentiment === "Bearish") {
            bearish++;
        }

        else {
            neutral++;
        }

    });


    const total =
        bullish + bearish + neutral;


    if (total === 0) {
        return 0;
    }


    return Math.round(
        ((bullish - bearish) / total) * 100
    );

}


/* -----------------------------------
   LOAD INDIA NEWS
----------------------------------- */

async function loadIndiaNews() {

    let allNews = [];


    for (const feed of indiaFeeds) {

        const news =
            await fetchNews(feed);

        allNews =
            allNews.concat(news);

    }


    displayNews(
        allNews.slice(0, 15),
        "indiaNews"
    );


    const sentiment =
        calculateMarketSentiment(allNews);


    document.getElementById(
        "indiaSentiment"
    ).innerHTML =
        `${sentiment}%`;
}


/* -----------------------------------
   LOAD GLOBAL NEWS
----------------------------------- */

async function loadGlobalNews() {

    let allNews = [];


    for (const feed of globalFeeds) {

        const news =
            await fetchNews(feed);

        allNews =
            allNews.concat(news);

    }


    displayNews(
        allNews.slice(0, 15),
        "globalNews"
    );


    const sentiment =
        calculateMarketSentiment(allNews);


    document.getElementById(
        "globalSentiment"
    ).innerHTML =
        `${sentiment}%`;
}


/* -----------------------------------
   START DASHBOARD
----------------------------------- */

loadIndiaNews();

loadGlobalNews();
