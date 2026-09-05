const PORTFOLIO_CONFIG = {
  personal: {
    fullName: "Aditya Swain",
    shortName: "Aditya",
    title: "Aspiring Software Developer",
    educationLevel: "3rd-Year B.Tech Computer Science Engineering",
    institution: "Sphitorium Engineering College",
    location: "India",
    summary:
      "A motivated 3rd-year Computer Science Engineering student with strong DSA fundamentals and knowledge of C and Python, actively developing his programming and software-development skills.",
    bio:
      "Hi, I'm Aditya Swain, a 3rd-year Computer Science Engineering student passionate about programming, problem-solving, and Data Structures & Algorithms. I enjoy writing clean, efficient code, building real-world projects, and continuously strengthening my software development fundamentals.",
    status: "Available for Internships & Projects"
  },

  contact: {
    email: "adityaswain.0106@gmail.com",
    phone: "+91 82172 93794",
    phoneRaw: "+918217293794"
  },

  formspree: {
    formId: "xoeqlzgw",
    endpoint: "https://formspree.io/f/xoeqlzgw"
  },

  socials: [
    {
      name: "GitHub",
      url: "https://github.com/aditya-code133"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/aditya-swain-a179a83b3/"
    }
  ],

  skills: {
    languages: [
      { name: "C", badge: "C", level: "Core Proficiency" },
      { name: "Python", badge: "Py", level: "Scripting & DSA" }
    ],
    fundamentals: [
      { name: "Data Structures & Algorithms", badge: "DSA", desc: "Arrays, Linked Lists, Stacks, Queues, Trees, Recursion" },
      { name: "Problem Solving", badge: "PS", desc: "Algorithmic thinking, time & space complexity optimization" },
      { name: "Software Development Fundamentals", badge: "DEV", desc: "Object-oriented design, modular code, debugging" }
    ]
  },

  featuredProject: {
    id: "geetanjali-bharpoor",
    title: "Geetanjali Bharpoor — Official Website",
    tagline: "Pure Vanilla Web Architecture · Mobile-First UI · WhatsApp Direct Order Routing",
    category: "Frontend Web Platform / Production",
    description:
      "Official production website for Geetanjali Bharpoor homemade protein & nutrition powder, formulated with 15 vital nutrients and zero added sugar. Built with pure vanilla HTML5, CSS3, and JavaScript with zero external libraries for instant page loading, responsive layout, and direct one-tap ordering via WhatsApp and phone call.",
    highlights: [
      { title: "Zero Dependencies", desc: "100% pure vanilla frontend for instant page speeds" },
      { title: "Mobile-First UX", desc: "Responsive layouts engineered across all screen sizes" },
      { title: "Direct WhatsApp Orders", desc: "Pre-filled messages for 250g, 500g, and 1KG packs" },
      { title: "Live in Production", desc: "Hosted on GitHub Pages with live customer traffic" }
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "Mobile-First", "WhatsApp API", "Live Production"],
    githubUrl: "https://github.com/aditya-code133/gitanjali-bharpoor",
    liveUrl: "https://aditya-code133.github.io/gitanjali-bharpoor/"
  },

  education: [
    {
      degree: "B.Tech in Computer Science Engineering",
      institution: "Sphitorium Engineering College",
      period: "2023 – 2027",
      status: "3rd Year — In Progress",
      details: "Focusing on Data Structures & Algorithms, Systems Programming, and Core Computer Science Principles."
    }
  ]
};

if (typeof Object.freeze === "function") {
  Object.freeze(PORTFOLIO_CONFIG);
}
