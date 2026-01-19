// data.js

export const SITE = {
  person: {
    name: "Elijah Andrae",
    headline: "Data Science | Applied Mathematics | Nanofabrication | Marketing Analytics",
    photo: "images/headshot.jpg",
    photoAlt: "Eli Andrae headshot",
    domains: ["Python & R", "Predictive Modeling", "Cleanroom Ops", "Experimental Design"],
    contact: {
      email: "Elijah.andrae56@outlook.com",
      linkedin: "https://www.linkedin.com/in/elijah-andrae",
      github: "https://github.com/Elijah-Andrae56",
      portfolio: "https://elijah-andrae56.github.io/Portfolio/"
    },
    summary:
      "A multidisciplinary data scientist with integrated experience across nanofabrication, applied mathematics, and marketing analytics. Skilled in developing predictive models, experimental designs, and end-to-end analytical pipelines that translate complex data into operational and strategic decisions. Combines statistical rigor with hands-on engineering and cleanroom experience, enabling a full stack understanding of how physical systems, data pipelines, and business objectives interact. Demonstrated strength in technical communication, cross-functional collaboration, and delivering analyses that influence stakeholders and improve organizational performance.",
  },

  highlights: [
    "Cleanroom microfabrication: photolithography, thin films, multilayer alignment, metrology (Dektak/ellipsometry)",
    "DOE-driven lithography characterization; factorial analysis in JMP",
    "Reproducible data pipelines (Python/pandas) for program evaluation and operational analytics",
    "Teaching and mentorship: Learning Assistant (Applied DS) and mathematics grader (proof + linear algebra)",
  ],


  skills: [
    {
      title: "Statistical and ML Methods",
      domains: ["ds", "marketing", "nanofab"],
      items: [
        "Regression (SLM/MLM)",
        "Logistic, Ridge/Lasso",
        "Classification (KNN/Forests)",
        "PCA and Clustering",
        "Sentiment Analysis",
        "Inference (ANOVA, t-tests, chi-square, bootstrap)",
        "A/B Testing, KS tests",
        "Time-series summarization",
        "Model evaluation",
      ],
    },
    {
      title: "Programming and Tools",
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
      title: "Analytics and Experimentation",
      domains: ["ds", "nanofab", "marketing"],
      items: [
        "Predictive modeling",
        "Train/validation strategy",
        "DOE (full and fractional factorials)",
        "Multivariate analysis",
        "Process optimization",
        "Interaction modeling",
        "Instrument validation",
        "Marketing and operational decision analytics",
      ],
    },
    {
      title: "Communication and Leadership",
      items: [
        "Technical writing",
        "Stakeholder presentations",
        "Cross-functional collaboration",
        "Instructional support and mentorship",
        "Project scoping",
        "Results translation (technical/non-technical)",
      ],
    },
    {
      title: "Nanofabrication and Lab Techniques",
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

  // Unified portfolio surface (Research + Labs + Projects)
  cards: [
    {
      kind: "research",
      featured: true,
      title: "Stimulus Driven Microfluidic Entropy",
      date: "2025-12-12",
      categories: ["nanofab", "ds"],
      tags: ["Nanofab", "DS", "Research"],
      tools: ["Photolithography", "Thin-film deposition", "Metrology", "DOE"],
      cvBullets: [
        "Fabricated multi-layer microfluidic TRNG device (glass/metal/dielectric + PDMS microchannels) converting stochastic bubble bifurcation dynamics into bitstream outcomes.",
        "Designed DOE-driven characterization plan to quantify bias sources (geometry asymmetry, operating conditions, fabrication tolerances) and apply debiasing and statistical validation."
      ],
      blurb:
        "Designed and fabricated a microfluidic true-random number generator (TRNG) that leverages inherently stochastic microscale bubble dynamics. Built a multi-layer glass/metal/dielectric/PDMS stack and planned DOE-driven characterization and debiasing.",
      details:
        "Objective: translate a physical, microscale stochastic process into measurable randomness signals, then quantify bias and stability across device geometry and operating conditions.\n\nSystem design: a multi-layer lab-on-a-chip stack (glass substrate with patterned metal features and dielectric insulation, bonded to PDMS microchannels) that produces repeatable bubble events and converts bubble path outcomes into bitstreams.\n\nPlanned validation: automated bit extraction (direction to 0/1), Von Neumann debiasing, and statistical checks including binomial fit/uniformity tests and DOE/ANOVA to separate physics-driven variability from fabrication artifacts.\n\nStatus: prototype fabrication and assembly completed; initial run highlighted alignment, bonding, and defect-sensitivity as primary failure modes, guiding the next iteration and control experiments.",
      image: "images/microfluidic_TRNG_2.jpg",
      images: ["images/microfluidic_TRNG_2.jpg", "images/microfluidic_TRNG_3.png", "images/microfluidic_TRNG_4.png", "images/microfluidic_TRNG_5.jpg"],
      imageAlt: "Microfluidic TRNG device image",
      links: [],
    },

    {
      kind: "lab",
      title: "Nanofabrication Cleanroom Labs",
      date: "2025-12-01",
      categories: ["nanofab"],
      tags: ["Nanofab", "Cleanroom", "Labs"],
      tools: ["SUSS MJB4", "Microtech LaserWriter", "Thermal Evaporation", "Profilometry", "Wet Etch", "JMP"],
      blurb:
        "Cleanroom process modules emphasizing reproducible lithography, thin-film processing, metrology, multilayer alignment, and parameter sensitivity.",
      details:
        "Condensed cleanroom training focused on process control, measurement, and repeatability. Modules below summarize specific lab builds and characterization work.",
      image: "images/alignment.jpg",
      imageAlt: "Nanofabrication lab work",
      modules: [
        {
          title: "Lithography Resolution and LaserWriter Characterization",
          date: "2025-11-05",
          tools: ["Microtech LaserWriter", "AZ1512", "Profilometry", "JMP"],
          bullets: [
            "Designed and executed randomized full 2^3 factorial DOE varying dose, D-step, and lens configuration to characterize LaserWriter resolution limits.",
            "Measured linewidth and feature depth via profilometry; analyzed main effects and interactions in JMP to identify parameter regimes maximizing pattern fidelity."
          ],
          blurb: "Characterized lithographic resolution limits using a full 2^3 factorial DOE on LaserWriter parameters.",
          images: ["images/dose_test_1.png", "images/dose_test_2.jpg"],
          imageAlt: "LaserWriter lithography resolution test patterns",
        },
        {
          title: "Multi-Layer Alignment: Mask Aligner vs LaserWriter",
          date: "2025-12-01",
          tools: ["SUSS MJB4", "LaserWriter", "PMGI/AZ Bilayer"],
          bullets: [
            "Executed multi-layer lithography workflows using SUSS MJB4 mask alignment and Microtech LaserWriter direct-write to build aligned multilayer patterns.",
            "Quantified overlay error and compared workflow trade-offs (throughput, repeatability, alignment accuracy) to guide tool selection for multilayer device fabrication."
          ],
          blurb: "Compared multi-layer alignment using optical mask alignment and direct-write lithography.",
          images: ["images/alignment.jpg"],
          imageAlt: "Layer alignment markers and profilometry scan",
        },
        {
          title: "Thin-Film Aluminum Lift-Off Process",
          date: "2025-11-24",
          tools: ["Thermal Evaporation", "AZ Photoresist", "Profilometry"],
          bullets: [
            "Patterned photoresist masks and deposited approximately 100 nm Al via thermal evaporation; executed lift-off to produce patterned metal features.",
            "Characterized thickness/uniformity and edge fidelity using profilometry; identified parameters controlling lift-off success and pattern quality."
          ],
          blurb: "Executed and characterized an aluminum lift-off process for patterned thin-film fabrication.",
          images: ["images/lift_off.png"],
          imageAlt: "Al lift-off process results",
        },
        {
          title: "Aluminum Etching and Mask Transfer",
          date: "2025-11-24",
          tools: ["Al Etchant", "Mask Aligner", "Profilometry"],
          bullets: [
            "Transferred aluminum patterns via wet chemical etching using photoresist masks under controlled etch conditions.",
            "Measured etch rates and evaluated line edge fidelity/undercut across chips to assess repeatability and parameter sensitivity."
          ],
          blurb: "Transferred aluminum patterns via wet chemical etching and quantified etch behavior and edge fidelity.",
          images: ["images/wet_etch.png"],
          imageAlt: "Al wet etch results",
        },
      ],
      links: [],
    },

    {
      kind: "lab",
      title: "Electronics Laboratory (In progress)",
      date: "2026-01-10",
      categories: ["cs", "ds", "nanofab"],
      tags: ["Electronics", "Measurement", "Labs"],
      tools: ["Oscilloscope", "Function Generator", "Multimeter", "RC Circuits"],
      blurb:
        "Circuit measurement and instrumentation practice: RC response, rise/fall characterization, and repeatable test setups.",
      details:
        "Developing measurement discipline and instrumentation workflows aligned with device characterization needs (time-domain response, grounding, probe placement, consistent excitation).",
      image: "images/electronics_1.jpg",
      images: ["images/electronics_1.jpg", "images/electronics_2.jpg", "images/electronics_3.jpg", "images/electronics_4.jpg"],
      links: [],
    },

    {
      kind: "lab",
      title: "CAHOOTS Applied Data Science Lab",
      date: "2024-06-15",
      categories: ["ds", "cs"],
      tags: ["Data Science", "Program Evaluation", "Labs"],
      tools: ["Python", "pandas", "Visualization"],
      cvBullets: [
        "Built reproducible Python/pandas pipeline for cleaning and analyzing 50k+ police CAD dispatch records related to mental health crisis response.",
        "Quantified temporal/spatial trends and produced stakeholder-facing visualizations supporting operational program evaluation (Eugene, OR)."
      ],
      blurb:
        "Built reproducible pipelines and trend analyses on crisis-response dispatch logs to support operational evaluation.",
      details:
        "Course-based applied lab focused on reproducible analysis and stakeholder communication. Work emphasized data cleaning, exploratory analysis, and clear presentation of findings.",
      image: "images/cahoots_1.png",
      images: ["images/cahoots_1.png"],
      imageAlt: "CAHOOTS dispatch analysis plot",
      links: [],
    },

    {
      kind: "project",
      title: "FishTracker App",
      date: "2025-09-15",
      categories: ["cs"],
      tags: ["CS", "App Dev"],
      tools: ["Python", "Kivy", "SQL", "ETL"],
      cvBullets: [
        "Developed offline-first mobile application (Python/Kivy + SQLite) integrating GPS route logging with environmental data ingestion for fishing performance analytics.",
        "Implemented ETL + data model linking catches to location/time/weather conditions, enabling historical query, trend analysis, and decision support."
      ],
      blurb:
        "Developed a mobile app scraping NOAA data, logging GPS routes, and using SQL for real-time analytics.",
      details:
        "Engineered a robust mobile application to track fishing performance and environmental conditions. The app features an offline-first architecture using SQLite and Peewee ORM, ensuring data persistence even in remote locations without cellular service.\n\nKey Technical Implementations:\n\n- GPS Tracking Engine: singleton geolocation service using plyer to interface with Android hardware, including simulation mode for deterministic desktop testing.\n- Asynchronous Data Ingestion: threaded polling of WQDataLive API endpoints to fetch real-time wave height, wind speed, and water temperature without blocking the UI.\n- Data Correlation: links each logged catch with GPS coordinates and current weather conditions.\n- Configurable Architecture: unit conversion system enabling toggling between Imperial and Metric standards.",
      image: "images/fishtracker.png",
      imageAlt: "FishTracker screenshot",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/FishingTracker" }],
    },

    {
      kind: "project",
      title: "Google Merchandise Store Analysis",
      date: "2025-03-18",
      categories: ["ds", "marketing"],
      tags: ["Data Science", "Marketing"],
      tools: ["R", "BigQuery", "tidyverse", "Logistic regression", "SQL"],
      cvBullets: [
        "Analyzed 900k+ e-commerce sessions using SQL/BigQuery and R (tidyverse); engineered behavioral and temporal features for marketing attribution.",
        "Built and evaluated logistic regression models to predict purchase propensity/high-value customers; translated results into campaign-timing and targeting recommendations."
      ],
      blurb:
        "Parsed 900k e-commerce sessions using R and BigQuery. Built logistic regression models to classify high-value buyers and optimize campaign scheduling.",
      details:
        "End-to-end analysis of 903,000+ Google Merchandise Store sessions spanning Aug 2016 to Aug 2017. Data extracted from Google Cloud using SQL, cleaned and feature-engineered in R, and merged with a global holiday dataset to quantify temporal purchasing behavior.\n\nExploratory analysis examined revenue concentration by traffic source, browser, country, and visitor behavior.\n\nLogistic regression models predicted purchase likelihood and bounce behavior to support campaign timing optimization.",
      image: "images/google_merch_store_1.png",
      images: ["images/google_merch_store_1.png", "images/google_merch_store_2.png"],
      imageAlt: "Google merchandise store analysis visualization",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/Google_Merch_Store_Analysis_MKTG415" }],
    },

    {
      kind: "project",
      title: "Lake Erie Weather-Buoy Safety Model",
      date: "2024-11-10",
      categories: ["ds", "cs"],
      tags: ["Data Science", "Python"],
      tools: ["Python", "scikit-learn", "PCA", "Ridge regression"],
      cvBullets: [
        "Integrated NOAA buoy and airport datasets; engineered directional and seasonal features to model hazardous wave regimes and safe/unsafe classifications.",
        "Built Ridge regression model with PCA-based dimensionality reduction; reduced false negatives by 23% vs baseline heuristics and produced interpretable safety workflow."
      ],
      blurb:
        "Integrated NOAA buoy and airport datasets to predict hazardous wave conditions. Applied Ridge Regression and PCA to reduce false negatives by 23% vs baseline heuristics.",
      details:
        "Goal: improve small-boat safety decisions on Lake Erie by modeling hazardous wave conditions using historical buoy observations and nearby airport weather records.\n\nData and preprocessing: ingested multi-year NOAA buoy measurements sampled at approximately 20-minute cadence. Cleaned missing values, standardized timestamps, engineered seasonal subsets, and created categorical direction features.\n\nInference and prediction: evaluated directional regime differences and built regularized regression models with cross-validation. Ridge regression produced stable performance and identified interaction terms as dominant predictors.\n\nOutcome: produced an interpretable workflow combining exploratory climatology, statistically grounded comparisons, and predictive modeling to support go/no-go judgments.",
      image: "images/wave_project_1.png",
      images: ["images/wave_project_1.png", "images/wave_project_2.png", "images/wave_project_3.png"],
      imageAlt: "Wave safety model results plot",
      links: [{ label: "Code", url: "https://github.com/Elijah-Andrae56/Lake-Erie-Weather-Buoy-Project" }],
    },

    {
      kind: "project",
      title: "Resident-Assistant Shift Scheduler",
      date: "2024-10-29",
      categories: ["cs", "ds"],
      tags: ["CS", "Optimization"],
      tools: ["Python", "OR-Tools", "Constraint optimization"],
      cvBullets: [
        "Built constraint optimization model (Python + OR-Tools) automating RA on-call scheduling under 8+ fairness and coverage constraints.",
        "Produced feasible schedules for 12 teams; estimated 750+ administrative hours saved annually while maintaining policy compliance and equitable assignments."
      ],
      blurb:
        "Developed a model to automate RA on-call scheduling under 8+ fairness constraints; designed for 12 teams with projected 750+ hours saved yearly.",
      details:
        "Add: constraint list, objective function, infeasibility handling, and how you validated fairness outcomes.",
      image: "images/scheduler_1.png",
      images: ["images/scheduler_1.png", "images/scheduler_2.png", "images/scheduler_3.png"],
      imageAlt: "Scheduler results",
      links: [],
    },
  ],

  experience: [
    {
      title: "Resident Assistant",
      track: "industry",
      meta: "University of Oregon Housing - Eugene, OR | Sept 2023 to Present",
      bullets: [
        "Mentored and supported 150+ students in dormitory housing; provided conflict mediation, academic guidance, and day-to-day support.",
        "Delivered on-call first-response assistance during medical, wellness, and facilities incidents; coordinated with professional staff and emergency services.",
        "Conducted safety inspections, policy education, and incident documentation to ensure adherence to university standards.",
        "Led community programming focused on engagement, well-being, and resource accessibility.",
      ],
    },
    {
      title: "Learning Assistant - Applied Data Science for Social Justice",
      track: "academic",
      domains: ["ds", "cs", "nanofab"],
      meta: "University of Oregon | Apr 2025 to Jun 2025",
      bullets: [
        "Facilitated lab sessions and office hours; guided students through cleaning, visualization, and analysis of CAHOOTS dispatch logs.",
        "Coached analytical storytelling and partner-facing presentations for community stakeholders (White Bird Clinic).",
        "Provided individualized technical support in Python/pandas workflows for reproducible, impact-oriented insights.",
      ],
    },
    {
      title: "Social Media Analytics and Marketing Intern",
      track: "industry",
      domains: ["ds", "marketing"],
      meta: "Humes - Waterford, PA",
      bullets: [
        "Increased organic reach by 117% within three weeks by analyzing engagement metrics and optimizing cadence in Meta Business Suite.",
        "Conducted competitive content analysis and audience segmentation to refine messaging strategy and improve engagement consistency.",
      ],
    },
    {
      title: "Mathematics Paper Marker",
      track: "academic",
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
      title: "Data Science and Computing",
      meta: "",
      bullets: [
        "Foundations of Data Science I and II",
        "Principles and Techniques of Data Science",
        "Probability and Statistics for Data Science",
        "Data Structures and Algorithms in Python",
        "Data Science for Social Justice",
        "Computer Science I and II",
      ],
    },
    {
      title: "Mathematics",
      meta: "",
      bullets: [
        "Calculus I to III",
        "Linear Algebra I and II",
        "Introduction to Proofs",
        "Mathematical Cryptography",
        "Differential Equations",
        "Introduction to Statistical Methods",
      ],
    },
    {
      title: "Business and Marketing Analytics",
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
      title: "Nanofabrication and Engineering",
      meta: "",
      bullets: ["Nanofabrication"],
    },
    {
      title: "Ethics and Analytical Reasoning",
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
        "Relevant coursework: Machine Learning, Probability and Statistics, Linear Algebra, Differential Equations, Nanofabrication",
      ],
    },
  ],
};

export const CATEGORY_LABELS = {
  all: "All",
  research: "Research",
  lab: "Labs",
  project: "Projects",
  ds: "Data Science",
  cs: "Computer Science",
  marketing: "Marketing",
  nanofab: "Nanofabrication",
};
