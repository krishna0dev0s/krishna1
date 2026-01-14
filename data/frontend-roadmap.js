// Frontend Developer Roadmap Data - Complete and Detailed
export const frontendRoadmap = {
  title: "Frontend Developer",
  nodes: [
    // START
    {
      id: "start",
      label: "Start Here",
      description: "Begin your journey to becoming a frontend developer",
      type: "start",
      position: { x: 0, y: 0 },
      style: { special: true }
    },
    // INTERNET BASICS
    {
      id: "internet",
      label: "Internet",
      description: "Learn how the internet works",
      type: "foundation",
      resources: {
        free: [
          { title: "How does the Internet Work?", url: "https://cs.fyi/guide/how-does-internet-work" },
          { title: "The Internet Explained", url: "https://www.vox.com/2014/6/16/18076282/the-internet" },
        ],
        videos: [
          { title: "How the Internet Works in 5 Minutes", url: "https://www.youtube.com/watch?v=7_LPdttKXPc" },
        ]
      },
      position: { x: 0, y: 1 }
    },
    {
      id: "http",
      label: "HTTP/HTTPS",
      description: "Understand web protocols",
      type: "foundation",
      resources: {
        free: [
          { title: "What is HTTP?", url: "https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/" },
        ]
      },
      position: { x: -1, y: 2 }
    },
    {
      id: "dns",
      label: "DNS",
      description: "Domain Name System basics",
      type: "foundation",
      resources: {
        free: [
          { title: "What is DNS?", url: "https://www.cloudflare.com/learning/dns/what-is-dns/" },
        ]
      },
      position: { x: 1, y: 2 }
    },
    // HTML
    {
      id: "html",
      label: "HTML",
      description: "Structure of web pages",
      type: "core",
      resources: {
        free: [
          { title: "W3Schools: Learn HTML", url: "https://www.w3schools.com/html/" },
          { title: "MDN Web Docs: HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        ],
        videos: [
          { title: "HTML Full Course", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
        ]
      },
      position: { x: 0, y: 3 }
    },
    {
      id: "html-basics",
      label: "HTML Basics",
      description: "Tags, elements, attributes",
      type: "skill",
      position: { x: -1.5, y: 4 }
    },
    {
      id: "semantic-html",
      label: "Semantic HTML",
      description: "Meaningful HTML structure",
      type: "skill",
      position: { x: -0.5, y: 4 }
    },
    {
      id: "forms",
      label: "Forms & Validation",
      description: "User input handling",
      type: "skill",
      position: { x: 0.5, y: 4 }
    },
    {
      id: "accessibility",
      label: "Accessibility",
      description: "Making web accessible to all",
      type: "skill",
      position: { x: 1.5, y: 4 }
    },
    // CSS
    {
      id: "css",
      label: "CSS",
      description: "Styling and layout",
      type: "core",
      resources: {
        free: [
          { title: "W3Schools: CSS", url: "https://www.w3schools.com/css/" },
          { title: "MDN: CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
        ],
        videos: [
          { title: "CSS Complete Course", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc" },
        ]
      },
      position: { x: 0, y: 5 }
    },
    {
      id: "css-basics",
      label: "CSS Basics",
      description: "Selectors, properties, values",
      type: "skill",
      position: { x: -2, y: 6 }
    },
    {
      id: "layouts",
      label: "CSS Layouts",
      description: "Flexbox & Grid",
      type: "skill",
      position: { x: -1, y: 6 }
    },
    {
      id: "responsive",
      label: "Responsive Design",
      description: "Mobile-first approach",
      type: "skill",
      position: { x: 0, y: 6 }
    },
    {
      id: "animations",
      label: "CSS Animations",
      description: "Transitions & keyframes",
      type: "skill",
      position: { x: 1, y: 6 }
    },
    {
      id: "css-frameworks",
      label: "CSS Frameworks",
      description: "Tailwind, Bootstrap",
      type: "skill",
      position: { x: 2, y: 6 }
    },
    // JAVASCRIPT
    {
      id: "javascript",
      label: "JavaScript",
      description: "Programming for the web",
      type: "core",
      resources: {
        free: [
          { title: "JavaScript.info", url: "https://javascript.info/" },
          { title: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        ],
        videos: [
          { title: "JavaScript Tutorial", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
        ]
      },
      position: { x: 0, y: 7 }
    },
    {
      id: "js-basics",
      label: "JS Basics",
      description: "Variables, functions, loops",
      type: "skill",
      position: { x: -2, y: 8 }
    },
    {
      id: "dom",
      label: "DOM Manipulation",
      description: "Interact with HTML",
      type: "skill",
      position: { x: -1, y: 8 }
    },
    {
      id: "fetch-api",
      label: "Fetch API",
      description: "HTTP requests",
      type: "skill",
      position: { x: 0, y: 8 }
    },
    {
      id: "es6",
      label: "ES6+ Features",
      description: "Modern JavaScript",
      type: "skill",
      position: { x: 1, y: 8 }
    },
    {
      id: "async",
      label: "Async JavaScript",
      description: "Promises & async/await",
      type: "skill",
      position: { x: 2, y: 8 }
    },
    // VERSION CONTROL
    {
      id: "git",
      label: "Git",
      description: "Version control system",
      type: "tool",
      resources: {
        free: [
          { title: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/" },
        ],
        videos: [
          { title: "Git Tutorial", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
        ]
      },
      position: { x: -2, y: 9.5 }
    },
    {
      id: "github",
      label: "GitHub",
      description: "Code hosting platform",
      type: "tool",
      position: { x: -1, y: 9.5 }
    },
    // BUILD TOOLS
    {
      id: "npm",
      label: "npm/yarn",
      description: "Package managers",
      type: "tool",
      position: { x: 1, y: 9.5 }
    },
    {
      id: "webpack",
      label: "Build Tools",
      description: "Webpack, Vite",
      type: "tool",
      position: { x: 2, y: 9.5 }
    },
    // FRAMEWORKS
    {
      id: "react",
      label: "React",
      description: "UI library",
      type: "framework",
      resources: {
        free: [
          { title: "React Docs", url: "https://react.dev/" },
        ],
        videos: [
          { title: "React Tutorial", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
        ]
      },
      position: { x: 0, y: 11 }
    },
    {
      id: "react-hooks",
      label: "React Hooks",
      description: "State management",
      type: "skill",
      position: { x: -1.5, y: 12 }
    },
    {
      id: "react-router",
      label: "React Router",
      description: "Navigation",
      type: "skill",
      position: { x: -0.5, y: 12 }
    },
    {
      id: "state-management",
      label: "State Management",
      description: "Redux, Zustand",
      type: "skill",
      position: { x: 0.5, y: 12 }
    },
    {
      id: "testing",
      label: "Testing",
      description: "Jest, React Testing Library",
      type: "skill",
      position: { x: 1.5, y: 12 }
    },
    // TYPESCRIPT
    {
      id: "typescript",
      label: "TypeScript",
      description: "Type-safe JavaScript",
      type: "language",
      resources: {
        free: [
          { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
        ],
        videos: [
          { title: "TypeScript Course", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
        ]
      },
      position: { x: -2, y: 13 }
    },
    // ADVANCED
    {
      id: "nextjs",
      label: "Next.js",
      description: "React framework",
      type: "framework",
      resources: {
        free: [
          { title: "Next.js Docs", url: "https://nextjs.org/docs" },
        ]
      },
      position: { x: 0, y: 14 }
    },
    {
      id: "ssr",
      label: "SSR/SSG",
      description: "Server-side rendering",
      type: "skill",
      position: { x: -1, y: 15 }
    },
    {
      id: "api-routes",
      label: "API Routes",
      description: "Backend endpoints",
      type: "skill",
      position: { x: 1, y: 15 }
    },
    // DEPLOYMENT
    {
      id: "deployment",
      label: "Deployment",
      description: "Ship your apps",
      type: "devops",
      position: { x: 0, y: 16 }
    },
    {
      id: "vercel",
      label: "Vercel",
      description: "Deploy Next.js apps",
      type: "tool",
      position: { x: -1, y: 17 }
    },
    {
      id: "netlify",
      label: "Netlify",
      description: "Static site hosting",
      type: "tool",
      position: { x: 1, y: 17 }
    },
    // END
    {
      id: "end",
      label: "🎉 Keep Learning",
      description: "You're now a frontend developer!",
      type: "end",
      position: { x: 0, y: 18 },
      style: { special: true }
    },
  ],
  edges: [
    { source: "start", target: "internet" },
    { source: "internet", target: "http" },
    { source: "internet", target: "dns" },
    { source: "http", target: "html" },
    { source: "dns", target: "html" },
    { source: "html", target: "html-basics" },
    { source: "html", target: "semantic-html" },
    { source: "html", target: "forms" },
    { source: "html", target: "accessibility" },
    { source: "html-basics", target: "css" },
    { source: "semantic-html", target: "css" },
    { source: "forms", target: "css" },
    { source: "accessibility", target: "css" },
    { source: "css", target: "css-basics" },
    { source: "css", target: "layouts" },
    { source: "css", target: "responsive" },
    { source: "css", target: "animations" },
    { source: "css", target: "css-frameworks" },
    { source: "css-basics", target: "javascript" },
    { source: "layouts", target: "javascript" },
    { source: "responsive", target: "javascript" },
    { source: "animations", target: "javascript" },
    { source: "css-frameworks", target: "javascript" },
    { source: "javascript", target: "js-basics" },
    { source: "javascript", target: "dom" },
    { source: "javascript", target: "fetch-api" },
    { source: "javascript", target: "es6" },
    { source: "javascript", target: "async" },
    { source: "js-basics", target: "git" },
    { source: "dom", target: "git" },
    { source: "fetch-api", target: "npm" },
    { source: "es6", target: "npm" },
    { source: "async", target: "webpack" },
    { source: "git", target: "github" },
    { source: "github", target: "react" },
    { source: "npm", target: "react" },
    { source: "webpack", target: "react" },
    { source: "react", target: "react-hooks" },
    { source: "react", target: "react-router" },
    { source: "react", target: "state-management" },
    { source: "react", target: "testing" },
    { source: "react-hooks", target: "typescript" },
    { source: "react-router", target: "nextjs" },
    { source: "state-management", target: "nextjs" },
    { source: "testing", target: "nextjs" },
    { source: "typescript", target: "nextjs" },
    { source: "nextjs", target: "ssr" },
    { source: "nextjs", target: "api-routes" },
    { source: "ssr", target: "deployment" },
    { source: "api-routes", target: "deployment" },
    { source: "deployment", target: "vercel" },
    { source: "deployment", target: "netlify" },
    { source: "vercel", target: "end" },
    { source: "netlify", target: "end" },
  ]
};
