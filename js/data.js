// data.js

export const SITE = {
  person: {
    name: "Elijah Andrae",
    headline: "Data Science | Applied Mathematics | Nanofabrication | Marketing Analytics",
    photo: "images/headshot.jpg",
    photoAlt: "Eli Andrae headshot",
    domains: ["Python & R", "Predictive Modeling", "Cleanroom Ops", "Experimental Design"],
    contact: {
      phone: "(814) 923-1280",
      email: "Elijah.andrae56@outlook.com",
      linkedin: "https://www.linkedin.com/in/elijah-andrae",
      github: "https://github.com/Elijah-Andrae56",
      Portfolio: "https://elijah-andrae56.github.io/Portfilio-Site/"
    },
    summary:
      "A multidisciplinary data scientist with integrated experience across nanofabrication, applied mathematics, and marketing analytics. Skilled in developing predictive models, experimental designs, and end-to-end analytical pipelines that translate complex data into operational and strategic decisions. Combines statistical rigor with hands-on engineering and cleanroom experience, enabling a full stack understanding of how physical systems, data pipelines, and business objectives interact. Demonstrated strength in technical communication, cross-functional collaboration, and delivering analyses that influence stakeholders and improve organizational performance.",
  },

  skills: [
    {
      title: "Statistical & ML Methods",
      domains: ["ds", "marketing", "nanofab"],
      items: [
        "Regression (SLM/MLM)",
        "Logistic, Ridge/Lasso",
        "Classification (KNN/Forests)",
        "PCA & Clustering",
        "Sentiment Analysis",
        "Inference (ANOVA, t-tests, χ², bootstrap)",
        "A/B Testing, KS tests",
        "Time-series summarization",
        "Model evaluation",
      ],
    },
    {
      title: "Programming & Tools",
      domains: ["cs", "ds", "nanofab"],
      items: [
        "Python (pandas, NumPy, Matplotlib, scikit-learn)",
        "R (tidyverse)",
        "SQL, Bash, LaTeX",
        "Git/GitHub",
        "Jupyter, RMarkdown",
        "Excel, Tableau",
        "SPSS, JMP",
        "Google Cloud (analytics + cleaning/ETL)",
        "Meta Business Suite",
      ],
    },
    {
      title: "Analytics & Experimentation",
      domains: ["ds", "nanofab", "marketing"],
      items: [
        "Predictive modeling",
        "Train/validation strategy",
        "DOE (full & fractional factorials)",
        "Multivariate analysis",
        "Process optimization",
        "Interaction modeling",
        "Instrument validation",
        "Marketing & operational decision analytics",
      ],
    },
    {
      title: "Communication & Leadership",
      items: [
        "Technical writing",
        "Stakeholder presentations",
        "Cross-functional collaboration",
        "Instructional support & mentorship",
        "Project scoping",
        "Results translation (technical/non-technical)",
      ],
    },
    {
      title: "Nanofabrication & Lab Techniques",
      domains: ["nanofab"],
      items: [
        "ISO cleanroom operations",
        "Substrate prep, solvent handling, UV-ozone cleaning",
        "Photolithography (spin coat, bakes, alignment, dev, dose optimization)",
        "Thin-film processing (thermal evap, e-beam deposition, lift-off, etching)",
        "Metrology (Dektak, ellipsometry, reflectometry, optical microscopy)",
        "Process development, yield optimization, characterization",
      ],
    },
  ],

research: [
    {
        title: "Stimulus Driven Microfluidic Entropy",
        domains: ["nanofab", "ds"],
        meta: "Nanofabrication • Experimental Design • Device Characterization",
        bullets: [
        "Designed and fabricated a lab-on-a-chip device that exploits inherently stochastic, stimuli-driven microscale bubble dynamics as a physical source of entropy for true random number generation.",
        "Executed a multi-layer microfabrication workflow including photolithographic patterning, thin-film deposition, dielectric insulation, PDMS soft lithography, and optical metrology.",
        "Developed a structured experimental framework using factorial design methods to evaluate sensitivity to geometric asymmetries, operating conditions, and fabrication tolerances.",
        "Status: active experimental iteration and validation; results intended to support formal statistical characterization and potential intellectual property disclosure.",
        ],
    },

    {
      title: "CAHOOTS Dispatch Trend Analysis",
      domains: ["ds", "cs"],
      meta: "Python • Data Pipelines • Program Evaluation",
      bullets: [
        "Analyzed >50,000 police CAD records to quantify temporal and spatial patterns in mental-health-related crisis calls.",
        "Built reproducible data-cleaning pipelines (Python/pandas), produced statistical trend analyses, and created visual evidence supporting operational impact.",
        "Used in classroom-community collaboration for program evaluation in Eugene, OR.",
      ],
    },
  ],

  projects: [
    {
      title: "Stimulus Driven Microfluidic Entropy",
      date: "2025-12-12",
      categories: ["nanofab", "ds"],
      tags: ["Nanofab", "DS"],
      tools: ["Photolithography", "Thin-film deposition", "Metrology", "DOE"],
      blurb:
  "Designed and fabricated a microfluidic true-random number generator (TRNG) that leverages inherently stochastic microscale bubble dynamics. Built a multi-layer glass/metal/dielectric/PDMS stack and planned DOE-driven characterization and debiasing.",
      details:
  "Objective: translate a physical, microscale stochastic process into measurable randomness signals, then quantify bias and stability across device geometry and operating conditions.\n\nSystem design: a multi-layer lab-on-a-chip stack (glass substrate with patterned metal features and dielectric insulation, bonded to PDMS microchannels) that produces repeatable bubble events and converts bubble path outcomes into bitstreams.\n\nPlanned validation: automated bit extraction (direction → 0/1), Von Neumann debiasing, and statistical checks including binomial fit/uniformity tests and DOE/ANOVA to separate physics-driven variability from fabrication artifacts.\n\nStatus: prototype fabrication and assembly completed; initial run highlighted alignment, bonding, and defect-sensitivity as primary failure modes, guiding the next iteration and control experiments.",
image: "images/microfluidic_TRNG_2.jpg",
      images: ["images/microfluidic_TRNG_2.jpg", "images/microfluidic_TRNG_3.png", "images/microfluidic_TRNG_4.png"],
      imageAlt: "Microfluidic TRNG device image",
      links: [],
    },
    {
      title: "Google Merchandise Store Analysis",
      date: "2025-03-18",
      categories: ["ds", "marketing"],
      tags: ["Data Science", "Marketing"],
      tools: ["R", "BigQuery", "tidyverse", "Logistic regression", "SQL"],
      blurb:
        "Parsed 900k e-commerce sessions using R & BigQuery. Built logistic-regression models to classify high-value buyers and optimize campaign scheduling.",
      details:
        "End-to-end analysis of 903,000+ Google Merchandise Store sessions spanning Aug 2016–Aug 2017. Data was extracted from Google Cloud using SQL, cleaned and feature-engineered in R, and merged with a global holiday dataset to quantify temporal purchasing behavior.\n\nExploratory analysis examined revenue concentration by traffic source, browser, country, and visitor behavior.\n\nTo operationalize insights, logistic regression models were developed to predict both purchase likelihood and bounce behavior, informing recommendations for campaign timing optimization.",
      image: "images/google_merch_store_1.png",
      images: ["images/google_merch_store_1.png", "images/google_merch_store_2.png"],
      imageAlt: "Google merchandise store analysis visualization",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/Google_Merch_Store_Analysis_MKTG415" }],
    },
    {
      title: "Lake Erie Weather-Buoy Safety Model",
      date: "2024-11-10",
      categories: ["ds", "cs"],
      tags: ["Data Science", "Python"],
      tools: ["Python", "scikit-learn", "PCA", "Ridge regression"],
      blurb:
        "Integrated NOAA buoy & airport datasets to predict hazardous wave conditions. Applied Ridge Regression and PCA to reduce false negatives by 23% vs baseline heuristics.",
      details:
        "Goal: improve small-boat safety decisions on Lake Erie by modeling hazardous wave conditions using historical buoy observations and nearby airport weather records.\n\nData & preprocessing: ingested multi-year NOAA buoy measurements sampled at ~20-minute cadence (wind speed/direction, gusts, wave height, dominant wave period, wave direction, air/water temperature). Cleaned sentinel missing values, standardized timestamps, engineered seasonal subsets (focused on summers with consistent coverage), and created categorical direction features (cardinal wind and wave direction).\n\nExploratory findings: wave height increased strongly with wind speed and gusts, with visible direction-dependent structure. Dominant wave period (DPD) interacted with wave height in a way consistent with more hazardous ‘short-period, higher-amplitude’ conditions. A derived hazard proxy (wave height ÷ dominant period) surfaced west-wind regimes as disproportionately associated with the most dangerous observations.\n\nInference: tested whether hazard differed across wind/wave direction groups using one-way ANOVA after a variance-stabilizing transform, finding statistically significant mean differences between directional regimes. At a daily level, merged buoy aggregates with airport precipitation and used resampling to compare the proportion of ‘safe’ days under rainy vs. dry conditions; rainy days showed a materially lower fraction of days below a chosen safe-wave threshold.\n\nPrediction: built baseline and regularized regression models to estimate wave height from wind speed, gusts, dominant wave period, and directional indicators. Feature engineering included nonlinear terms and interactions (e.g., wind×gust, wind×period), with model selection using cross-validation and holdout evaluation. Ridge regression produced stable performance and identified interaction terms as dominant predictors.\n\nOutcome: produced an interpretable safety-oriented workflow that combines exploratory climatology, statistically grounded hazard comparisons, and predictive modeling to support go/no-go judgments for offshore boating.",

      image: "images/wave_project_1.png",
      images: ["images/wave_project_1.png", "images/wave_project_2.png", "images/wave_project_3.png"],
      imageAlt: "Wave safety model results plot",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/Lake-Erie-Weather-Buoy-Project" }],
    },
    {
      title: "FishTracker App",
      date: "2025-09-15",
      categories: ["cs"],
      tags: ["CS", "App Dev"],
      tools: ["Python", "Kivy", "SQL", "ETL"],
      blurb:
        "Developed a mobile app scraping NOAA data, logging GPS routes, and using SQL for real-time analytics.",
      details:
        "Engineered a robust mobile application to track fishing performance and environmental conditions. The app features an **offline-first architecture** using **SQLite** and **Peewee ORM**, ensuring data persistence even in remote locations without cellular service.\n\n**Key Technical Implementations:**\n\n* **GPS Tracking Engine:** Built a singleton geolocation service using `plyer` to interface with Android hardware, featuring a custom simulation mode for deterministic desktop testing.\n* **Asynchronous Data Ingestion:** Implemented threaded polling of WQDataLive API endpoints to fetch real-time wave height, wind speed, and water temperature without blocking the main UI thread.\n* **Data Correlation:** Automatically links every logged catch with the precise GPS coordinates and current weather conditions to build a rich historical dataset for analysis.\n* **Configurable Architecture:** Designed a flexible unit conversion system allowing seamless toggling between Imperial and Metric standards across the UI and database.",
      image: "images/fishtracker.png",
      imageAlt: "FishTracker screenshot",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/FishingTracker" }],
    },
    {
      title: "CAHOOTS Dispatch Trend Analysis",
      date: "2024-06-15",
      categories: ["ds"],
      tags: ["Data Science"],
      tools: ["Python", "pandas", "Visualization", "Program evaluation"],
      blurb:
        "Built reproducible pipelines and trend analyses on crisis-response dispatch logs to support operational evaluation.",
      details:
        "You can include: time-of-day seasonality, hotspot mapping summaries, and any stakeholder-facing deliverables (slides/report).",
      image: "images/cahoots_1.png",
      imageAlt: "CAHOOTS dispatch analysis plot",
      links: [],
    },
    {
      title: "Resident-Assistant Shift Scheduler",
      date: "2024-10-29",
      categories: ["cs", "ds"],
      tags: ["CS", "Optimization"],
      tools: ["Python", "OR-Tools", "Constraint optimization"],
      blurb:
        "Developed a model to automate RA on-call scheduling under 8+ fairness constraints; designed for 12 teams with projected 750+ hours saved yearly.",
      details:
        "Add: constraint list, objective function, infeasibility handling, and how you validated fairness outcomes.",
      image: "images/scheduler_1.png",
      images: ["images/scheduler_1.png", "images/scheduler_2.png", "images/scheduler_3.png"],
      imageAlt: "Wave safety model results plot",
      links: [],
    },
    {
      title: "Lithography Resolution & LaserWriter Characterization",
      date: "2025-11-05",
      categories: ["nanofab", "ds"],
      tags: ["Nanofab", "Lithography", "DOE"],
      tools: ["Microtech LaserWriter", "AZ1512", "Profilometry", "JMP"],
      blurb:
        "Characterized lithographic resolution limits using a full 2³ factorial experiment on LaserWriter parameters.",
      details:
        "Designed a randomized factorial experiment varying D-step, dose, and lens configuration. Measured linewidth and depth across multiple feature sizes using profilometry.",
      image: "images/dose_test_1.png",
      images: ["images/dose_test_1.png", "images/dose_test_2.jpg"],
      imageAlt: "LaserWriter lithography resolution test patterns",
      links: [],
    },
    {
      title: "Thin-Film Aluminum Lift-Off Process",
      date: "2025-11-24",
      categories: ["nanofab"],
      tags: ["Nanofab", "Thin Films"],
      tools: ["Thermal Evaporation", "AZ Photoresist", "Profilometry"],
      blurb:
        "Executed and characterized an aluminum lift-off process for patterned thin-film fabrication.",
      details:
        "Patterned AZ photoresist, deposited 100 nm Al via thermal evaporation, and performed lift-off. Quantified film thickness uniformity and evaluated edge roughness.",
      image: "images/lift_off.png",
      links: [],
    },
    {
      title: "Aluminum Etching & Mask Transfer",
      date: "2025-11-24",
      categories: ["nanofab"],
      tags: ["Nanofab", "Etching"],
      tools: ["Al Etchant", "Mask Aligner", "Profilometry"],
      blurb:
        "Transferred aluminum patterns via wet chemical etching and quantified etch rates and edge fidelity.",
      details:
        "Deposited aluminum thin films, patterned photoresist masks, and etched. Measured etch rate and compared multiple chips and process conditions.",
      image: "images/wet_etch.png",
      links: [],
    },
    {
      title: "Multi-Layer Alignment: Mask Aligner vs LaserWriter",
      date: "2025-12-01",
      categories: ["nanofab"],
      tags: ["Nanofab", "Alignment"],
      tools: ["SUSS MJB4", "LaserWriter", "PMGI/AZ Bilayer"],
      blurb:
        "Performed and compared multi-layer alignment using both optical mask alignment and direct-write lithography.",
      details:
        "Fabricated multilayer structures, quantified alignment accuracy, and compared systematic differences between workflows.",
      image: "images/alignment.jpg",
      imageAlt: "Layer alignment markers and profilometry scan",
      links: [],
    },
  ],

  experience: [
    {
      title: "Resident Assistant",
      meta: "University of Oregon Housing — Eugene, OR | Sept 2023–Present",
      bullets: [
        "Mentored and supported 150+ students in dormitory housing; provided conflict mediation, academic guidance, and day-to-day support.",
        "Delivered on-call first-response assistance during medical, wellness, and facilities incidents; coordinated with professional staff and emergency services.",
        "Conducted safety inspections, policy education, and incident documentation to ensure adherence to university standards.",
        "Led community programming focused on engagement, well-being, and resource accessibility.",
      ],
    },
    {
      title: "Learning Assistant — Applied Data Science for Social Justice",
      domains: ['ds', 'cs', 'nanofab'],
      meta: "University of Oregon | Apr 2025–Jun 2025",
      bullets: [
        "Facilitated lab sessions and office hours; guided students through cleaning, visualization, and analysis of CAHOOTS dispatch logs.",
        "Coached analytical storytelling and partner-facing presentations for community stakeholders (White Bird Clinic).",
        "Provided individualized technical support in Python/pandas workflows for reproducible, impact-oriented insights.",
      ],
    },
    {
      title: "Social Media Analytics & Marketing Intern",
      domains: ["ds", "marketing"],
      meta: "Humes — Waterford, PA",
      bullets: [
        "Increased organic reach by 117% within three weeks by analyzing engagement metrics and optimizing cadence in Meta Business Suite.",
        "Conducted competitive content analysis and audience segmentation to refine messaging strategy and improve engagement consistency.",
      ],
    },
    {
      title: "Mathematics Paper Marker",
      domains: ["ds", "cs", "nanofab"],
      meta: "Intro to Mathematical Cryptography; Linear Algebra",
      bullets: [
        "Evaluated assignments and provided detailed feedback to support proof-writing, matrix methods, and cryptographic reasoning.",
        "Collaborated with instructors to maintain grading accuracy, rubric adherence, and timely feedback delivery.",
      ],
    },
  ],

  coursework: [
    {
      title: "Data Science & Computing",
      meta: "",
      bullets: [
        "Foundations of Data Science I & II",
        "Principles and Techniques of Data Science",
        "Probability and Statistics for Data Science",
        "Data Structures and Algorithms in Python",
        "Data Science for Social Justice",
        "Computer Science I & II",
      ],
    },
    {
      title: "Mathematics",
      meta: "",
      bullets: [
        "Calculus I–III",
        "Linear Algebra I & II",
        "Introduction to Proofs",
        "Mathematical Cryptography",
        "Differential Equations",
        "Introduction to Statistical Methods",
      ],
    },
    {
      title: "Business & Marketing Analytics",
      meta: "",
      bullets: [
        "Marketing Research",
        "Marketing Analytics",
        "Language of Business Decisions",
        "Value Creation for Customers",
        "Micro/Macro Economics",
      ],
    },
    {
      title: "Nanofabrication & Engineering",
      meta: "",
      bullets: ["Nanofabrication"],
    },
    {
      title: "Ethics & Analytical Reasoning",
      meta: "",
      bullets: ["Data Ethics", "Critical Reasoning"],
    },
  ],

  education: [
    {
      title: "University of Oregon",
      meta: "B.S. Data Science (Marketing Analytics concentration) - Minors: Mathematics, Business Administration",
      bullets: [
        "Expected graduation: June 2026",
        "GPA 3.30",
        "Honors: Dean's List Spring 2025, Dean's List Fall 2025",
      ],
    },
  ],
};

export const CATEGORY_LABELS = {
  all: "All Projects",
  ds: "Data Science",
  cs: "Computer Science",
  marketing: "Marketing Analytics",
  nanofab: "Nanofabrication",
};
