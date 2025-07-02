const additionalTechnicalQuestions = [
  {
    question: "13 ACCOUNTING QUESTIONS Financial Statements & Accrual Concepts What is the primary purpose of US GAAP?",
    category: "Accounting" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are the main sections of a 10-K?",
    category: "Accounting" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between the 10-K and 10-Q?",
    category: "Accounting" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "16 ACCOUNTING QUESTIONS What are the typical line items you might find on the balance sheet?",
    category: "Accounting" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "45 VALUATION QUESTIONS Corporate Finance Theory Could you explain the concept of present value and how it relates to company valuations?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is equity value and how is it calculated?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "46 VALUATION QUESTIONS Which line items are included in the calculation of net debt?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Net Debt = Total Debt – Cash & Equivalents When calculating enterprise value, why do we add net debt?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between enterprise value and equity value?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Could a company have a negative net debt balance and have an enterprise value lower than its equity value?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Can the enterprise value of a company turn negative?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "How are convertible bonds and preferred equity with a convertible feature accounted for when calculating enterprise value?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are the two main approaches to valuation?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are the most common valuation methods used in finance?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "48 VALUATION QUESTIONS Among the DCF, comparable companies analysis, and transaction comps, which approach yields the highest valuation?",
    category: "Valuation" as const,
    difficulty: "Hard" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Which of the valuation methodologies is the most variable in terms of output?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "How can you determine which valuation method to use?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Would you agree with the statement that relative valuation relies less on the discretionary assumptions of individuals?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What does free cash flow (FCF) represent?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "73 MERGERS & ACQUISTIONS QUESTIONS M&A Concepts Can you define M&A and explain the difference between a merger and an acquisition?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are some potential reasons that a company might acquire another company?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Value Creation from Revenue and Cost Synergies Ownership of Technology Assets (IP, Patents, Proprietary Technology) Talent Acquisitions (New Skilled Employees) Expansion in Geographic Reach or into New Product/Service Markets Diversification in Revenue Sources (Less Risk, Lower Cost of Capital) Reduce Time to Market with New Product Launches Increased Number of Channels to Sell Products/Services Market Leadership and Decreased Competition (if Horizontal Integration) Achieve Supply Chain Efficiencies (if Vertical Integration) Tax Benefits (if Target has NOLs) What are the differences among vertical, horizontal, and conglomerate mergers?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "In terms of vertical integration, what is the difference between forward and backward integration?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Read More → Ultimate Guide to M&A + Breakdown of Microsoft’s Acquisition of LinkedIn What are synergies and why are they important in a deal?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Cost Synergies: Eliminate overlapping workforces (reduce headcount), closure or consolidation of redundant facilities, streamlined processes, purchasing power over suppliers, tax savings (NOLs) Why should companies acquired by strategic acquirers expect to fetch higher premiums than those selling to private equity buyers?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "75 MERGERS & ACQUISTIONS QUESTIONS What is a negotiated sale?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are some of the most common reasons that M&A deals fail to create value?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "If that's the case, why do companies still engage in M&A?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the purpose of a teaser?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What does a confidential information memorandum (CIM) consist of?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Read More → Confidential Information Memorandum (CIM) What are the typical components found in a letter of intent (LOI)?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Read More → Letter of Intent (LOI) What are “no-shop” provisions in M&A deals?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Read More → Breakup Fees and Reverse Termination Fees in M&A What is a material adverse change (MAC), and could you provide some examples?",
    category: "M&A" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are the two most common ways that hostile takeovers are pursued?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "91 LEVERAGED BUYOUT QUESTIONS Private Equity Investing What is a leveraged buyout (LBO)?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: " Which industry are you most interested in pursuing an investment within?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: " Tell me about an investment theme you have in mind and why you think it's an interesting opportunity?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: " If our firm was looking at a new investment opportunity in [specific sub-industry], how would you approach diligence to determine if it's an investment worth looking further into or not?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Read More → LBO Analysis on a Cocktail Napkin What is the intuition underlying the usage of debt in an LBO?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the typical capital structure prevalent in LBO transactions?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are the main levers in an LBO that drive returns?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What attributes make a business an ideal LBO candidate?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What types of industries attract more deal flow from financial buyers?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What would be the ideal type of products/services of a potential LBO target?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the relationship between debt and purchase price?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "How is the maximum leverage used in an LBO typically determined?",
    category: "LBO" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "112 CAPITAL MARKETS QUESTIONS Debt & Leveraged Finance What is the difference between a bond and a leveraged loan?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "113 CAPITAL MARKETS QUESTIONS What is the difference between investment-grade and speculative-grade debt?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What does it mean when a debt tranche is denoted as 1st lien or 2nd lien?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between a secured and unsecured loan?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "How are leveraged loans usually priced?",
    category: "Other" as const,
    difficulty: "Hard" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "114 CAPITAL MARKETS QUESTIONS What does LIBOR stand for?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is SOFR, the expected replacement of LIBOR?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "In terms of debt terminology, what does the coupon rate mean?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "How does the coupon on a bond differ from the yield?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What does it mean when a bond is trading at a discount, par, or premium?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Discount: Price < 100, Yield is Greater than Coupon Par: Price = 100, Yield is Equal to Coupon Premium: Price > 100, Yield Less Than Coupon What is the difference between a fixed and floating interest rate?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "When would an investor prefer fixed rates over floating rates (and vice versa)?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are some different debt amortization schedules?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "115 CAPITAL MARKETS QUESTIONS What is a callable bond and how does it benefit the issuer or borrower?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "When would the prepayment optionality of certain debt tranches be unattractive to lenders?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is a revolving credit facility and what purpose does it serve to the borrower?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the undrawn commitment fee associated with revolvers?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between an asset-based loan and a cash flow revolver?",
    category: "Accounting" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "116 CAPITAL MARKETS QUESTIONS Why do revolvers normally not have a leverage test?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is unitranche debt and its benefits?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between a bond’s coupon rate and the bond’s current yield?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What is the difference between current yield and yield to maturity?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Could you define fixed income and name a few examples?",
    category: "Other" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What does the money market refer to and what is the typical maturity range?",
    category: "Market Sizing" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "167 INDUSTRY SPECIFIC QUESTIONS Technology, Media & Telecommunications (TMT) What are the most common types of business models in the telecom and media industry?",
    category: "Financial Modeling" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "169 INDUSTRY SPECIFIC QUESTIONS Which valuation metrics are common to see for traditional telecom companies?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What metrics would you use to measure user engagement?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "User Engagement KPIs Daily Active Users (DAU) and Monthly Active Users (MAU) Active Subscriber Count Time Spent In-App Per Day or Week Pageviews/Website Hits Churn Rate (Retention %) Conversion Rate (Free  Paid Plan) Which multiples are most commonly used to value modern media companies?",
    category: "Valuation" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "170 INDUSTRY SPECIFIC QUESTIONS For a company with a product meant for high frequency in usage, what is one way to assess user engagement?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What are economies of scale and could you give me an example?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "What effect does having high operating leverage have on the scalability of a business?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Can you give me an example of a company benefiting from operating leverage?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Instead, this series of questions is based on two core questions: How have your experiences prepared you for this position?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "Do other investment banks even recruit there?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  },
  {
    question: "A few examples of these “Mike Tyson Questions” are: Why did you not land an internship offer last summer?",
    category: "General" as const,
    difficulty: "Medium" as const,
    answer: "",
    notes: "",
    isPreloaded: true
  }
];

// Total additional questions: 81
// Categories: Accounting, Valuation, Other, General, M&A, LBO, Market Sizing, Financial Modeling
