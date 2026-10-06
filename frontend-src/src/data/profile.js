export const profile = {
  name: "Shounak",
  role: "CSE student, AI & ML · Kolkata",
  avatar: "",
  email: "dcool3332@gmail.com",
  socials: [
    {
      name: "Instagram",
      handle: "@am_sgd",
      url: "https://instagram.com/am_sgd",
      color: "#e1306c",
      icon: "instagram",
    },
  ],
  about:
    "I'm a B.Tech student in Computer Science with a specialization in AI & ML at Netaji Subhas Engineering College.",
  about2: " I build web applications in Java and I'm learning to connect them to machine learning. Graduating in 2028.",
};

export const skills = [
  { name: "Java", color: "#e76f00", icon: "java" },
  { name: "Spring MVC", color: "#4c9a2a", icon: "spring" },
  { name: "Hibernate", color: "#b07d48", icon: "hibernate" },
  { name: "JSP", color: "#e0475b", icon: "jsp" },
  { name: "MySQL", color: "#0f7bb0", icon: "mysql" },
  { name: "Machine Learning", color: "#7c5cf0", icon: "ml" },
];

export const experience = [
  {
    period: "2024 - Now",
    title: "B.Tech, CSE (AI & ML)",
    organization: "Netaji Subhas Engineering College",
    description: "Affiliated with MAKAUT.",
  },
  {
    period: "",
    title: "Internship or role title",
    organization: "",
    description: "One line on what you built and what changed because of it.",
  },
];

export const projects = [
  { title: "Student Portal", desc: "Course and result management for a college.", tags: ["Spring MVC", "MySQL"], cat: "Web", date: "2026-09", featured: true, link: "#" },
  { title: "Library Manager", desc: "Issue, return and fine tracking.", tags: ["JSP", "Hibernate"], cat: "Web", date: "2026-07", featured: false, link: "#" },
  { title: "Spam Classifier", desc: "Flags spam messages with a simple ML model.", tags: ["Python", "ML"], cat: "ML", date: "2026-08", featured: true, link: "#" },
  { title: "Expense Tracker", desc: "Monthly budgets with category charts.", tags: ["Java", "MySQL"], cat: "Tools", date: "2026-05", featured: false, link: "#" },
  { title: "Blog Engine", desc: "Markdown posts with comments and tags.", tags: ["Spring MVC", "JSP"], cat: "Web", date: "2026-03", featured: false, link: "#" },
  { title: "Movie Recommender", desc: "Suggests films from past ratings.", tags: ["Python", "ML"], cat: "ML", date: "2026-06", featured: true, link: "#" },
  { title: "Quiz App", desc: "Timed quizzes with leaderboards.", tags: ["Java", "Hibernate"], cat: "Web", date: "2025-12", featured: false, link: "#" },
  { title: "Portfolio Site", desc: "This page, built by hand.", tags: ["HTML", "CSS"], cat: "Web", date: "2026-10", featured: false, link: "#" },
  { title: "Attendance Tracker", desc: "Command-line attendance with reports.", tags: ["Java", "MySQL"], cat: "Tools", date: "2025-10", featured: false, link: "#" },
  { title: "Digit Recognizer", desc: "Reads handwritten digits from images.", tags: ["Python", "ML"], cat: "ML", date: "2026-04", featured: false, link: "#" },
  { title: "Chat Server", desc: "Multi-client chat over sockets.", tags: ["Java"], cat: "Tools", date: "2025-08", featured: false, link: "#" },
  { title: "Weather Dashboard", desc: "Live forecasts for any city.", tags: ["HTML", "CSS"], cat: "Web", date: "2026-01", featured: false, link: "#" },
].map((project, index) => ({ ...project, n: index }));

export const blogs = [
  {
    id: "spring-mvc-request",
    title: "How Spring MVC handles a request",
    excerpt: "A walkthrough from the dispatcher to the view.",
    date: "2026-09",
    mins: 6,
    cat: "Backend",
    tags: ["Java", "Spring MVC"],
    intro:
      "Every request to a Spring MVC app passes through one front controller, the DispatcherServlet. Once you understand that single path, the rest of the framework feels far less magical.",
    body: [
      "The DispatcherServlet receives the request and asks its HandlerMapping which controller method should handle the URL. Spring picks the match using annotations such as @GetMapping and @PostMapping.",
      "A HandlerAdapter then calls that method, binding request parameters, path variables and form data to its arguments. Data conversion and validation happen here, before your own code runs.",
      "The controller returns a model and a view name. A ViewResolver turns that name into a real view, such as a JSP, and the model data is rendered into the HTML sent back to the browser.",
    ],
    points: [
      "One front controller, the DispatcherServlet, receives every request",
      "HandlerMapping finds the method and HandlerAdapter calls it",
      "ViewResolver maps the returned view name to a JSP",
    ],
  },
  {
    id: "first-ml-model",
    title: "My first machine learning model",
    excerpt: "From raw data to a working classifier.",
    date: "2026-07",
    mins: 8,
    cat: "Machine Learning",
    tags: ["Python", "ML"],
    intro:
      "I went from a raw CSV file to a working classifier and learned that most of the work happens before the training even starts.",
    body: [
      "I began by cleaning the data: removing duplicates, handling missing values and encoding text columns as numbers. This took longer than training the model itself.",
      "I split the data into training and test sets so I could measure the model on examples it had never seen. A simple baseline gave me a score to beat.",
      "After trying a couple of algorithms, I compared accuracy, precision and recall instead of trusting accuracy alone, then studied the mistakes to see what the model got wrong.",
    ],
    points: [
      "Clean and encode the data first",
      "Always keep a held-out test set",
      "Check precision and recall, not only accuracy",
    ],
  },
];

export const gallery = {
  editable: true,
  photos: ["", "", "", "", ""],
  captions: ["Campus walk", "Late-night coding", "Hackathon day", "Desk setup", "Kolkata evenings"],
  store: "portfolio-gallery-v1",
};

const tags = [
  "hiberante",
  
]