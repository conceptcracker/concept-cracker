// GS Test 1 - sample
var qs = [
    // 1. Teaching Aptitude
    {
        q: "When was the first National Policy on Education declared in India?",
        o: ["17 August 1986", "24 July 1956", "24 July 1968", "26 August 1953"],
        a: 2, m: 3, n: 1, img: "",
        exp: "The first NPE was announced on 24 July 1968 on the basis of the Kothari Commission (1964–66). The second came in 1986 (revised 1992) and the third is NEP 2020."
    },
    // 2. Teaching Aptitude
    {
        q: "The taxonomy of educational objectives in the psychomotor domain was propounded by:",
        o: ["Krathwohl", "Harrow", "Bloom", "Masia"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Harrow (1972), along with Simpson (1972) and Dave (1970), classified the psychomotor domain. Krathwohl and Masia worked on the affective domain; Bloom on the cognitive domain."
    },
    // 3. Teaching Aptitude
    {
        q: "Which of the following is NOT a level of teaching?",
        o: ["Understanding level", "Listening level", "Reflective level", "Memory level"],
        a: 1, m: 3, n: 1, img: "",
        exp: "The three levels of teaching are Memory (Herbart), Understanding (Morrison) and Reflective (Hunt). ‘Listening level’ is not one of them."
    },
    // 4. Teaching Aptitude
    {
        q: "Which of the following is used to improve teaching behaviour?",
        o: ["Auto-instruction", "Micro-teaching", "Classroom interaction", "Panel teaching"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Micro-teaching is a scaled-down, skill-focused practice teaching session (small class, short time, immediate feedback) designed to modify teaching behaviour."
    },
    // 5. Teaching Aptitude
    {
        q: "The National Council for Teacher Education (NCTE), as a statutory body, came into existence during the:",
        o: ["Sixth Five Year Plan period", "Seventh Five Year Plan period", "Eighth Five Year Plan period", "Ninth Five Year Plan period"],
        a: 2, m: 3, n: 1, img: "",
        exp: "The NCTE Act, 1993 came into force on 17 August 1995 — the Eighth Plan period (1992–97)."
    },
    // 6. Research Aptitude
    {
        q: "In which method of research is the ‘cause and effect’ relationship established?",
        o: ["Historical method", "Philosophical method", "Survey method", "Experimental method"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Only the experimental method manipulates an independent variable under controlled conditions and observes its effect on the dependent variable, thereby establishing cause and effect."
    },
    // 7. Research Aptitude
    {
        q: "Which type of research focuses on the improvement of present situations?",
        o: ["Experimental research", "Fundamental research", "Action research", "Survey research"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Action research is carried out by practitioners to solve immediate practical problems in their own setting and improve current practice."
    },
    // 8. Research Aptitude
    {
        q: "Arrange the following steps of the research process in sequence:<br>(I) Formulation of research problem<br>(II) Collection of data<br>(III) Developing the data-collection instrument<br>(IV) Processing and analysing data",
        o: ["I, II, IV, III", "I, IV, III, II", "II, III, IV, I", "I, III, II, IV"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Formulate the problem → develop the instrument → collect the data → process and analyse."
    },
    // 9. Research Aptitude
    {
        q: "In which of the following sampling techniques is randomization NOT done?",
        o: ["Stratified sampling", "Purposive sampling", "Multi-stage sampling", "Systematic sampling"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Purposive (judgemental) sampling is a non-probability technique: units are chosen deliberately by the researcher, so there is no random selection."
    },
    // 10. Research Aptitude
    {
        q: "Which of the following is NOT a measure of central tendency?",
        o: ["Mean", "Median", "Mode", "Range"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Mean, median and mode are measures of central tendency; range is a measure of dispersion (variability)."
    },
    // 11. Current Affairs
    {
        q: "The Nobel Prize in Chemistry 2021 was jointly awarded to:",
        o: ["Benjamin List and David MacMillan", "Benjamin List and Klaus Hasselmann", "David MacMillan and Klaus Hasselmann", "Emmanuelle Charpentier and Jennifer Doudna"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Awarded for the development of asymmetric organocatalysis. Klaus Hasselmann shared the 2021 Physics prize; Charpentier and Doudna won Chemistry in 2020."
    },
    // 12. Current Affairs
    {
        q: "Who won the first gold medal at the Tokyo Olympics 2020 (held in 2021)?",
        o: ["Yang Qian", "Anjali Bharadwaj", "Yuto Horigome", "Naomi Osaka"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Yang Qian of China won the women’s 10 m air rifle event on 24 July 2021, the first gold of the Games."
    },
    // 13. Current Affairs
    {
        q: "What was the main title (theme) of the United Nations World Water Development Report 2021?",
        o: ["Preserving Water", "Conserving Water", "Managing Water", "Valuing Water"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The 2021 UN World Water Development Report was titled ‘Valuing Water’."
    },
    // 14. Current Affairs
    {
        q: "‘The Inequality Virus’ global report (2021) was published by:",
        o: ["Oxfam", "World Bank", "International Monetary Fund", "United Nations Organization"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Oxfam released the report in January 2021, showing how COVID-19 deepened economic inequality worldwide."
    },
    // 15. Indian History
    {
        q: "The Ancient Monuments Preservation Act was passed during the tenure of which Governor-General/Viceroy?",
        o: ["Lord Minto", "Lord Curzon", "Lord Canning", "Lord Ripon"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Lord Curzon (1899–1905) passed the Ancient Monuments Preservation Act, 1904 and set up the Archaeological Survey’s conservation work under John Marshall."
    },
    // 16. Indian History
    {
        q: "Which one of the following Delhi Sultans stopped the practice of inhuman punishments?",
        o: ["Razia Sultan", "Nasiruddin Mahmud Shah", "Firoz Shah Tughlaq", "Bahlol Lodi"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Firoz Shah Tughlaq abolished mutilation and torture as punishments, and also banned many illegal cesses."
    },
    // 17. Indian History
    {
        q: "Which rifle was introduced in place of the old rifle in 1857, its greased cartridges becoming an immediate cause of the Revolt?",
        o: ["Brown Bess", "Martini–Henry", "Enfield rifle", "Lee–Metford"],
        a: 2, m: 3, n: 1, img: "",
        exp: "The Enfield P-53 rifle used cartridges rumoured to be greased with cow and pig fat, offending both Hindu and Muslim sepoys."
    },
    // 18. Indian History
    {
        q: "Who among the following were associated with the formation of the Swaraj Party (1923)?<br>1. Subhas Chandra Bose<br>2. C. R. Das<br>3. Jawaharlal Nehru<br>4. Motilal Nehru",
        o: ["2 and 4", "2 and 3", "1, 2 and 3", "1, 2, 3 and 4"],
        a: 0, m: 3, n: 1, img: "",
        exp: "C. R. Das (president) and Motilal Nehru (secretary) founded the Congress–Khilafat Swaraj Party in January 1923. Bose and Jawaharlal Nehru were not among its founders."
    },
    // 19. Indian History
    {
        q: "With reference to the Marathas, which of the following statements is/are correct?<br>1. Marathas collected revenue as Chauth and Sardeshmukhi.<br>2. Marathas participated in the second battle of Panipat in 1761.",
        o: ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Statement 1 is true. The 1761 battle was the Third Battle of Panipat (Marathas vs Ahmad Shah Abdali); the Second Battle (1556) was fought between Akbar’s forces and Hemu."
    },
    // 20. Geography
    {
        q: "The mesosphere layer of the atmosphere extends approximately from which height to which height above the Earth’s surface?",
        o: ["50 km to 85 km", "80 km to 120 km", "400 km to 600 km", "28 km to 45 km"],
        a: 0, m: 3, n: 1, img: "",
        exp: "The mesosphere lies between about 50 km and 85 km. It is the coldest layer and the one where most meteors burn up."
    },
    // 21. Geography
    {
        q: "The Equator does NOT pass through which one of the following countries?",
        o: ["Kenya", "Uganda", "Gabon", "Zambia"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The Equator crosses Gabon, Uganda and Kenya (among others). Zambia lies wholly south of it, between roughly 8°S and 18°S."
    },
    // 22. Geography
    {
        q: "Which of the following rivers crosses the Tropic of Capricorn twice?",
        o: ["Zambezi", "Paraná", "Murray–Darling", "Limpopo"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The Limpopo flows north-east across the Tropic near the South Africa–Botswana–Zimbabwe border and then curves south-east, crossing it again before reaching the Indian Ocean in Mozambique."
    },
    // 23. Geography
    {
        q: "Match List-I (mineral) with List-II (mining area):<br>A. Iron &nbsp; B. Manganese &nbsp; C. Copper &nbsp; D. Bauxite<br>1. Weipa &nbsp; 2. Sudbury &nbsp; 3. Chiatura &nbsp; 4. Itabira",
        o: ["A-1, B-2, C-3, D-4", "A-4, B-3, C-2, D-1", "A-4, B-3, C-1, D-2", "A-3, B-4, C-2, D-1"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Iron – Itabira (Brazil); Manganese – Chiatura (Georgia); Copper – Sudbury (Canada); Bauxite – Weipa (Australia)."
    },
    // 24. Indian Polity
    {
        q: "Who is empowered to finally decide whether a Bill is a Money Bill or not?",
        o: ["The Speaker of Lok Sabha", "The Finance Minister", "The Chairman of Rajya Sabha", "The President of India"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Under Article 110(3), the decision of the Speaker of the Lok Sabha on whether a Bill is a Money Bill is final."
    },
    // 25. Indian Polity
    {
        q: "Which one of the following is NOT correctly matched?",
        o: ["Citizenship – Part II of the Constitution", "Fundamental Rights – Part III of the Constitution", "Fundamental Duties – Part VI-A of the Constitution", "Union Territories – Part VIII of the Constitution"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Fundamental Duties (Article 51A) are in Part IV-A, inserted by the 42nd Amendment (1976), not Part VI-A."
    },
    // 26. Indian Polity
    {
        q: "In which case did the Supreme Court hold that harmony and balance between Fundamental Rights and Directive Principles is an essential feature of the basic structure of the Constitution?",
        o: ["Golaknath v. State of Punjab", "Kesavananda Bharati v. State of Kerala", "Minerva Mills Ltd. v. Union of India", "Golaknath v. State of Bihar"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Minerva Mills (1980) struck down parts of the 42nd Amendment and held that the balance between Parts III and IV is part of the basic structure."
    },
    // 27. Indian Polity
    {
        q: "Protection against ex-post facto laws is provided in which Article of the Constitution of India?",
        o: ["Article 16(4-A)", "Article 19(1)", "Article 20(1)", "Article 21A"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Article 20(1) says no person shall be convicted for an act that was not an offence when done, nor be subjected to a penalty greater than the law then in force allowed."
    },
    // 28. Environment
    {
        q: "Itai-Itai disease is associated with poisoning by which of the following?",
        o: ["Mercury", "Cadmium", "Zinc", "Selenium"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Itai-itai (‘ouch-ouch’) disease, reported from the Jinzu River basin in Japan, was caused by cadmium contamination and causes severe bone and kidney damage. Mercury causes Minamata disease."
    },
    // 29. Environment
    {
        q: "How many principles were formulated in the Stockholm Conference on the Human Environment in 1972?",
        o: ["22", "23", "25", "26"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The Stockholm Declaration adopted 26 principles (and an Action Plan with 109 recommendations)."
    },
    // 30. Environment
    {
        q: "The concept of ‘ecosystem’ was first put forth by:",
        o: ["Woodbury", "Clarke", "A. G. Tansley", "E. P. Odum"],
        a: 2, m: 3, n: 1, img: "",
        exp: "The British ecologist A. G. Tansley coined the term ‘ecosystem’ in 1935."
    }
];
