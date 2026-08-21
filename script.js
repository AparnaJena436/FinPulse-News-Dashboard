/* ==========================================
   FINPULSE V3
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
   COMPANY / STOCK DATABASE
========================================== */

const companyDatabase = {

    "dixon technologies": {
        name: "Dixon Technologies",
        ticker: "DIXON",
        industry: "Electronics Manufacturing"
    },

    "dixon": {
        name: "Dixon Technologies",
        ticker: "DIXON",
        industry: "Electronics Manufacturing"
    },

    "reliance industries": {
        name: "Reliance Industries",
        ticker: "RELIANCE",
        industry: "Energy, Telecom & Retail"
    },

    "reliance": {
        name: "Reliance Industries",
        ticker: "RELIANCE",
        industry: "Energy, Telecom & Retail"
    },

    "hdfc bank": {
        name: "HDFC Bank",
        ticker: "HDFCBANK",
        industry: "Banking & Finance"
    },

    "icici bank": {
        name: "ICICI Bank",
        ticker: "ICICIBANK",
        industry: "Banking & Finance"
    },

    "state bank of india": {
        name: "State Bank of India",
        ticker: "SBIN",
        industry: "Banking & Finance"
    },

    "sbi": {
        name: "State Bank of India",
        ticker: "SBIN",
        industry: "Banking & Finance"
    },

    "tata motors": {
        name: "Tata Motors",
        ticker: "TATAMOTORS",
        industry: "Automobile"
    },

    "tata consultancy services": {
        name: "Tata Consultancy Services",
        ticker: "TCS",
        industry: "Information Technology"
    },

    "tcs": {
        name: "Tata Consultancy Services",
        ticker: "TCS",
        industry: "Information Technology"
    },

    "infosys": {
        name: "Infosys",
        ticker: "INFY",
        industry: "Information Technology"
    },

    "wipro": {
        name: "Wipro",
        ticker: "WIPRO",
        industry: "Information Technology"
    },

    "sun pharma": {
        name: "Sun Pharmaceutical",
        ticker: "SUNPHARMA",
        industry: "Pharmaceuticals"
    },

    "bharti airtel": {
        name: "Bharti Airtel",
        ticker: "BHARTIARTL",
        industry: "Telecommunications"
    },

    "airtel": {
        name: "Bharti Airtel",
        ticker: "BHARTIARTL",
        industry: "Telecommunications"
    },

    "itc": {
        name: "ITC",
        ticker: "ITC",
        industry: "Consumer Goods"
    },

    "nestle india": {
        name: "Nestlé India",
        ticker: "NESTLEIND",
        industry: "Consumer Goods"
    }

};


/* ==========================================
   FIND COMPANY
========================================== */

function identifyCompany(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    for (
        const key in companyDatabase
    ) {

        if (
            text.includes(key)
        ) {

            return companyDatabase[key];

        }

    }


    return null;

}


/* ==========================================
   EVENT DETECTION
========================================== */

function detectNewsEvent(
    title,
    description
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    /* Earnings */

    if (

        text.includes("profit") ||

        text.includes("earnings") ||

        text.includes("quarterly results") ||

        text.includes("quarter results") ||

        text.includes("revenue")

    ) {

        return "earnings";

    }


    /* Investment */

    if (

        text.includes("investment") ||

        text.includes("invests") ||

        text.includes("invested") ||

        text.includes("capital expenditure") ||

        text.includes("capex")

    ) {

        return "investment";

    }


    /* Expansion */

    if (

        text.includes("expansion") ||

        text.includes("new facility") ||

        text.includes("new plant") ||

        text.includes("manufacturing plant") ||

        text.includes("capacity")

    ) {

        return "expansion";

    }


    /* Government approval */

    if (

        text.includes("government approval") ||

        text.includes("approved by government") ||

        text.includes("government approves") ||

        text.includes("approval")

    ) {

        return "government_approval";

    }


    /* Interest rates */

    if (

        text.includes("rbi") ||

        text.includes("repo rate") ||

        text.includes("interest rate") ||

        text.includes("rate cut") ||

        text.includes("rate hike")

    ) {

        return "interest_rate";

    }


    /* Stock movement */

    if (

        text.includes("shares rise") ||

        text.includes("shares jump") ||

        text.includes("stock rises") ||

        text.includes("stock jumps") ||

        text.includes("shares fall") ||

        text.includes("stock falls") ||

        text.includes("shares decline")

    ) {

        return "stock_movement";

    }


    /* Merger / acquisition */

    if (

        text.includes("acquisition") ||

        text.includes("acquire") ||

        text.includes("merger") ||

        text.includes("merges")

    ) {

        return "merger";

    }


    /* Dividend */

    if (

        text.includes("dividend") ||

        text.includes("dividend payout")

    ) {

        return "dividend";

    }


    /* Layoffs */

    if (

        text.includes("layoff") ||

        text.includes("layoffs") ||

        text.includes("job cuts") ||

        text.includes("workforce reduction")

    ) {

        return "layoffs";

    }


    /* Oil */

    if (

        text.includes("crude oil") ||

        text.includes("oil prices") ||

        text.includes("crude prices")

    ) {

        return "oil";

    }


    /* Inflation */

    if (

        text.includes("inflation") ||

        text.includes("cpi")

    ) {

        return "inflation";

    }


    return "general";

}


/* ==========================================
   SIMPLE, SPECIFIC NEWS EXPLANATION
========================================== */

function simplifyNews(
    title,
    description,
    company,
    event
) {

    const companyName =
        company
            ? company.name
            : "the company or market mentioned in the article";


    switch (event) {


        case "earnings":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    has reported a change in its financial
                    performance.

                    In simple terms, investors are looking at
                    whether the company is making more or less
                    money than before.

                    The importance of this news depends on how
                    the reported performance compares with
                    expectations.

                `;

            }


            return `

                The article is about a company's financial results.

                In simple terms, the company has reported how much
                it earned during the period, and investors are
                assessing whether its business performance is
                improving or weakening.

            `;


        case "investment":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is putting money into a new project, facility
                    or business activity.

                    In simple terms, the company is spending today
                    with the expectation of increasing its capacity,
                    revenue or business opportunities in the future.

                `;

            }


            return `

                The company mentioned in the article is making
                a new investment.

                In simple terms, it is spending money now in the
                expectation of creating additional business
                opportunities in the future.

            `;


        case "expansion":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is expanding its operations or production
                    capacity.

                    In simple terms, the company is preparing to
                    produce more, serve more customers or enter
                    a larger market.

                `;

            }


            return `

                The article describes an expansion of business
                or manufacturing capacity.

                This generally means the company is preparing
                to handle more production or demand.

            `;


        case "government_approval":

            if (company) {

                return `

                    The government has approved a decision or
                    project involving <strong>${companyName}</strong>.

                    In simple terms, this gives the company
                    permission or support to move forward with
                    the activity described in the article.

                `;

            }


            return `

                The government has approved a policy, project
                or business activity.

                The important point is that the decision can
                change what affected businesses are allowed
                or able to do.

            `;


        case "interest_rate":

            return `

                The article is about interest rates or RBI
                monetary policy.

                In simple terms, changes in interest rates
                influence how expensive it is for banks,
                businesses and consumers to borrow money.

                This can affect loans, spending, investment
                and company profits.

            `;


        case "stock_movement":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is experiencing a movement in its share price.

                    The important question is not only that
                    the stock moved, but <strong>why</strong>
                    investors are buying or selling it.

                    The article describes the event that may
                    be driving that movement.

                `;

            }


            return `

                The article is reporting a movement in a
                company's share price.

                This means investors are changing their buying
                or selling decisions in response to new information.

            `;


        case "merger":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is involved in a merger or acquisition.

                    In simple terms, the company is combining
                    with, buying or being bought by another business.

                    This can change the company's size, operations,
                    costs and future growth opportunities.

                `;

            }


            return `

                The article describes a merger or acquisition.

                In simple terms, two businesses are combining
                or one business is buying another.

            `;


        case "dividend":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is announcing or changing its dividend.

                    A dividend is money distributed by a company
                    to its shareholders from its profits.

                `;

            }


            return `

                The company is discussing a dividend, which means
                shareholders may receive a portion of the company's
                profits.

            `;


        case "layoffs":

            if (company) {

                return `

                    <strong>${companyName}</strong>
                    is reducing its workforce.

                    In simple terms, the company is cutting jobs,
                    usually to reduce costs or respond to weaker
                    business conditions.

                `;

            }


            return `

                The company mentioned in the article is reducing
                its workforce.

                This usually means it is trying to reduce costs
                or respond to changing business conditions.

            `;


        case "oil":

            return `

                The article is about crude oil or oil prices.

                In simple terms, changes in oil prices can
                increase or reduce costs for companies that
                use fuel, transportation or petroleum-based inputs.

            `;


        case "inflation":

            return `

                The article is about inflation, meaning the
                prices of goods and services are changing.

                Higher inflation can reduce consumers'
                purchasing power and increase costs for businesses.

            `;


        default:

            return `

                The article describes a recent development
                that could affect the company, industry or
                market mentioned.

                The key point is to understand what has changed
                and whether that change could affect future
                business performance, costs, demand or
                investor expectations.

            `;

    }

}


/* ==========================================
   SPECIFIC IMPACT ANALYSIS
========================================== */

function determineImpact(
    title,
    description,
    sentiment,
    company,
    event
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    const companyName =
        company
            ? company.name
            : "the company";


    /* Earnings */

    if (
        event === "earnings"
    ) {

        let direction =
            sentiment;


        if (

            text.includes("profit rises") ||

            text.includes("profit jumps") ||

            text.includes("profit grows") ||

            text.includes("profit increases") ||

            text.includes("revenue rises")

        ) {

            direction =
                "Bullish";

        }


        else if (

            text.includes("profit falls") ||

            text.includes("profit declines") ||

            text.includes("profit drops") ||

            text.includes("revenue falls") ||

            text.includes("loss")

        ) {

            direction =
                "Bearish";

        }


        if (
            direction === "Bullish"
        ) {

            return `

                <strong>Positive impact:</strong>

                The reported improvement suggests that
                ${companyName}'s business performance may be
                strengthening.

                Investors may react positively because stronger
                earnings can support expectations of future
                profitability.

                <br><br>

                <strong>Current impact:</strong>

                The share price may react as investors absorb
                the results.

                <br><br>

                <strong>Future impact:</strong>

                The longer-term effect depends on whether the
                improvement continues in the coming quarters.

            `;

        }


        if (
            direction === "Bearish"
        ) {

            return `

                <strong>Potentially negative impact:</strong>

                The weaker financial performance can reduce
                expectations about the company's future earnings.

                <br><br>

                <strong>Current impact:</strong>

                Investors may react by reassessing the company's
                valuation.

                <br><br>

                <strong>Future impact:</strong>

                The impact becomes more important if weaker
                earnings continue across future quarters.

            `;

        }


        return `

            <strong>Mixed / uncertain impact:</strong>

            The financial results contain information that
            investors will compare with previous performance
            and expectations.

            <br><br>

            <strong>Current impact:</strong>

            The share price may react as investors interpret
            the results.

            <br><br>

            <strong>Future impact:</strong>

            The direction will depend on whether the company's
            earnings improve or weaken in future periods.

        `;

    }


    /* Investment */

    if (
        event === "investment"
    ) {

        return `

            <strong>Potentially positive impact:</strong>

            ${companyName}'s investment could increase its
            capacity, create new business opportunities or
            support future revenue.

            <br><br>

            <strong>Current impact:</strong>

            Investors may react positively to the expected
            growth, although the actual financial benefit
            may not appear immediately.

            <br><br>

            <strong>Future impact:</strong>

            The larger impact will depend on whether the
            investment is successfully completed and generates
            additional revenue or profit.

        `;

    }


    /* Expansion */

    if (
        event === "expansion"
    ) {

        return `

            <strong>Potentially positive impact:</strong>

            The expansion could allow ${companyName} to
            produce more, serve additional customers or
            enter new markets.

            <br><br>

            <strong>Current impact:</strong>

            Investors may respond to the expectation of
            future growth.

            <br><br>

            <strong>Future impact:</strong>

            The actual benefit will depend on demand,
            execution costs and how quickly the additional
            capacity starts generating revenue.

        `;

    }


    /* Government approval */

    if (
        event === "government_approval"
    ) {

        if (
            sentiment === "Bullish"
        ) {

            return `

                <strong>Positive impact:</strong>

                The approval removes or reduces a barrier to
                the activity described in the article and
                gives ${companyName} greater ability to move forward.

                <br><br>

                <strong>Current impact:</strong>

                Investors may react immediately because the
                approval changes expectations about the company's
                future business.

                <br><br>

                <strong>Future impact:</strong>

                The actual financial benefit will depend on
                implementation, investment and the revenue
                generated from the approved project.

            `;

        }


        return `

            <strong>Impact:</strong>

            The government decision changes the business
            environment for ${companyName} or the industry involved.

            <br><br>

            <strong>Current impact:</strong>

            Investors and businesses may adjust their
            expectations based on the new decision.

            <br><br>

            <strong>Future impact:</strong>

            The longer-term effect depends on how the
            policy or approval is implemented.

        `;

    }


    /* Interest rate */

    if (
        event === "interest_rate"
    ) {

        return `

            <strong>Market impact:</strong>

            Interest-rate decisions can affect borrowing costs,
            loan demand and business investment.

            <br><br>

            <strong>Current impact:</strong>

            Banks, borrowers and investors can react quickly
            to an RBI rate decision.

            <br><br>

            <strong>Future impact:</strong>

            The effect becomes clearer through changes in
            lending, consumer spending, investment and
            company profitability.

        `;

    }


    /* Stock movement */

    if (
        event === "stock_movement"
    ) {

        const impactWord =

            sentiment === "Bullish"

                ? "Positive"

                : sentiment === "Bearish"

                    ? "Negative"

                    : "Mixed";


        return `

            <strong>${impactWord} impact:</strong>

            ${companyName}'s share price is responding
            to new information described in the article.

            <br><br>

            <strong>Current impact:</strong>

            Investors are already reacting through buying
            or selling pressure on the stock.

            <br><br>

            <strong>Future impact:</strong>

            Whether the movement continues depends on
            whether investors believe the underlying news
            will actually change the company's future
            earnings or business performance.

        `;

    }


    /* Merger */

    if (
        event === "merger"
    ) {

        return `

            <strong>Potential impact:</strong>

            The merger or acquisition could change the
            company's size, market position, costs and
            growth opportunities.

            <br><br>

            <strong>Current impact:</strong>

            Investors may react to the expected benefits
            and risks of the transaction.

            <br><br>

            <strong>Future impact:</strong>

            The real impact depends on whether the combined
            business achieves the expected cost savings,
            growth or synergies.

        `;

    }


    /* Dividend */

    if (
        event === "dividend"
    ) {

        return `

            <strong>Impact:</strong>

            A dividend announcement directly matters to
            shareholders because it changes the amount of
            cash they may receive.

            <br><br>

            <strong>Current impact:</strong>

            Investors may react to the dividend and what
            it signals about the company's financial position.

            <br><br>

            <strong>Future impact:</strong>

            Investors may watch whether the company can
            maintain similar payouts while continuing to
            invest for growth.

        `;

    }


    /* Layoffs */

    if (
        event === "layoffs"
    ) {

        return `

            <strong>Potentially negative impact:</strong>

            Job cuts may indicate that ${companyName} is
            trying to reduce costs or is facing weaker
            business conditions.

            <br><br>

            <strong>Current impact:</strong>

            Employees are directly affected and investors
            may reassess the company's near-term performance.

            <br><br>

            <strong>Future impact:</strong>

            Lower costs could improve profitability, but
            continued layoffs may also indicate weaker
            demand or business pressure.

        `;

    }


    /* Oil */

    if (
        event === "oil"
    ) {

        return `

            <strong>Industry impact:</strong>

            Changes in crude oil prices can affect companies
            that depend heavily on fuel or petroleum-based inputs.

            <br><br>

            <strong>Current impact:</strong>

            Fuel and input costs can change relatively quickly.

            <br><br>

            <strong>Future impact:</strong>

            If oil prices remain high or low for an extended
            period, company margins, inflation and consumer
            prices may also change.

        `;

    }


    /* Inflation */

    if (
        event === "inflation"
    ) {

        return `

            <strong>Economic impact:</strong>

            Higher inflation generally means consumers pay
            more for goods and services and businesses may
            face higher costs.

            <br><br>

            <strong>Current impact:</strong>

            Consumer purchasing power and business costs
            can be affected.

            <br><br>

            <strong>Future impact:</strong>

            Persistent inflation can influence interest rates,
            consumer demand and company profitability.

        `;

    }


    /* General */

    return `

        <strong>${sentiment} / Mixed impact:</strong>

        The article describes a development that could
        influence ${companyName} or the related industry.

        <br><br>

        <strong>Current impact:</strong>

        Investors and businesses may react as they assess
        what the development means for the company's
        performance.

        <br><br>

        <strong>Future impact:</strong>

        The longer-term effect will depend on whether
        this development changes revenue, costs, demand,
        investment or profitability.

    `;

}


/* ==========================================
   AFFECTED STAKEHOLDERS
========================================== */

function identifyAffected(
    title,
    description,
    company,
    industry,
    event
) {

    const text =
        `${title} ${description}`
        .toLowerCase();


    let affected = [];


    /* Company */

    if (
        company
    ) {

        affected.push(
            company.name
        );

    }


    /* Investors */

    if (

        text.includes("stock") ||

        text.includes("shares") ||

        text.includes("investor") ||

        text.includes("market") ||

        text.includes("profit") ||

        text.includes("earnings") ||

        text.includes("investment") ||

        event === "government_approval" ||

        event === "expansion"

    ) {

        affected.push(
            "Investors & shareholders"
        );

    }


    /* Consumers */

    if (

        text.includes("consumer") ||

        text.includes("price") ||

        text.includes("inflation") ||

        (
            industry &&
            industry.includes("Consumer")
        )

    ) {

        affected.push(
            "Consumers"
        );

    }


    /* Employees */

    if (

        text.includes("employee") ||

        text.includes("job") ||

        text.includes("layoff") ||

        event === "expansion"

    ) {

        affected.push(
            "Employees"
        );

    }


    /* Government */

    if (

        text.includes("government") ||

        text.includes("rbi") ||

        text.includes("policy") ||

        text.includes("tax") ||

        event === "government_approval"

    ) {

        affected.push(
            "Government / policymakers"
        );

    }


    /* Banks and borrowers */

    if (
        event === "interest_rate"
    ) {

        affected.push(
            "Banks & borrowers"
        );

    }


    /* Industry */

    if (

        industry &&

        industry !== "General Market"

    ) {

        affected.push(
            `${industry} industry`
        );

    }


    if (
        affected.length === 0
    ) {

        affected.push(
            "Businesses, investors and the wider market"
        );

    }


    return [
        ...new Set(
            affected
        )
    ].join(", ");

}


/* ==========================================
   IMPACT TIMING
========================================== */

function getImpactTiming(
    event
) {

    const immediateEvents = [

        "stock_movement",

        "government_approval",

        "interest_rate",

        "earnings",

        "dividend"

    ];


    if (
        immediateEvents.includes(event)
    ) {

        return `

            <strong>⏱️ When does it matter?</strong>

            The market can react immediately to this news.

            The larger business impact may take several weeks,
            months or quarters to become visible.

        `;

    }


    if (

        event === "investment" ||

        event === "expansion" ||

        event === "merger"

    ) {

        return `

            <strong>⏱️ When does it matter?</strong>

            Investors may react immediately to the announcement,
            but the actual business benefit usually appears later
            as the project or transaction is implemented.

        `;

    }


    return `

        <strong>⏱️ When does it matter?</strong>

        The market may react immediately, while the actual
        business impact will become clearer as the situation develops.

    `;

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


    /* Identify company */

    const company =
        identifyCompany(
            title,
            description
        );


    /* Identify event */

    const event =
        detectNewsEvent(
            title,
            description
        );


    /* Identify industry */

    const industry =
        company

            ? company.industry

            : detectIndustry(
                title,
                description
            );


    /* Identify sentiment */

    const sentiment =
        analyzeSentiment(
            title,
            description
        );


    /* Create explanation */

    const explanation =
        simplifyNews(
            title,
            description,
            company,
            event
        );


    /* Create impact */

    const impact =
        determineImpact(
            title,
            description,
            sentiment,
            company,
            event
        );


    /* Identify affected groups */

    const affected =
        identifyAffected(
            title,
            description,
            company,
            industry,
            event
        );


    /* Identify timing */

    const timing =
        getImpactTiming(
            event
        );


    /* Company display */

    const companyHTML =

        company

            ? `

                <div class="analysis-item">

                    <strong>
                        🏢 Company / Stock involved
                    </strong>

                    <span>

                        ${company.name}

                        <small>
                            (${company.ticker})
                        </small>

                    </span>

                </div>

            `

            : `

                <div class="analysis-item">

                    <strong>
                        🏢 Company / Stock involved
                    </strong>

                    <span>
                        No specific listed company identified
                    </span>

                </div>

            `;


    return `

        <div class="news-analysis">


            <div class="analysis-title">

                🧠 NEWS EXPLAINED

            </div>


            <!-- SIMPLE EXPLANATION -->

            <div class="analysis-item">

                <strong>
                    💡 What is this news saying?
                </strong>

                <span>
                    ${explanation}
                </span>

            </div>


            <!-- COMPANY -->

            ${companyHTML}


            <!-- INDUSTRY -->

            <div class="analysis-item">

                <strong>
                    🏭 Which industry is affected?
                </strong>

                <span>
                    ${industry}
                </span>

            </div>


            <!-- IMPACT -->

            <div class="analysis-item">

                <strong>
                    📈 What is the impact?
                </strong>

                <span>
                    ${impact}
                </span>

            </div>


            <!-- TIMING -->

            <div class="analysis-item">

                <span>
                    ${timing}
                </span>

            </div>


            <!-- AFFECTED PEOPLE -->

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


            <span
                class="sentiment-label ${sentiment.toLowerCase()}"
            >
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

                🧠 Explain this news

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


    if (
        !card
    ) return;


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
            "🧠 Explain this news";

    }

}


/* ==========================================
   FILTER NEWS
========================================== */

function filterNews() {

    const filtered =
        allNews.filter(
            article => {


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

            }
        );


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


    news.forEach(
        article => {


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

        }
    );


    const total =
        bullish +
        neutral +
        bearish;


    if (
        total === 0
    ) {

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

    if (
        score >= 65
    ) {

        return "Bullish";

    }


    if (
        score <= 35
    ) {

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
       Score ranges from 0-100.

       0   = Bearish
       50  = Neutral
       100 = Bullish
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


    if (
        status === "Bullish"
    ) {

        description.textContent =

            "Most analyzed news is currently positive, indicating a relatively optimistic market mood.";

    }

    else if (
        status === "Bearish"
    ) {

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


    if (
        total === 0
    ) return;


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


    allNews.forEach(
        article => {


            const industry =
                detectIndustry(
                    article.title || "",
                    article.description || ""
                );


            /*
               A news article may belong
               to two industries.
            */

            industry
                .split(" & ")
                .forEach(
                    sector => {


                        if (
                            !sectorCounts[sector]
                        ) {

                            sectorCounts[sector] = 0;

                        }


                        sectorCounts[sector]++;

                    }
                );

        }
    );


    const sectors =

        Object.entries(
            sectorCounts
        )

        .sort(
            (a, b) =>
                b[1] - a[1]
        )

        .slice(
            0,
            5
        );


    const container =
        document.getElementById(
            "sectorList"
        );


    container.innerHTML = "";


    if (
        sectors.length === 0
    ) {

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
           Keep latest articles.
        */

        allNews = [

            ...indiaNews.slice(
                0,
                15
            ),

            ...globalNews.slice(
                0,
                15
            )

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
    .forEach(
        button => {


            button.addEventListener(
                "click",
                () => {


                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(
                            btn =>
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

        }
    );


/* ==========================================
   SENTIMENT FILTER BUTTONS
========================================== */

document
    .querySelectorAll(
        ".sentiment-filter"
    )
    .forEach(
        button => {


            button.addEventListener(
                "click",
                () => {


                    document
                        .querySelectorAll(
                            ".sentiment-filter"
                        )
                        .forEach(
                            btn =>
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

        }
    );


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
