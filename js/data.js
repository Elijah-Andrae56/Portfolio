// data.js

export const SITE = {
  person: {
    name: "Elijah Andrae",
    headline: "Process Engineer & Data Scientist | Optimizing physical systems through statistical modeling, DOE, and cleanroom nanofabrication",
    photo: "images/headshot.jpg",
    photoAlt: "Eli Andrae headshot",
    domains: ["Python & R", "Predictive Modeling", "Cleanroom Ops", "Experimental Design"],
    contact: {
      email: "Elijah.andrae56@outlook.com",
      linkedin: "https://www.linkedin.com/in/elijah-andrae",
      portfolio: "https://elijah-andrae56.github.io/Portfolio/"
    },
    // summary is the portfolio display / CV fallback
    summary:
      "A multidisciplinary data scientist with integrated experience across nanofabrication, applied mathematics, and marketing analytics. Skilled in developing predictive models, experimental designs, and end-to-end analytical pipelines that translate complex data into operational and strategic decisions. Combines statistical rigor with hands-on engineering and cleanroom experience, enabling a full stack understanding of how physical systems, data pipelines, and business objectives interact. Demonstrated strength in technical communication, cross-functional collaboration, and delivering analyses that influence stakeholders and improve organizational performance.",
    // per-focus resume summaries
    summaries: {
      cv: "A multidisciplinary data scientist with integrated experience across nanofabrication, applied mathematics, and marketing analytics. Skilled in developing predictive models, experimental designs, and end-to-end analytical pipelines that translate complex data into operational and strategic decisions. Combines statistical rigor with hands-on engineering and cleanroom experience, enabling a full stack understanding of how physical systems, data pipelines, and business objectives interact. Demonstrated strength in technical communication, cross-functional collaboration, and delivering analyses that influence stakeholders and improve organizational performance.",
      process: "Process-oriented engineer with hands-on experience in cleanroom nanofabrication, DOE-driven process optimization, and statistical materials characterization. Skilled in designing and executing experimental protocols, applying statistical analysis to identify process sensitivities, and maintaining rigorous experimental documentation. Experienced in operating and maintaining precision laboratory equipment, executing controlled process sequences, and working cross-functionally to implement technical solutions. Combines materials data analysis capabilities with direct physical process development experience and a strong commitment to laboratory safety.",
      ds: "Data scientist with applied experience in predictive modeling, statistical inference, and end-to-end analytical pipelines across research, business, and public-sector domains. Skilled in Python (scikit-learn, pandas, NumPy), R (tidyverse), SQL, and machine learning methods including regression, classification, PCA, clustering, and DOE. Experienced in feature engineering, model evaluation, and translating complex analytical findings into clear, actionable recommendations for stakeholders. Demonstrated ability to handle large, high-dimensional datasets and communicate technical results to both technical and non-technical audiences.",
    },
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
        "Regression (SLR/MLR)",
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
      title: "Electrochemical Microbubble Devices: Fabrication, Characterization, and Stochastic Signal Applications",
      date: "2026-03-11",
      categories: ["nanofab", "ds", "cs"],
      tags: ["Nanofab", "Microfluidics", "Device Physics", "Instrumentation", "Research"],
      tools: [
        "Photolithography",
        "LaserWriter",
        "Thin-film deposition",
        "E-beam deposition",
        "PDMS soft lithography",
        "Keithley 2450",
        "Semiconductor probe station",
        "Optical microscopy",
        "Python",
        "DOE"
      ],
      descriptions: {
        cv: [
          "Designed and fabricated multilayer electrochemical microfluidic devices using patterned metal electrodes, dielectric insulation, SU-8 molds, and PDMS channel integration on glass substrates.",
          "Developed physics-driven characterization workflows using a Keithley 2450, microscope imaging, and semiconductor probe station measurements to quantify nucleation thresholds, current response, field dependence, and trial-to-trial stochastic behavior.",
          "Built a programmable data acquisition and analysis framework for voltage-stepped bubble experiments, including event timing, current traces, reaction-state labeling, and structured datasets for modeling nucleation probability and wait-time statistics.",
          "Positioned the platform for multiple device directions including microbubble actuation, stochastic neuron hardware, and entropy/random-number-generation studies grounded in quantified physical variability.",
        ],
        resume: {
          process: [
            "Designed and fabricated multilayer electrochemical microdevices using photolithographic patterning, thin-film metal deposition, SU-8 mold processing, and PDMS elastomeric channel integration on glass substrates.",
            "Developed systematic experimental protocols for device characterization using a Keithley 2450 and probe station; varied process parameters to map nucleation thresholds, current response, and field-dependent activation behavior across device geometries.",
            "Applied statistical analysis to multi-trial stochastic datasets to characterize process variability, screen for anomalies, and quantify nucleation probability distributions across experimental conditions.",
            "Maintained structured experimental records including trial logs, voltage-current data, photographic documentation, and reproducibility assessments to support iterative process improvement.",
          ],
          ds: [
            "Built programmable data acquisition framework for voltage-stepped electrochemical experiments; automated event timing, current trace logging, and reaction-state labeling into structured datasets.",
            "Applied stochastic modeling to nucleation datasets; characterized nucleation probability distributions and wait-time statistics to quantify physical variability across experimental conditions.",
            "Designed structured datasets linking process parameters to measured outcomes, enabling predictive modeling of nucleation behavior across voltage and device geometry conditions.",
          ],
        },
      },
      blurb:
        "Research platform centered on electrochemical microbubble generation in microfluidic devices, spanning full-stack fabrication, semiconductor-style electrical characterization, automated measurement design, and stochastic modeling for actuation, neuromorphic, and entropy-source applications.",
      details:
        "This project has been reframed from a single application-specific random-number generator build into a broader device-physics and characterization effort focused on electrochemical microbubble generation in microfluidic systems.\n\nSubsection 1: Device Design and Fabrication\nBuilt a multilayer glass-based microfluidic device stack combining patterned aluminum electrodes, dielectric insulation, and PDMS channel structures formed from SU-8 molds. The fabrication workflow includes substrate cleaning, lithographic patterning, metal deposition and lift-off, insulating layer definition, mold fabrication, and PDMS integration. Design work emphasizes electrode geometry, gap spacing, alignment strategy, insulation openings, and channel architecture so that bubble generation can be studied as a controlled physical phenomenon rather than a one-off demonstration.\n\nSubsection 2: Characterization, Instrumentation, and Modeling\nCurrent work focuses on building rigorous characterization methods for nucleation and gas-generation behavior using a Keithley 2450, semiconductor probe station, and microscope-based video measurement. Developed structured trial protocols for identifying safe operating windows, threshold behavior, gap dependence, drift / conditioning effects, and optional current-controlled operation. Measurement workflows log voltage, compliance, baseline current, steady current, reaction class, and first-event time, with video-linked trial records for reproducibility. Parallel analysis work models bubble nucleation as a stochastic first-event process, connecting current-voltage behavior to nucleation probability, wait-time distributions, and field-dependent activation behavior.\n\nApplication Direction\nThe long-term value of the platform is that the same physical system can be reframed for multiple applications: low-cost electrochemical microbubble actuation for microfluidic pumping, stochastic microbubble neuron concepts where nucleation implements a probabilistic activation curve, and entropy-source / TRNG studies where randomness is quantified statistically rather than assumed. This framing makes the project both fabrication-intensive and experimentally rigorous, with clear relevance to microdevices, semiconductor-style characterization, and applied physical modeling.\n\nStatus\nPrototype fabrication is active and the project is now centered on repeatable characterization, automated data collection, physically interpretable modeling, and iterative device redesign based on measured failure modes, threshold behavior, and reproducibility limits.",
      image: "images/microfluidic_electrolysis_1.jpg",
      images: [
        "images/microfluidic_electrolysis_1.jpg",
        "images/microfluidic_electrolysis_2.jpg",
        "images/microfluidic_electrolysis_3.jpg",
        "images/microfluidic_electrolysis_4.jpg",
        "images/microfluidic_electrolysis_5.jpg",
        "images/microfluidic_electrolysis_6.jpg"
      ],
      imageAlt: "Electrochemical microbubble microfluidic device and characterization workflow",
      links: [],
    },

    {
      kind: "lab",
      title: "Nanofabrication Cleanroom Labs",
      date: "2025-12-01",
      categories: ["nanofab"],
      tags: ["Nanofab", "Cleanroom", "Labs"],
      tools: ["SUSS MJB4", "Microtech LaserWriter", "Thermal Evaporation", "Profilometry", "Wet Etch", "JMP"],
      descriptions: {
        cv: [
          "Designed and executed full 2\u00b3 factorial DOE varying dose, D-step, and lens configuration to characterize LaserWriter lithography resolution limits; analyzed main effects and interactions in JMP.",
          "Executed multilayer lithography workflows using SUSS MJB4 mask alignment and LaserWriter direct-write; quantified overlay error and compared alignment accuracy for multilayer device fabrication.",
          "Patterned and deposited ~100 nm aluminum via thermal evaporation; executed lift-off and quantified film thickness, uniformity, and edge fidelity via profilometry.",
          "Transferred aluminum patterns via controlled wet chemical etching; measured etch rates and evaluated line edge fidelity and undercut to assess process repeatability and parameter sensitivity.",
        ],
        resume: {
          process: [
            "Designed and executed a full 2\u00b3 factorial DOE varying dose, D-step, and lens configuration to characterize LaserWriter lithography resolution limits; analyzed main effects and interactions in JMP to identify optimal process parameters.",
            "Characterized thin-film aluminum deposition, lift-off, and wet etch process sequences using profilometry; quantified film thickness, uniformity, etch rates, and edge fidelity across process conditions to assess repeatability and parameter sensitivity.",
            "Operated cleanroom equipment including mask aligners (SUSS MJB4), thermal evaporation systems, and wet processing stations; followed ISO safety protocols for solvent handling and substrate preparation.",
            "Executed multilayer lithography alignment workflows; quantified overlay error and evaluated process trade-offs between mask alignment and direct-write methods for multilayer device fabrication.",
          ],
          ds: [
            "Designed and executed a full 2\u00b3 factorial DOE on lithography parameters; analyzed main effects and two-way interactions in JMP to identify dominant drivers of pattern fidelity.",
            "Quantified process metrics (linewidth, film thickness, overlay error) via profilometry and optical metrology; applied statistical analysis to characterize parameter sensitivity across process conditions.",
          ],
        },
      },
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
            "Designed and executed randomized full 2\u00b3 factorial DOE varying dose, D-step, and lens configuration to characterize LaserWriter resolution limits.",
            "Measured linewidth and feature depth via profilometry; analyzed main effects and interactions in JMP to identify parameter regimes maximizing pattern fidelity."
          ],
          blurb: "Characterized lithographic resolution limits using a full 2\u00b3 factorial DOE on LaserWriter parameters.",
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
      title: "Electronics Laboratory",
      date: "2026-03-11",
      categories: ["cs", "ds", "nanofab", "electronics"],
      tags: ["Circuit Analysis", "Instrumentation", "Analog Electronics", "Optoelectronics"],
      tools: [
        "Oscilloscope",
        "Function Generator",
        "Power Supplies",
        "Fluke 179 Multimeter",
        "Capacitance / Inductance Meters",
        "Optical Power Meter",
        "Spectrometer",
        "Proto-boards"
      ],
      descriptions: {
        cv: [
          "Built and characterized resistive, capacitive, and inductive networks; implemented voltage dividers and RC filters; measured time-domain response and frequency dependence using oscilloscopes and function generators.",
          "Analyzed impedance, reactance, and resonance in RLC systems; characterized diode I\u2013V behavior, Zener behavior, and transistor current amplification.",
          "Performed optoelectronic measurements including photodiode I\u2013V characterization, LED optical power vs current, and laser diode operation using a constant-current driver with optical power and spectral measurements.",
        ],
        resume: {
          process: [
            "Built and characterized resistive, capacitive, and inductive circuits; measured impedance, resonance, and time-domain response using oscilloscopes and function generators.",
            "Characterized diode, transistor, and optoelectronic device behavior from I\u2013V measurements; operated optical power meters and spectrometers for device characterization.",
          ],
          ds: null,
        },
      },
      blurb:
        "Hands-on electronics laboratory covering circuit fundamentals, instrumentation, and device characterization including RC dynamics, impedance, resonance, diode I\u2013V behavior, transistor amplification, and optoelectronic measurements.",
      details:
        "Completed a full electronics laboratory obstacle course focused on practical circuit construction and measurement discipline. Built and characterized resistive, capacitive, and inductive networks; implemented voltage dividers and RC filters; measured time-domain response and frequency dependence using oscilloscopes and function generators; and analyzed impedance, reactance, and resonance in RLC systems.\n\nAdditional work included diode I\u2013V characterization, Zener behavior, transistor current amplification (TIP31C), and operational amplifier circuits including inverting, non-inverting, and buffer configurations. Investigated instrumentation loading effects and impedance matching.\n\nOptoelectronic experiments included photodiode I\u2013V characterization under varying illumination, LED optical power vs current measurements, and laser diode operation using a constant-current driver with optical power and spectral measurements.\n\nThe laboratory emphasized rigorous measurement workflows, circuit modeling intuition, and connections between electronic instrumentation and physical device behavior relevant to experimental physics and microdevice characterization.",
      image: "images/electronics_1.jpg",
      images: [
        "images/electronics_1.jpg",
        "images/electronics_2.jpg",
        "images/electronics_3.jpg",
        "images/electronics_4.jpg",
        "images/electronics_5.jpg",
      ],
      links: [],
    },

    {
      kind: "lab",
      title: "CAHOOTS Applied Data Science Lab",
      date: "2024-06-15",
      categories: ["ds", "cs"],
      tags: ["Data Science", "Program Evaluation", "Labs"],
      tools: ["Python", "pandas", "Visualization"],
      descriptions: {
        cv: [
          "Built reproducible Python/pandas pipeline for cleaning and analyzing 50,000+ police CAD dispatch records related to mental health crisis response.",
          "Quantified temporal/spatial trends and produced stakeholder-facing visualizations supporting operational program evaluation (Eugene, OR).",
        ],
        resume: {
          ds: [
            "Built reproducible Python/pandas pipeline to clean and analyze 50,000+ police CAD dispatch records; engineered features to quantify temporal and spatial trends in crisis-response operations.",
            "Produced stakeholder-facing visualizations and analytical summaries for program evaluation; translated complex dispatch data into actionable operational insights for community stakeholders (White Bird Clinic).",
          ],
          process: [
            "Built reproducible data pipeline for cleaning and analyzing 50,000+ operational records; maintained structured documentation and produced clear summaries for stakeholder program evaluation.",
          ],
        },
      },
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
      descriptions: {
        cv: [
          "Developed offline-first mobile application (Python/Kivy + SQLite) integrating GPS route logging with environmental data ingestion for fishing performance analytics.",
          "Implemented ETL + data model linking catches to location/time/weather conditions, enabling historical query, trend analysis, and decision support.",
        ],
        resume: {
          ds: [
            "Developed offline-first mobile application (Python/Kivy) integrating GPS route logging and real-time NOAA environmental data ingestion for fishing performance analytics.",
            "Designed and implemented SQLite data model linking catch records to location, time, and weather conditions; enabled historical trend analysis and data-driven decision support.",
          ],
          process: null,
        },
      },
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
      descriptions: {
        cv: [
          "Analyzed 900,000+ e-commerce sessions using SQL/BigQuery and R (tidyverse); engineered behavioral and temporal features for marketing attribution.",
          "Built and evaluated logistic regression models to predict purchase propensity/high-value customers; translated results into campaign-timing and targeting recommendations.",
        ],
        resume: {
          ds: [
            "Analyzed 900,000+ e-commerce sessions using SQL/BigQuery and R; engineered behavioral and temporal features for marketing attribution and customer segmentation.",
            "Built and evaluated logistic regression models to predict purchase propensity and high-value customer behavior; translated model outputs into campaign-timing and audience-targeting recommendations.",
          ],
          process: null,
        },
      },
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
      descriptions: {
        cv: [
          "Integrated NOAA buoy and airport datasets; engineered directional and seasonal features to model hazardous wave regimes and safe/unsafe classifications.",
          "Built Ridge regression model with PCA-based dimensionality reduction; reduced false negatives by 23% vs baseline heuristics and produced interpretable safety workflow.",
        ],
        resume: {
          ds: [
            "Integrated multi-source NOAA buoy and airport weather datasets; engineered directional and seasonal features to model hazardous wave regimes and binary safety classifications.",
            "Built Ridge regression model with PCA-based dimensionality reduction; reduced false negatives by 23% vs baseline heuristics and produced an interpretable go/no-go safety decision workflow.",
          ],
          process: null,
        },
      },
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
      descriptions: {
        cv: [
          "Built constraint optimization model (Python + OR-Tools) automating RA on-call scheduling under 8+ fairness and coverage constraints.",
          "Produced feasible schedules for 12 teams; estimated 750+ administrative hours saved annually while maintaining policy compliance and equitable assignments.",
        ],
        resume: {
          ds: [
            "Built constraint optimization model (Python + OR-Tools) automating RA on-call scheduling across 12 teams under 8+ fairness and coverage constraints.",
            "Generated policy-compliant, equitable schedules in seconds; estimated 750+ administrative hours saved annually through algorithmic scheduling.",
          ],
          process: null,
        },
      },
      blurb:
        "Developed a model to automate RA on-call scheduling under 8+ fairness constraints; designed for 12 teams with projected 750+ hours saved yearly.",
      details:
        "Designed and implemented a constraint optimization model to automate the scheduling of Resident Assistant (RA) on-call shifts across 12 teams. The model incorporates a comprehensive set of constraints reflecting university policies, fairness considerations, and coverage requirements, including:\n\n- Maximum shift limits per RA\n- Fair distribution of weekend and holiday shifts\n- Coverage requirements for each time slot\n- Avoidance of back-to-back shifts\n- Accommodations for known unavailability\n\nUsing Python and Google's OR-Tools, the model generates feasible schedules that satisfy all constraints while optimizing for equitable shift distribution. Initial testing indicates that the automated scheduler can produce compliant schedules in seconds, with an estimated annual time savings of 750+ administrative hours compared to manual scheduling processes.",
      image: "images/scheduler_1.png",
      images: ["images/scheduler_1.png", "images/scheduler_2.png", "images/scheduler_3.png"],
      imageAlt: "Scheduler results",
      links: [],
    },

    {
      kind: "project",
      title: "Superconductor Critical Temperature Modeling",
      date: "2026-03-12",
      categories: ["ds", "cs"],
      tags: ["Data Science", "Machine Learning", "Materials Data"],
      tools: ["Python", "pandas", "scikit-learn", "PCA", "Random Forest", "Matplotlib"],
      descriptions: {
        cv: [
          "Analyzed a dataset of 21,000+ superconducting materials using compositional descriptors derived from elemental properties.",
          "Applied dimensionality reduction (PCA) and K-Means clustering to identify structure in materials feature space and isolate regions containing high-temperature superconductors.",
          "Trained Random Forest regression model to predict superconducting critical temperature (Tc), achieving strong predictive alignment between observed and predicted values.",
          "Evaluated feature importance to identify dominant compositional predictors, highlighting thermal conductivity variation and electronic structure descriptors as key correlates of Tc.",
        ],
        resume: {
          ds: [
            "Analyzed 21,000+ superconducting compounds using PCA-based dimensionality reduction and K-Means clustering to identify compositional structure in a high-dimensional materials feature space.",
            "Trained a Random Forest regression model to predict superconducting critical temperature (Tc); identified thermal conductivity variation and electronic structure descriptors as dominant compositional predictors via feature importance analysis.",
          ],
          process: [
            "Analyzed a dataset of 21,000+ superconducting materials using compositional and elemental property descriptors; applied PCA and clustering to identify structure-property relationships across the materials feature space.",
            "Applied statistical analysis and feature importance evaluation to identify dominant property predictors of critical temperature; screened data for anomalies and outliers to validate model reliability.",
            "Demonstrated ability to extract interpretable process-property relationships from high-dimensional materials datasets using machine learning; communicated findings clearly through visualizations and structured analysis.",
          ],
        },
      },
      blurb:
        "Machine learning analysis of superconducting materials using compositional descriptors to explore structure in materials space and predict critical temperature.",
      details:
        "This project analyzes a large superconducting materials dataset containing over 21,000 compounds with features derived from elemental properties such as thermal conductivity, atomic mass, density, and valence electron structure.\n\nThe analysis combines unsupervised and supervised learning methods to explore structure in the materials feature space and evaluate whether compositional descriptors can predict superconducting critical temperature (Tc).\n\nDimensionality reduction using Principal Component Analysis (PCA) revealed clear structure in the feature space, while K-Means clustering separated materials into distinct compositional groups. When high-temperature superconductors were highlighted, they concentrated strongly within one region of this space, suggesting that certain combinations of elemental properties are associated with elevated Tc.\n\nA Random Forest regression model was then trained to predict Tc from the compositional descriptors. Predicted temperatures closely followed observed values across the dataset, demonstrating that machine learning models can capture meaningful relationships between elemental properties and superconducting behavior.\n\nFeature importance analysis identified the range and weighted mean of thermal conductivity among constituent elements as dominant predictors, alongside descriptors related to atomic mass, density, and electronic structure. These results suggest that variations in thermal transport properties and electronic configuration are strongly associated with superconducting critical temperature within the dataset.",
      image: "images/superconductor_ml_1.png",
      images: [
        "images/superconductor_ml_1.png",
        "images/superconductor_ml_2.png",
        "images/superconductor_ml_3.png"
      ],
      imageAlt: "Machine learning analysis of superconducting materials and critical temperature prediction",
      links: [
        { label: "Code", url: "https://github.com/Elijah-Andrae56/Superconductor_ML_Analysis.git" }
      ],
    },
    {
      kind: "project",
      title: "Mathematical Rigor & Analytical Evaluation",
      date: "2025-06-01",
      categories: ["ds", "cs"],
      tags: ["Applied Mathematics", "Cryptography", "Linear Algebra"],
      tools: ["LaTeX", "Matrix Methods", "Stochastic Processes", "Proof Validation"],
      descriptions: {
        cv: [
          "Evaluated advanced mathematics assignments, providing detailed analytical feedback for proof-writing, matrix methods, and cryptographic reasoning.",
          "Validated complex stochastic models, linear algebra proofs, and encryption algorithms for technical accuracy and logical soundness."
        ],
        resume: {
          ds: [
            "Evaluated proof-writing, matrix methods, and cryptographic reasoning in Linear Algebra and Mathematical Cryptography; provided detailed feedback to support student learning.",
          ],
          process: [
            "Evaluated complex mathematical models and proofs in advanced coursework including Linear Algebra, Cryptography, and Stochastic Processes.",
            "Demonstrated high-level quantitative rigor by identifying logical and computational errors in matrix operations and abstract mathematical structures."
          ]
        },
      },
      blurb:
        "Evaluated advanced university mathematics coursework, demonstrating a deep foundation in the theoretical mechanics—including linear algebra and stochastic processes—that power physical modeling and data science.",
      details:
        "Serving as a Mathematics Paper Marker requires more than just checking answers; it requires reverse-engineering a student's logical process to find the exact point of failure in complex, multi-step proofs.\n\nMy evaluation work covered Mathematical Cryptography and Linear Algebra, requiring fluency in abstract mathematical structures, matrix operations, and rigorous proof writing. This theoretical foundation directly translates to my engineering work: the same matrix operations evaluated in these courses are the engine behind the dimensionality reduction (PCA) and regression models I deploy for materials characterization and process optimization.\n\nCoupled with my coursework in Stochastic Processes and Multivariable Calculus, this background ensures that the statistical tools and experimental designs (DOE) I utilize in the lab are mathematically sound, not just computationally executed.",
      links: [],
    },
    {
      kind: "lab",
      title: "Optical Systems & Interferometry Laboratory",
      date: "2025-05-01", // Adjust to the actual month/year you took this course
      categories: ["process", "physics"],
      tags: ["Optics", "Laser Alignment", "Interferometry", "Hardware Characterization"],
      tools: ["HeNe Lasers", "Oscilloscopes", "Thorlabs Optomechanics", "Photodetectors", "Waveplates", "Interferometers"],
      descriptions: {
        cv: [
          "Built and aligned complex free-space optical systems, including Michelson interferometers and Fabry-Perot cavities, to measure refractive indices, coherence length, and cavity finesse.",
          "Characterized Gaussian laser beam profiles, polarization states, and photodiode rise times using translation stages, optical choppers, and oscilloscopes.",
          "Constructed functional optical isolators using quarter waveplates and polarizing beamsplitters, ensuring strict beam containment and alignment."
        ],
        resume: {
          ds: [
            "Analyzed optical signal data and photodiode rise times using oscilloscopes to characterize hardware response rates.",
            "Modeled and simulated Fabry-Perot cavity properties (Finesse, Free Spectral Range) to validate physical benchtop measurements."
          ],
          process: [
            "Engineered and aligned complex free-space optical systems, including Michelson interferometers and Fabry-Perot cavities, utilizing Thorlabs optomechanics.",
            "Characterized physical system properties including Gaussian beam profiles (Rayleigh range, 1/e width), polarization states, and photodetector rise-times.",
            "Executed rigorous optical cleaning, handling, and safety protocols for precision lenses, waveplates, and beamsplitter cubes."
          ]
        },
      },
      blurb:
        "Designed, built, and characterized precision free-space optical systems—including interferometers and Fabry-Perot cavities—using Thorlabs optomechanics and HeNe lasers.",
      details:
        "Completed an intensive, self-directed optics course focused on the rigorous alignment and characterization of free-space optical systems. Work involved setting up and aligning HeNe lasers, measuring Gaussian beam profiles (1/e width, Rayleigh range) using translation stages, and manipulating polarization states utilizing waveplates and Brewster's angle mechanics.\n\nAdvanced modules required independent troubleshooting and system design, including constructing a Michelson interferometer to measure the refractive index of unknown materials and building Fabry-Perot cavities to analyze free spectral range (FSR) and cavity finesse. Additional hardware characterization included measuring small and large photodiode rise-times using optical choppers and oscilloscopes, and constructing functional optical isolators to protect source lasers from retroreflections.",
      links: [],
    },
  ],

  experience: [
    {
      title: "Resident Assistant",
      track: "industry",
      meta: "University of Oregon Housing - Eugene, OR | Sept 2023 to Present",
      bullets: [
        "Mentored and supported 180+ students in dormitory housing; provided conflict mediation, academic guidance, and day-to-day support.",
        "Delivered on-call first-response assistance during medical, wellness, and facilities incidents; coordinated with professional staff and emergency services.",
        "Conducted safety inspections, policy education, and incident documentation to ensure adherence to university standards.",
        "Led community programming focused on engagement, well-being, and resource accessibility.",
      ],
      resumeBullets: {
        ds: [
          "Managed operations for 180+ person residential community; documented incidents and maintained accurate records in coordination with professional staff.",
          "Collaborated cross-functionally with housing, facilities, and emergency services to resolve operational issues and implement community programs.",
        ],
        process: [
          "Enforced safety protocols and conducted regular inspections across a 180+ person facility; documented incidents and coordinated corrective action with professional staff and emergency services.",
          "Responded to on-call medical, safety, and facilities incidents; communicated status clearly and escalated appropriately to maintain safe operations.",
          "Collaborated cross-functionally with housing, facilities, and emergency services teams to identify and implement viable solutions to operational issues.",
        ],
      },
    },
    {
      title: "Learning Assistant - Applied Data Science for Social Justice",
      track: "academic",
      domains: ["ds", "cs", "nanofab"],
      meta: "University of Oregon - Eugene, OR | Apr 2025 to Jun 2025",
      bullets: [
        "Facilitated lab sessions and office hours; guided students through cleaning, visualization, and analysis of CAHOOTS dispatch logs.",
        "Coached analytical storytelling and partner-facing presentations for community stakeholders (White Bird Clinic).",
        "Provided individualized technical support in Python/pandas workflows for reproducible, impact-oriented insights.",
      ],
      resumeBullets: {
        ds: [
          "Facilitated lab sessions and office hours guiding students through Python/pandas data cleaning, visualization, and statistical analysis workflows.",
          "Coached analytical storytelling and technical communication for stakeholder presentations; provided individualized mentorship in reproducible data science.",
        ],
        process: [
          "Guided students through technical data analysis workflows; provided individualized mentorship and supported clear documentation of analytical methods and results.",
        ],
      },
    },
    {
      title: "Social Media Analytics and Marketing Intern",
      track: "industry",
      domains: ["ds", "marketing"],
      meta: "Humes - Waterford, PA | Jun 2023 to Aug 2023",
      bullets: [
        "Increased organic reach by 117% within three weeks by analyzing engagement metrics and optimizing cadence in Meta Business Suite.",
        "Conducted competitive content analysis and audience segmentation to refine messaging strategy and improve engagement consistency.",
      ],
      resumeBullets: {
        ds: [
          "Increased organic social reach by 117% in three weeks by analyzing engagement metrics and optimizing posting cadence in Meta Business Suite.",
          "Conducted competitive content analysis and audience segmentation to refine messaging strategy and improve engagement consistency.",
        ],
        process: null,
      },
    },
    {
      title: "Mathematics Paper Marker",
      track: "academic",
      domains: ["ds", "cs", "nanofab"],
      meta: "University of Oregon - Eugene, OR | Jun 2025 to Present",
      bullets: [
        "Evaluated assignments and provided detailed feedback to support proof-writing, matrix methods, and cryptographic reasoning.",
        "Collaborated with instructors to maintain grading accuracy, rubric adherence, and timely feedback delivery.",
      ],
      resumeBullets: {
        ds: [
          "Evaluated proof-writing, matrix methods, and cryptographic reasoning in Linear Algebra and Mathematical Cryptography; provided detailed feedback to support student learning.",
        ],
        process: null,
      },
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
        "Multivariable Calculus I and II",
        "Statistical Methods",
        "Statistics for Data Science",
        "Stochastic Processes",
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
      bullets: ["Nanofabrication", "Analog Electronics Independent Study", "Optics Independent Study", "Microfluidics Research"],
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
        "Relevant coursework: Machine Learning, Probability and Statistics, Linear Algebra, Differential Equations, Nanofabrication, Stochastic Processes",
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
