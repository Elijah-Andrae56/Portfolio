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
      process: "Process-focused engineer with hands-on cleanroom nanofabrication experience and a formal design-of-experiments foundation. Ran five randomized factorial DOEs (2³-2⁴) and a 12-level dose-response study in a single term, 60+ designed runs across thermal oxidation, spin coating, deposition, and lithography, all designed, blocked, and analyzed in JMP. Experienced operating precision process and metrology tools, performing measurement systems analysis to separate tool effects from process effects, and documenting work to SOP standard.",
      ds: "Data scientist with applied experience in predictive modeling, statistical inference, and end-to-end analytical pipelines across research, business, and public-sector work. Skilled in Python (pandas, scikit-learn), R, and SQL across regression, classification, PCA, and clustering. Unusually deep design-of-experiments background: five randomized factorial designs (2³-2⁴) plus a 12-level dose-response study analyzed in JMP, covering blocking, reduced-model selection, residual diagnostics, and multi-response optimization.",
    },
  },

  highlights: [
    "Designed and analyzed five randomized factorial DOEs (2\u00b3-2\u2074) plus a 12-level dose-response study in a single term: 60+ designed runs across oxidation, deposition, spin coating, and lithography, blocked on tool, instrument, and lab section",
    "Reduced-model analysis in JMP: main effects and interactions, response transformations, residual and normality diagnostics, and multi-response desirability optimization with 95% confidence intervals",
    "Cleanroom microfabrication: photolithography, thermal oxidation, thin-film deposition, lift-off and wet etch, multilayer alignment, metrology (Dektak, ellipsometry, reflectometry)",
    "Measurement systems analysis across reflectometers, ellipsometer, profilometer, and crystal monitors; isolated a tool-level block effect that dominated a deposition model",
  ],

  skills: [
    {
      title: "Statistical and ML Methods",
      domains: ["ds", "marketing", "nanofab"],
      items: [
        "Regression (SLR/MLR, Ridge/Lasso)",
        "Classification (logistic, KNN, random forests)",
        "PCA and clustering",
        "Inference (ANOVA, t-tests, chi-square, bootstrap)",
        "A/B testing and hypothesis testing",
        "Model evaluation and cross-validation",
      ],
    },
    {
      title: "Programming and Tools",
      domains: ["cs", "ds", "nanofab"],
      items: [
        "Python (pandas, NumPy, scikit-learn)",
        "R (tidyverse)",
        "SQL",
        "JMP",
        "Excel, Tableau",
        "Git/GitHub, Bash, LaTeX",
      ],
    },
    {
      title: "Analytics and Experimentation",
      domains: ["ds", "nanofab", "marketing"],
      items: [
        "DOE: full factorial (2³/2⁴), screening, and dose-response designs in JMP",
        "Randomization, blocking, and replication strategy",
        "Reduced-model selection and interaction modeling",
        "Residual diagnostics and response transformations (log, Box-Cox)",
        "Post-hoc comparison (Tukey HSD, Fisher LSD) and equality-of-variance testing",
        "Prediction profilers and multi-response desirability optimization",
        "Measurement systems analysis and instrument agreement testing",
      ],
    },
    {
      title: "Communication and Leadership",
      items: [
        "Technical writing and SOP authorship",
        "Stakeholder presentations",
        "Cross-functional collaboration",
        "Mentorship and instruction",
      ],
    },
    {
      title: "Nanofabrication and Lab Techniques",
      domains: ["nanofab"],
      items: [
        "ISO cleanroom operations, solvent handling, UV-ozone clean",
        "Photolithography (spin coat, bakes, mask alignment, direct-write, develop, dose optimization)",
        "Thermal oxidation and thin-film deposition (thermal evaporation, e-beam, lift-off)",
        "Wet etch and pattern transfer",
        "Metrology (stylus profilometry, ellipsometry, reflectometry, optical microscopy)",
        "Multilayer alignment and overlay measurement",
      ],
    },
  ],

  pipeline: [
    {
      id: "engineering",
      stage: "01",
      role: "Build",
      title: "Engineering",
      deck: "Physical systems, fabricated, measured, and characterized in the lab.",
      groups: [
        {
          name: "Nanofabrication",
          items: [
            "ISO cleanroom operations",
            "Photolithography (spin coat, bakes, alignment, dose)",
            "Thin-film processing (thermal evap, e-beam, lift-off, etching)",
            "Multilayer alignment",
            "Substrate prep, UV-ozone cleaning",
            "Process development, yield optimization",
          ],
        },
        {
          name: "Optics & Metrology",
          items: [
            "Free-space optical alignment",
            "Interferometry (Michelson, Fabry-Perot)",
            "Polarization & beam profiling",
            "Dektak, ellipsometry, reflectometry",
            "Optical microscopy",
          ],
        },
        {
          name: "Electronics & Instrumentation",
          items: [
            "Keithley 2450 SMU",
            "Oscilloscopes & photodetectors",
            "Semiconductor probe station",
            "Analog signal conditioning",
            "Microcontroller prototyping (Arduino)",
            "DAQ & instrument control",
          ],
        },
        {
          name: "Design & CAD",
          items: [
            "KLayout, CLEWin (mask design)",
            "AutoCAD, Fusion 360",
            "Process flow documentation",
          ],
        },
      ],
    },
    {
      id: "data",
      stage: "02",
      role: "Model",
      title: "Data Science",
      deck: "Code, statistics, and machine learning that turn experiments into models.",
      groups: [
        {
          name: "Programming & Tooling",
          items: [
            "Python (pandas, NumPy, scikit-learn, Matplotlib)",
            "R (tidyverse)",
            "SQL, Bash, LaTeX",
            "Git / GitHub",
            "Jupyter, RMarkdown",
          ],
        },
        {
          name: "Statistics & Inference",
          items: [
            "Regression (SLR / MLR)",
            "Logistic, Ridge / Lasso",
            "ANOVA, t-tests, chi-square",
            "Bootstrap, A/B testing, KS tests",
            "Time-series summarization",
          ],
        },
        {
          name: "Machine Learning",
          items: [
            "Classification (KNN, Random Forests, Gradient Boosting)",
            "PCA & clustering",
            "Neural networks (MLP, CNN)",
            "Hyperparameter tuning, cross-validation",
            "Feature engineering",
            "Model evaluation",
          ],
        },
        {
          name: "Mathematical Foundations",
          items: [
            "Linear algebra (Math 341)",
            "Mathematical modeling (Math 343)",
            "Cryptography (Math 458)",
            "Markov chains, stochastic processes",
          ],
        },
      ],
    },
    {
      id: "analytics",
      stage: "03",
      role: "Decide",
      title: "Analytics & Strategy",
      deck: "Experimental design, decision analytics, and communication that close the loop.",
      groups: [
        {
          name: "Experimental Design",
          items: [
            "DOE (full & fractional factorials)",
            "Process optimization",
            "Interaction modeling",
            "Instrument validation",
            "Multivariate analysis",
            "Train / validation strategy",
          ],
        },
        {
          name: "Decision Analytics",
          items: [
            "Marketing & operational analytics",
            "Sentiment analysis",
            "Predictive modeling for decisions",
            "A/B testing",
          ],
        },
        {
          name: "Analytical Tooling",
          items: [
            "JMP, SPSS",
            "Excel, Tableau",
            "Google Cloud (analytics + ETL)",
            "Meta Business Suite",
          ],
        },
        {
          name: "Communication & Leadership",
          items: [
            "Technical writing",
            "Stakeholder presentations",
            "Cross-functional collaboration",
            "Instructional support & mentorship",
            "Project scoping",
            "Results translation",
          ],
        },
      ],
    },
  ],

  // Unified portfolio surface (Research + Labs + Projects)
  cards: [
    {
      kind: "research",
      featured: true,
      title: "Electrochemical Microbubble Devices: Fabrication, Characterization, and Stochastic Signal Applications",
      org: "Independent Research, Alemán Lab, University of Oregon",
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
            "Designed and fabricated multilayer electrochemical microdevices end to end: photolithographic patterning, thin-film metal deposition and lift-off, SU-8 mold processing, and PDMS channel integration on glass.",
            "Built a repeatable characterization protocol on a Keithley 2450 and semiconductor probe station, mapping nucleation thresholds, current response, and field-dependent activation across device geometries.",
            "Quantified trial-to-trial process variability across multi-trial datasets; maintained trial logs, measurement records, and reproducibility assessments that drove iterative device redesign.",
          ],
          ds: [
            "Built a programmable acquisition framework for voltage-stepped electrochemical experiments, automating event timing, current-trace logging, and reaction-state labeling into structured datasets.",
            "Modeled bubble nucleation as a stochastic first-event process; characterized nucleation probability and wait-time distributions as functions of applied voltage and device geometry.",
          ],
        },
      },
      blurb:
        "Research platform centered on electrochemical microbubble generation in microfluidic devices, spanning full-stack fabrication, semiconductor-style electrical characterization, automated measurement design, and stochastic modeling for actuation, neuromorphic, and entropy-source applications.",
      details:
        "This project has been reframed from a single application-specific random-number generator build into a broader device-physics and characterization effort focused on electrochemical microbubble generation in microfluidic systems.\n\nPrototype fabrication is active and the project is now centered on repeatable characterization, automated data collection, physically interpretable modeling, and iterative device redesign based on measured failure modes, threshold behavior, and reproducibility limits. The subsections below cover the fabrication stack, the characterization and modeling workflow, and where the platform is headed.",
      image: "images/microfluidic_electrolysis_1.jpg",
      images: [
        "images/microfluidic_electrolysis_1.jpg",
        "images/microfluidic_electrolysis_3.jpg",
        "images/microfluidic_electrolysis_4.jpg",
        "images/microfluidic_electrolysis_5.jpg",
        "images/microfluidic_electrolysis_6.jpg"
      ],
      imageAlt: "Electrochemical microbubble microfluidic device and characterization workflow",
      modules: [
        {
          title: "Device Design and Fabrication",
          tools: ["Photolithography", "Thin-film deposition", "Lift-off", "SU-8 molds", "PDMS soft lithography"],
          bullets: [
            "Built a multilayer glass-based microfluidic device stack combining patterned aluminum electrodes, dielectric insulation, and PDMS channel structures formed from SU-8 molds.",
            "Ran the full fabrication workflow: substrate cleaning, lithographic patterning, metal deposition and lift-off, insulating layer definition, mold fabrication, and PDMS integration.",
            "Focused design work on electrode geometry, gap spacing, alignment strategy, insulation openings, and channel architecture so that bubble generation can be studied as a controlled physical phenomenon rather than a one-off demonstration.",
          ],
          blurb: "Multilayer glass device stack: patterned Al electrodes, dielectric insulation, and PDMS channels from SU-8 molds.",
        },
        {
          title: "Characterization, Instrumentation, and Modeling",
          tools: ["Keithley 2450", "Semiconductor probe station", "Optical microscopy", "Python"],
          bullets: [
            "Developed characterization methods for nucleation and gas-generation behavior using a Keithley 2450, semiconductor probe station, and microscope-based video measurement.",
            "Wrote structured trial protocols for identifying safe operating windows, threshold behavior, gap dependence, drift and conditioning effects, and optional current-controlled operation.",
            "Logged voltage, compliance, baseline current, steady current, reaction class, and first-event time per trial, with video-linked records for reproducibility.",
            "Modeled bubble nucleation as a stochastic first-event process, connecting current-voltage behavior to nucleation probability, wait-time distributions, and field-dependent activation behavior.",
          ],
          blurb: "Semiconductor-style electrical characterization plus stochastic first-event modeling of nucleation.",
        },
        {
          title: "Application Directions",
          tools: ["Microfluidic actuation", "Stochastic device concepts", "Entropy characterization"],
          bullets: [
            "The same physical platform can be reframed for multiple applications, which is what makes the characterization work worth doing carefully rather than to a single spec.",
            "Directions under consideration include low-cost electrochemical microbubble actuation for microfluidic pumping, stochastic device concepts built on a probabilistic activation curve, and entropy-source studies where randomness is quantified statistically rather than assumed.",
          ],
          blurb: "One platform, several device directions - actuation, stochastic elements, and quantified entropy sources.",
        },
      ],
      links: [],
    },

    {
      kind: "lab",
      title: "Nanofabrication Cleanroom Labs (PHYS 495) - DOE-Driven Process Development",
      priority: 10,
      org: "PHYS 495 Nanofabrication, University of Oregon",
      date: "2025-12-01",
      categories: ["nanofab", "ds"],
      tags: ["Nanofab", "Cleanroom", "DOE", "Factorial Design", "Metrology", "JMP"],
      tools: [
        "JMP (DOE / screening designs)",
        "Lindberg tube furnace",
        "Laurell spin coater",
        "Angstrom Covap thermal evaporator",
        "S\u00fcss MJB4 mask aligner",
        "Microtech LaserWriter",
        "Filmetrics F20/F40 reflectometry",
        "Woollam ellipsometry",
        "Bruker Dektak profilometry",
        "UV-ozone / O2 plasma",
        "Wet etch and lift-off",
      ],
      descriptions: {
        cv: [
          "DOE scale: designed, executed, and analyzed five randomized factorial experiments (two 2\u2074 and three 2\u00b3 designs) plus a 12-level dose-response design in a single term, spanning 60+ designed runs across oxidation, spin coating, evaporation, and lithography; all designs generated, randomized, blocked, and modeled in JMP.",
          "Lab B - Thermal oxidation (2\u2074, 16 runs): varied oxidant, temperature (900/1100 \u00b0C), time (40/160 min), and N2 flow; built reduced categorical models of oxide thickness from 10-point reflectometry maps, identified oxidant and temperature as dominant effects, and predicted maximum growth of 703 nm (95% CI [489, 917] nm).",
          "Lab B - Spin-coat resist (2\u2074, 16 runs): self-generated screening design on acceleration, final spin speed, spin time, and initial dispense coverage; modeled mean thickness, thickness standard deviation, and % coverage, applying a log10 transform to normalize variance residuals and testing instrument-block survival against pooled class data.",
          "Lab C - Thermal evaporation (2\u00b3): varied chip location, stage rotation, and deposition rate for 100 nm Al depositions; a Y\u00b2-transformed thickness model reached R\u00b2 = 0.97 and isolated deposition rate plus two interactions. On pooled class data the evaporator block dominated the model, and the effect was traced to crystal-monitor drift on one tool.",
          "Lab D - Lithography dose response: ran a randomized 12-level dose test (35-200 mJ/cm\u00b2) on a S\u00fcss MJB4, extracted D0, D100, and resist contrast (\u03b3 \u2248 3.3) from the contrast curve, and recommended a 115 mJ/cm\u00b2 process dose; repeated dose profiling across three LaserWriter objective lenses (50-250 mJ/cm\u00b2) and tested lens-to-lens agreement by ANOVA.",
          "Lab E - Resolution and pattern transfer (2\u00b3, 10 response variables): mapped D-step, dose, and lens against the width and depth of 1, 2, 4, and 8 \u00b5m lines, then used multi-response desirability optimization to select D-step 12, 200 mJ/cm\u00b2, and lens 5; transferred 100 nm Al by both lift-off (96.3 \u00b1 2.3 nm) and Transene Type-A wet etch (96.8 \u00b1 1.4 nm) and compared edge fidelity between routes.",
          "Lab F - Layer registration: built aligned multilayer Cr/Au and Al structures through a PMGI/AZ bilayer lift-off process, registering layers with both S\u00fcss MJB4 hard-mask alignment and LaserWriter A/B fiducial alignment; verified overlay accuracy by optical microscopy and Dektak marker mapping.",
          "Measurement systems analysis: cross-validated Filmetrics F20, F40, and Woollam ellipsometer thickness readings by paired-comparison testing and multivariate correlation (best pair r = 0.9999), and checked stylus profilometry against both reflectometry (p = 0.454) and deposition crystal-monitor readings.",
          "Lab A - Cleanroom qualification: authored and passed review on 11 SOPs covering cleanroom entry and PPE, solvent handling, wafer scribing and die storage, fume-hood verification, sonication, and O2 plasma etching to earn independent tool access.",
          "Lab \u03b1 - DOE methods: completed a JMP-based design-of-experiments sequence covering ANOVA, Tukey HSD and Fisher LSD post-hoc comparisons, residual and normality diagnostics (Shapiro-Wilk, Anderson-Darling), and equality-of-variance testing (Levene, Brown-Forsythe, Bartlett) applied to semiconductor process data including plasma-etch uniformity and photoresist bake temperature.",
        ],
        resume: {
          process: [
            "Designed, ran, and analyzed five randomized factorial experiments (two 2⁴, three 2³) plus a 12-level dose-response study in a single term: 60+ designed runs across thermal oxidation, spin coating, thermal evaporation, and lithography, all generated, randomized, and blocked in JMP.",
            "Built reduced categorical models with residual diagnostics and Box-Cox/log transforms (R² up to 0.99); used prediction profilers and multi-response desirability optimization to recommend factor settings against thickness, resolution, and minimum-variance targets with 95% confidence intervals.",
            "Performed measurement systems analysis across reflectometry, ellipsometry, stylus profilometry, and deposition crystal monitors; isolated a tool-level block effect that dominated a deposition model and traced it to crystal-monitor drift on one of two evaporators.",
            "Operated tube furnace, spin coater, thermal evaporator, Süss MJB4 mask aligner, Microtech LaserWriter, and wet etch and lift-off benches; authored 11 reviewed SOPs to qualify for independent tool access.",
          ],
          ds: [
            "Designed and analyzed five randomized factorial experiments (2\u00b3-2\u2074) plus a 12-level dose-response study in JMP: 60+ runs with blocking, randomization, reduced-model selection, and residual diagnostics.",
            "Applied response transformations (log10, Box-Cox), ANOVA with Tukey HSD post-hoc testing, and multi-response desirability optimization to recommend operating conditions with 95% confidence intervals; best-fitting models reached R\u00b2 = 0.99.",
          ],
        },
      },
      blurb:
        "A full term of cleanroom process development run as a connected DOE program: five randomized factorial designs (2\u00b3-2\u2074) plus a 12-level dose-response study, 60+ designed runs, blocked across tools and lab sections, with reduced-model analysis and instrument cross-validation in JMP.",
      details:
        "PHYS 495 Nanofabrication treats the cleanroom as a statistics problem: every process module is entered as a randomized, blocked factorial design in JMP, executed on real tools, measured with 10-point metrology maps, and reduced to a model whose factors, interactions, and residuals have to survive diagnostics before any process recommendation is made.\n\nOver the term this produced five factorial designs (two 2\u2074 and three 2\u00b3), a 12-level dose-response design, and a set of lens-by-lens dose profiles - roughly 60 designed runs and several hundred point-level thickness measurements. Designs were blocked on lab section, deposition tool, and metrology instrument, and each experiment was analyzed twice: once on group data and once on pooled class data, so that block-factor survival became its own diagnostic. In Lab C that diagnostic paid off - the evaporator block dominated the pooled model, and the effect traced back to crystal-monitor drift on one of the two tools rather than to any of the designed factors.\n\nThe modules below follow the term in order, from cleanroom qualification and DOE fundamentals through oxidation, deposition, lithography, pattern transfer, and multilayer registration.",
      image: "images/alignment.jpg",
      images: [
        "images/alignment.jpg",
        "images/dose_test_1.png",
        "images/dose_test_2.jpg",
        "images/lift_off.png",
        "images/wet_etch.png",
      ],
      imageAlt: "Nanofabrication cleanroom process development and metrology",
      modules: [
        {
          title: "Lab A - Cleanroom Qualification and SOP Development",
          date: "2025-10-02",
          tools: ["ISO cleanroom", "Fume hood", "Sonicator", "March O2 etcher", "Solvent bench"],
          bullets: [
            "Authored and passed instructor review on 11 Standard Operating Procedures covering cleanroom entry and PPE, glassware and tweezer cleaning, silicon die scribing, die cleaning and storage, solvent handling (acetone/IPA/methanol/DI), fume-hood airflow verification, ultrasonic cleaning, O2 plasma etching, and lab cleanup.",
            "Qualified for independent tool access by documenting hazards, failure modes, and before/during/after checklists for each process, establishing the documentation discipline used across every later lab.",
          ],
          blurb: "Cleanroom entry qualification: 11 reviewed SOPs covering PPE, solvent handling, substrate prep, and plasma cleaning.",
        },
        {
          title: "Lab \u03b1 - Design of Experiments Foundations (JMP)",
          date: "2025-10-14",
          tools: ["JMP", "ANOVA", "Tukey HSD / Fisher LSD", "Residual diagnostics"],
          bullets: [
            "Worked through a full one-way comparative-experiment sequence in JMP: hypothesis testing, ANOVA, Tukey HSD and Fisher LSD post-hoc comparisons, and confidence-interval construction on semiconductor process datasets including C2F6 plasma-etch uniformity and photoresist bake temperature.",
            "Built the diagnostic habits used for the rest of the term - normal quantile plots, Shapiro-Wilk and Anderson-Darling normality tests, residual-vs-predicted checks for heteroscedasticity, and Levene/Brown-Forsythe/Bartlett equality-of-variance testing - including recognizing when a heavy-tailed response invalidates a standard ANOVA and re-analyzing under unequal variance.",
            "Practiced experiment framing end to end: response selection, design vs constant vs nuisance factor classification, and the distinction between replication and repeated measurement.",
          ],
          blurb: "DOE and statistical-inference foundations in JMP: ANOVA, post-hoc comparison, residual diagnostics, and variance testing on process data.",
        },
        {
          title: "Lab B - Thermal Oxidation and Spin Coating: Two 2\u2074 Factorials",
          date: "2025-10-26",
          tools: ["Lindberg tube furnace", "Laurell spin coater", "AZ1512", "Filmetrics F20/F40", "JMP"],
          bullets: [
            "Thermal oxidation (2\u2074, 16 runs, blocked by lab section and randomized within block): grew SiO2 while varying oxidant (O2/H2O), temperature (900/1100 \u00b0C), time (40/160 min), and N2 carrier flow (0/2 SCFH); measured thickness at 10 points along the chip diagonal on two reflectometers per chip.",
            "Reduced the oxidation model to oxidant and temperature as dominant effects, retained an oxidant\u00d7N2 interaction on the strength of a Tukey HSD check, and reported optimal settings with intervals: maximum 703 nm (95% CI [489, 917]) at H2O/1100 \u00b0C/160 min/0 SCFH, minimum at O2/900 \u00b0C/40 min/2 SCFH.",
            "Spin coating (2\u2074): generated an independent randomized full factorial in JMP on acceleration, final spin speed, time at speed, and initial resist coverage, with three responses - mean resist thickness, thickness standard deviation, and % die coverage estimated from chip photographs.",
            "Found final spin speed dominant for thickness and acceleration dominant for coverage; applied a log10 transform to normalize the variance model, then re-ran the analysis on pooled class data with the Filmetrics instrument as a block factor - the block did not survive reduction, evidence that F20 and F40 readings were interchangeable (difference in means 0.1, p = 0.9991).",
          ],
          blurb: "Two 2\u2074 full factorials in one lab: silicon thermal oxidation and photoresist spin coating, each modeled on group and pooled class data with instrument blocking.",
        },
        {
          title: "Lab C - Physical Vapor Deposition: 2\u00b3 Factorial Thermal Evaporation",
          date: "2025-11-02",
          tools: ["Angstrom Covap evaporator", "Bruker Dektak", "Crystal monitor (QCM)", "JMP"],
          bullets: [
            "Designed a randomized 2\u00b3 screening experiment in JMP for 100 nm Al thermal evaporation, varying chip location on the stage (center/edge), stage rotation (0/100%), and deposition rate (0.5/3 \u00c5/s), with mean thickness and thickness standard deviation as paired responses.",
            "Masked chips with Kapton, logged chamber pump-down time to 3\u00d710\u207b\u2076 hPa as a covariate, and measured 10 profilometry points per chip; a Y\u00b2-transformed thickness model reached R\u00b2 = 0.97 with deposition rate significant plus rotation\u00d7rate and location\u00d7rate interactions.",
            "Re-analyzed on pooled class data with evaporator (East/West Covap) as a block: the block not only survived reduction but dominated the model. Isolating center-stage chips confirmed a statistically significant tool-to-tool difference in both mean thickness and standard deviation, traced to crystal-monitor drift on the East tool.",
            "Compared pump-down performance between tools as an equipment-health check (East 25.5 \u00b1 5.8 s.d., N = 24; West 18.1 \u00b1 3.2, N = 8) and cross-checked stylus profilometry against the in-situ crystal monitor reading.",
          ],
          blurb: "2\u00b3 factorial on thermal evaporation that surfaced a tool-level block effect dominating the deposition model, traced to crystal-monitor drift.",
        },
        {
          title: "Lab D - Photolithography Dose Response and Instrument Cross-Validation",
          date: "2025-11-09",
          tools: ["S\u00fcss MJB4", "Microtech LaserWriter", "Woollam ellipsometer", "Filmetrics F40", "Dektak"],
          bullets: [
            "Ran a randomized 12-level dose test (35-200 mJ/cm\u00b2 in 15 mJ steps) on a S\u00fcss MJB4: coated and soft-baked a 50 mm wafer, diced it into 16 chips, measured lamp power before each exposure to convert dose to exposure time, then exposed, post-exposure baked, developed, and hard baked to the run order.",
            "Built the exposure-response curve from profilometry depth data after diagnosing excessive noise in the reflectometer channel, extracting D0 \u2248 109 mJ/cm\u00b2, D100 \u2248 120 mJ/cm\u00b2, and a resist contrast \u03b3 \u2248 3.3, and recommended 115 mJ/cm\u00b2 as the process dose.",
            "Characterized dose profiles for three LaserWriter objective lenses over 50-250 mJ/cm\u00b2, recording strip count, strip width, spot size, depth of focus, and filter transmission per lens; ANOVA across lenses returned p < 0.0001, with lenses 3 and 4 statistically similar and lens 5 distinct, and the MJB4 and LaserWriter optimal doses differing significantly.",
            "Cross-validated three thickness metrology tools on the Lab B oxide samples: matched-pairs testing showed F20 and F40 statistically equivalent while the ellipsometer differed, and multivariate correlation put every pair near r = 1 with ellipsometer-F40 highest at 0.9999; stylus depth and reflectometer \u0394t agreed (p = 0.454, mean difference 0.14 \u00b5m).",
          ],
          blurb: "Resist contrast curves on two exposure tools plus a three-instrument metrology cross-validation study.",
          images: ["images/dose_test_1.png", "images/dose_test_2.jpg"],
          imageAlt: "Photolithography dose test chips and exposure response curves",
        },
        {
          title: "Lab E - Resolution 2\u00b3 Factorial, Lift-Off, and Wet Etch",
          date: "2025-11-23",
          tools: ["Microtech LaserWriter", "Covap evaporator", "Transene Type-A etchant", "Dektak", "JMP"],
          bullets: [
            "Designed a randomized 2\u00b3 factorial with 10 response variables on LaserWriter resolution - D-step (1/12), dose (75/200 mJ/cm\u00b2), and lens (3/5) against the mean width and depth of 1, 2, 4, and 8 \u00b5m stitch-test lines plus measured and estimated write time - using lens as an in-block randomization factor.",
            "Fit and reduced eight separate response models (R\u00b2 spanning 0.31 to 0.999), reporting honestly which models failed to reach significance, then ran a combined desirability optimization across all eight to land on D-step 12, 200 mJ/cm\u00b2, and lens 5 as the best overall resolution setting.",
            "Executed a full lift-off sequence - UV-ozone dehydration, spin coat, MJB4 CPW exposure at 100 mJ/cm\u00b2, develop, 100 nm Al evaporation at 3 \u00c5/s with 50% rotation, acetone strip with sonication - yielding 96.26 nm mean Al thickness at 2.27 nm standard deviation.",
            "Built the complementary subtractive route on Al-coated glass using Transene Type-A etchant and a diluted AZ-340 comparison etch, measuring 96.83 \u00b1 1.38 nm and 97.83 \u00b1 1.80 nm across two chips, estimating etch rate from breakthrough time, and concluding that the wet-etch route produced measurably cleaner line edges than lift-off.",
          ],
          blurb: "A 10-response 2\u00b3 factorial on direct-write resolution, plus additive (lift-off) and subtractive (wet etch) pattern transfer compared on the same metric set.",
          images: ["images/lift_off.png", "images/wet_etch.png"],
          imageAlt: "Aluminum lift-off and wet etch pattern transfer results",
        },
        {
          title: "Lab F - Layer Registration and Multilayer Alignment",
          date: "2025-12-05",
          tools: ["S\u00fcss MJB4", "Microtech LaserWriter", "PMGI/AZ bilayer", "Remover PG", "Dektak"],
          bullets: [
            "Prepared PMGI SF2 / AZ1512 bilayer resist with a two-step spin program and TMAH-based AZ 300 MIF development to produce the undercut profile required for clean metal lift-off.",
            "Registered a two-layer MOSFET pattern on the S\u00fcss MJB4 by iterating x-y and rotational alignment between paired hard-mask fiducials, depositing 5 nm Cr / 50 nm Au on layer one and 50 nm Al on layer two with Remover PG lift-off between layers.",
            "Repeated the build as a three-layer direct-write process on the LaserWriter using saved A/B alignment marks and a defined focal plane from multiple reference points, then compared registration accuracy between mask-aligner and direct-write routes.",
            "Verified overlay with optical microscopy and Dektak alignment-marker maps, confirming consistent registration across the full chip on both routes.",
          ],
          blurb: "Multilayer Cr/Au and Al registration through a PMGI/AZ bilayer, aligned two ways - mask aligner fiducials and LaserWriter A/B marks - and verified by Dektak marker mapping.",
          images: ["images/alignment.jpg"],
          imageAlt: "Layer alignment markers and profilometry scan",
        },
      ],
      links: [],
    },

    {
      kind: "lab",
      title: "Electronics Laboratory",
      org: "Independent Laboratory Sequence, University of Oregon",
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
          "Analyzed impedance, reactance, and resonance in RLC systems; characterized diode I-V behavior, Zener behavior, and transistor current amplification.",
          "Performed optoelectronic measurements including photodiode I-V characterization, LED optical power vs current, and laser diode operation using a constant-current driver with optical power and spectral measurements.",
        ],
        resume: {
          process: [
            "Built and characterized RLC networks, filters, and diode, transistor, and optoelectronic devices across a 12-station independent laboratory sequence; measured impedance, resonance, time-domain response, and I-V behavior using oscilloscopes, function generators, optical power meters, and spectrometers.",
          ],
          ds: null,
        },
      },
      blurb:
        "Hands-on electronics laboratory covering circuit fundamentals, instrumentation, and device characterization including RC dynamics, impedance, resonance, diode I-V behavior, transistor amplification, and optoelectronic measurements.",
      details:
        "Completed the University of Oregon Electronics Obstacle Course, a published 12-station laboratory sequence in which each station must be built, measured, and signed off before moving on. The course is focused on practical circuit construction and measurement discipline: built and characterized resistive, capacitive, and inductive networks; implemented voltage dividers and RC filters; measured time-domain response and frequency dependence using oscilloscopes and function generators; and analyzed impedance, reactance, and resonance in RLC systems.\n\nAdditional work included diode I-V characterization, Zener behavior, transistor current amplification (TIP31C), and operational amplifier circuits including inverting, non-inverting, and buffer configurations. Investigated instrumentation loading effects and impedance matching.\n\nOptoelectronic experiments included photodiode I-V characterization under varying illumination, LED optical power vs current measurements, and laser diode operation using a constant-current driver with optical power and spectral measurements.\n\nThe laboratory emphasized rigorous measurement workflows, circuit modeling intuition, and connections between electronic instrumentation and physical device behavior relevant to experimental physics and microdevice characterization.",
      image: "images/electronics_1.jpg",
      images: [
        "images/electronics_1.jpg",
        "images/electronics_2.jpg",
        "images/electronics_3.jpg",
        "images/electronics_4.jpg",
        "images/electronics_5.jpg",
      ],
      modules: [
        {
          title: "Passive Components and RC Dynamics",
          tools: ["Fluke 179 DMM", "Capacitance meter", "Function generator", "Oscilloscope"],
          bullets: [
            "Measured resistance, capacitance, and inductance directly and verified voltage-current relationships across passive networks.",
            "Built voltage dividers and RC filter circuits; characterized time-domain charging behavior and frequency-dependent AC response on the oscilloscope.",
          ],
          blurb: "Resistor, capacitor, and inductor fundamentals through dividers, RC filters, and time-domain response.",
        },
        {
          title: "Impedance, Reactance, and Resonance",
          tools: ["LC networks", "Function generator", "Oscilloscope", "Circuit simulation"],
          bullets: [
            "Separated resistive and reactive contributions to impedance and measured how capacitive and inductive reactance vary with frequency.",
            "Constructed LC bandpass filters and characterized resonant frequency behavior, comparing measured response against circuit simulation.",
          ],
          blurb: "Frequency-dependent impedance and LC resonance, measured against simulated response.",
        },
        {
          title: "Semiconductor Device Characterization",
          tools: ["Diodes", "Zener diodes", "Bipolar and field-effect transistors", "Power supplies"],
          bullets: [
            "Measured forward and reverse diode I-V characteristics, located the turn-on knee, and characterized junction capacitance as a function of reverse bias.",
            "Characterized bipolar transistor current amplification and field-effect transistor behavior from measured device curves.",
          ],
          blurb: "I-V characterization of diodes, Zeners, and transistors, including bias-dependent junction capacitance.",
        },
        {
          title: "Operational Amplifiers, Loading, and Buffering",
          tools: ["Op-amps", "Proto-boards", "Oscilloscope", "High-impedance dividers"],
          bullets: [
            "Built inverting and non-inverting amplifier configurations and verified gain against feedback-network predictions.",
            "Investigated how finite instrument input impedance loads high-impedance circuits, and used unity-gain buffer stages to isolate source from measurement.",
          ],
          blurb: "Op-amp gain configurations plus the instrumentation-loading and buffering problem they solve.",
        },
        {
          title: "RF Behavior and Board Construction",
          tools: ["Proto-board", "Ground-plane PCB", "Function generator", "Oscilloscope"],
          bullets: [
            "Tested how discrete components depart from ideal behavior at high frequency.",
            "Compared signal integrity between proto-board construction and ground-plane PCB layout to quantify the cost of parasitics.",
          ],
          blurb: "High-frequency component behavior and proto-board vs ground-plane PCB performance.",
        },
        {
          title: "Optoelectronic Device Measurement",
          tools: ["Photodiodes", "LEDs", "Laser diode + constant-current driver", "Optical power meter", "Spectrometer"],
          bullets: [
            "Characterized photodiode I-V response under varying illumination and measured LED optical power against drive current.",
            "Operated a laser diode from a constant-current protection driver and recorded optical power and spectral output.",
          ],
          blurb: "Photodiode, LED, and laser diode characterization with optical power and spectral measurement.",
        },
      ],
      links: [
        { label: "Obstacle Course", url: "https://newjune.uoregon.edu/mediawiki/index.php/Electronics_Obstacle_Course" },
      ],
    },

    {
      kind: "lab",
      title: "CAHOOTS Applied Data Science Lab",
      org: "Applied Data Science Lab, University of Oregon",
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
            "Built a reproducible Python/pandas pipeline to clean and analyze 50,000+ police CAD dispatch records; engineered features quantifying temporal and spatial trends in crisis-response operations.",
            "Produced stakeholder-facing visualizations and written summaries for program evaluation, delivered to a community partner (White Bird Clinic).",
          ],
          process: null,
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
            "Analyzed 21,000+ superconducting compounds using compositional descriptors; applied PCA and clustering to expose structure-property relationships across a high-dimensional materials space.",
            "Trained a Random Forest regressor for critical temperature and used feature importance to identify the dominant physical predictors, producing an interpretable result rather than a black box.",
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
        resume: { // Changed back to "resume"
          ds: null,
          process: null,
        },
      },
      blurb:
        "Evaluated advanced university mathematics coursework, demonstrating a deep foundation in the theoretical mechanics, including linear algebra and stochastic processes, that power physical modeling and data science.",
      details:
        "Serving as a Mathematics Paper Marker requires more than just checking answers; it requires reverse-engineering a student's logical process to find the exact point of failure in complex, multi-step proofs...",
      links: [],
    },
    {
      kind: "lab",
      title: "Optical Systems & Interferometry Laboratory",
      org: "Independent Laboratory Sequence, 16 stations, University of Oregon",
      date: "2025-05-01", 
      categories: ["nanofab", "process", "physics"], // Added "nanofab" here
      tags: ["Optics", "Laser Alignment", "Interferometry", "Hardware Characterization"],
      tools: ["HeNe Lasers", "Oscilloscopes", "Thorlabs Optomechanics", "Photodetectors", "Waveplates", "Interferometers"],
      descriptions: {
        cv: [
          "Built and aligned complex free-space optical systems, including Michelson interferometers and Fabry-Perot cavities, to measure refractive indices, coherence length, and cavity finesse.",
          "Characterized Gaussian laser beam profiles, polarization states, and photodiode rise times using translation stages, optical choppers, and oscilloscopes.",
          "Constructed functional optical isolators using quarter waveplates and polarizing beamsplitters, ensuring strict beam containment and alignment."
        ],
        resume: { // Keeping this as "resume" matches your resume-builder object syntax perfectly
          ds: [
            "Analyzed optical signal data and photodiode rise times using oscilloscopes to characterize hardware response rates.",
            "Modeled and simulated Fabry-Perot cavity properties (Finesse, Free Spectral Range) to validate physical benchtop measurements."
          ],
          process: [
            "Designed, built, and aligned free-space optical systems including Michelson interferometers and Fabry-Perot cavities across a 16-station independent laboratory sequence.",
            "Characterized Gaussian beam profiles (Rayleigh range, 1/e width), polarization states, and photodetector rise times; cross-checked results between independent measurement methods.",
            "Executed precision optics handling, cleaning, and laser safety protocols throughout.",
          ]
        },
      },
      blurb:
        "Completed the published 16-station UO Optics Obstacle Course: designed, built, and characterized precision free-space optical systems including Michelson interferometers and Fabry-Perot cavities, using Thorlabs optomechanics and HeNe lasers.",
      details:
        "Completed the University of Oregon Optics Obstacle Course, a published 16-station laboratory sequence in which each station - alignment, measurement, or system build - must be demonstrated and signed off before advancing. The course runs from laser safety and optics handling through beam alignment and polarization control, into quantitative beam characterization, and finally into multi-element system builds: telescopes, optical isolators, Michelson interferometers, and Fabry-Perot cavities.\n\nThe emphasis throughout is on doing alignment properly rather than approximately. Establishing a level, correctly polarized beam at a fixed height using irises along the optical table hole pattern is the prerequisite for every later station, and a cavity that will not reach its specified finesse is usually an alignment problem rather than a component problem. Measurements are cross-checked between methods wherever possible - optical power by meter versus photodetector-and-oscilloscope using detector responsivity, refractive index by Brewster's angle versus interferometry.\n\nThe stations below group the course into its major skill areas.",
      image: "images/optics_4.jpg",
      images: ["images/optics_1.jpg", "images/optics_2.jpg", "images/optics_3.jpg", "images/optics_4.jpg"],
      imageAlt: "Various optical experiments",
      modules: [
        {
          title: "Beam Alignment and Laser Safety",
          tools: ["HeNe laser", "Mirrors", "Irises", "Thorlabs optomechanics"],
          bullets: [
            "Established a level, vertically polarized beam at a controlled 4-inch height using mirror pairs and two irises referenced to the optical table hole pattern.",
            "Executed laser safety and beam-containment protocols and performed proper handling and cleaning of precision optics.",
          ],
          blurb: "The alignment and safety foundation every later station depends on.",
        },
        {
          title: "Polarization Control and Optical Isolation",
          tools: ["Polarizers", "Polarizing beamsplitter cubes", "Quarter waveplates", "Rotation stages"],
          bullets: [
            "Characterized vertical, horizontal, and 45-degree polarization states through polarizing beamsplitter cubes, and generated circular polarization with quarter waveplates.",
            "Built two optical isolator configurations - polarizer plus quarter waveplate, and polarizing beamsplitter plus quarter waveplate - and compared their behavior against Faraday rotator isolators.",
            "Determined the refractive index of a glass cover slip from Brewster's angle using a rotation stage, horizontally polarized light, and power measurement.",
          ],
          blurb: "Polarization state control, isolator construction, and Brewster's-angle index measurement.",
        },
        {
          title: "Power Measurement and Detector Response",
          tools: ["Optical power meter", "DET10A / DET110 photodiodes", "Optical chopper", "Oscilloscope", "ND filters"],
          bullets: [
            "Cross-validated optical power measured by power meter against the photodetector-and-oscilloscope method using detector responsivity data, and verified neutral-density filter optical densities.",
            "Compared rise times of small-area and large-area silicon photodiodes using a chopper and two-lens telescope to quantify the speed-versus-active-area tradeoff.",
          ],
          blurb: "Two independent power-measurement methods cross-checked, plus photodiode rise-time characterization.",
        },
        {
          title: "Gaussian Beam Characterization and Telescopes",
          tools: ["200 µm pinhole", "Translation stage", "Photodiode", "Newport KPX lenses"],
          bullets: [
            "Built a 1:2 beam expander from two supplied lenses and verified collimation.",
            "Measured the 1/e beam width by scanning a 200 µm pinhole on a translation stage across the beam, then characterized spot size and Rayleigh range at the telescope focus.",
            "Studied spherical aberration, coma, astigmatism, and chromatic aberration, and how lens orientation and positioning minimize Seidel aberrations.",
          ],
          blurb: "Beam expander construction, pinhole-scan beam profiling, Rayleigh range, and aberration behavior.",
        },
        {
          title: "Interferometry and Fabry-Perot Cavities",
          tools: ["Michelson interferometer", "Non-polarizing beamsplitter", "Plane and spherical mirror cavities", "Fiber-coupled spectrometer"],
          bullets: [
            "Built a Michelson interferometer with a non-polarizing beamsplitter and used it to measure laser wavelength and the refractive indices of a glass slide and an unknown sample.",
            "Measured laser coherence length on the same interferometer, and characterized the source center wavelength and linewidth with a fiber-coupled spectrometer.",
            "Constructed plane-mirror and spherical-mirror Fabry-Perot cavities to specification - finesse of 20 or better with free spectral range in the 500 MHz to 1 GHz band - and explored the practical limits on resolution and achievable finesse.",
          ],
          blurb: "Michelson interferometry for wavelength, index, and coherence length, plus Fabry-Perot cavities built to a finesse and FSR spec.",
        },
      ],
      links: [
        { label: "Obstacle Course", url: "https://newjune.uoregon.edu/mediawiki/index.php/Optics_Obstacle_Course" },
      ],
    },
  ],

  experience: [
    {
      title: "Resident Assistant",
      track: "industry",
      meta: "University of Oregon Housing - Eugene, OR | Sept 2023 to June 2026",
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
          "Enforced safety protocols and conducted routine inspections across a 180+ resident facility; documented incidents and coordinated corrective action with professional staff and emergency services.",
          "Served as on-call first response for medical, safety, and facilities incidents across a three-year appointment; escalated appropriately and maintained accurate records.",
        ],
      },
    },
    {
      title: "Learning Assistant - Applied Data Science for Social Justice",
      track: "academic",
      domains: ["ds", "cs", "nanofab"],
      meta: "University of Oregon - Eugene, OR | Apr 2025 to June 2026",
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
      meta: "University of Oregon - Eugene, OR | Mar 2025 to June 2026",
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
        "Graduated June 2026. Dean's List: Spring 2025, Fall 2025",
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
