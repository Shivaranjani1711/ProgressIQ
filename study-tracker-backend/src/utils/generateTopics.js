/**
 * generateTopics.js
 * Builds a 125-topic dataset across 10 categories, each topic tagged with
 * category/difficulty/estimatedHours plus one reliable official resource link.
 * Run with: node generateTopics.js  -> writes topics.json
 */
const fs = require('fs');

// One trusted, official resource per category - avoids guessing per-topic URLs
const CATEGORY_RESOURCE = {
  javascript: { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'doc' },
  react: { title: 'React Documentation', url: 'https://react.dev/learn', type: 'doc' },
  node: { title: 'Node.js Documentation', url: 'https://nodejs.org/en/docs', type: 'doc' },
  database: { title: 'MongoDB Documentation', url: 'https://www.mongodb.com/docs/', type: 'doc' },
  dsa: { title: 'freeCodeCamp - DSA', url: 'https://www.freecodecamp.org/news/tag/data-structures/', type: 'course' },
  cs: { title: 'CS50 (Harvard)', url: 'https://cs50.harvard.edu/x/', type: 'course' },
  devops: { title: 'Docker Documentation', url: 'https://docs.docker.com/', type: 'doc' },
  python: { title: 'Python Official Docs', url: 'https://docs.python.org/3/', type: 'doc' },
  frontend: { title: 'MDN - CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', type: 'doc' },
  testing: { title: 'Jest Documentation', url: 'https://jestjs.io/docs/getting-started', type: 'doc' },
};

const raw = {
  javascript: {
    difficulty: 'beginner',
    items: [
      ['Variables & Data Types', 'Understand var/let/const, primitive vs reference types'],
      ['Functions & Scope', 'Function declarations, expressions, arrow functions, and scope chains'],
      ['Closures', 'How inner functions retain access to outer scope variables'],
      ['The this Keyword', 'How this is bound in different invocation contexts'],
      ['Prototypes & Inheritance', 'Prototype chain and classical vs prototypal inheritance'],
      ['ES6+ Features', 'let/const, template literals, arrow functions, default params'],
      ['Promises', 'Creating and chaining promises for async operations'],
      ['Async/Await', 'Writing readable asynchronous code on top of promises'],
      ['The Event Loop', 'Call stack, task queue, and microtasks explained'],
      ['Array Methods', 'map, filter, reduce, and other functional array operations'],
      ['Destructuring & Spread', 'Unpacking arrays/objects and spreading values'],
      ['ES Modules', 'import/export syntax and module bundling basics'],
      ['Error Handling', 'try/catch, custom errors, and async error handling'],
      ['Debugging with DevTools', 'Breakpoints, watch expressions, and the console'],
      ['JSON & Serialization', 'Parsing, stringifying, and working with JSON data'],
    ],
  },
  react: {
    difficulty: 'intermediate',
    items: [
      ['JSX & the Virtual DOM', 'How JSX compiles and React reconciles the DOM'],
      ['Components & Props', 'Building reusable components and passing data down'],
      ['State with useState', 'Managing local component state'],
      ['useEffect & Lifecycle', 'Side effects, dependencies, and cleanup functions'],
      ['Conditional Rendering', 'Rendering UI based on state and props'],
      ['Lists & Keys', 'Rendering collections efficiently with stable keys'],
      ['Forms & Controlled Inputs', 'Handling form state and validation'],
      ['Context API', 'Sharing state without prop drilling'],
      ['useRef & useMemo', 'DOM refs and memoizing expensive computations'],
      ['Custom Hooks', 'Extracting and reusing stateful logic'],
      ['React Router', 'Client-side routing and protected routes'],
      ['Performance Optimization', 'React.memo, code-splitting, and lazy loading'],
      ['Error Boundaries', 'Catching rendering errors gracefully'],
      ['Testing React Components', 'React Testing Library fundamentals'],
      ['State Management (Redux/Zustand)', 'Managing global app state at scale'],
    ],
  },
  node: {
    difficulty: 'intermediate',
    items: [
      ['Node.js Runtime & Event Loop', 'How Node executes JS outside the browser'],
      ['npm & Package Management', 'Dependencies, semver, and package.json'],
      ['File System Module', 'Reading and writing files with fs'],
      ['Express Basics & Routing', 'Setting up routes and route parameters'],
      ['Middleware', 'Request/response pipeline and custom middleware'],
      ['REST API Design', 'Resource naming, status codes, and versioning'],
      ['Error Handling in Express', 'Centralized error middleware patterns'],
      ['Authentication with JWT', 'Issuing and verifying tokens'],
      ['File Uploads (Multer)', 'Handling multipart form data'],
      ['Environment Variables', 'Config management with dotenv'],
      ['Rate Limiting & Security Headers', 'Protecting APIs from abuse'],
      ['WebSockets with Socket.io', 'Real-time bidirectional communication'],
    ],
  },
  database: {
    difficulty: 'intermediate',
    items: [
      ['MongoDB Basics', 'Documents, collections, and CRUD operations'],
      ['Mongoose ODM', 'Schemas, models, and validation'],
      ['Schema Design', 'Designing documents for query patterns'],
      ['Indexing', 'Speeding up queries with the right indexes'],
      ['Aggregation Pipeline', 'Multi-stage data transformation queries'],
      ['Embedding vs Referencing', 'Choosing document relationships correctly'],
      ['Transactions', 'Multi-document ACID transactions in MongoDB'],
      ['SQL Fundamentals', 'SELECT, WHERE, JOIN, and GROUP BY basics'],
      ['Joins & Normalization', 'Relational design and normal forms'],
      ['PostgreSQL Basics', 'Setting up and querying a Postgres database'],
      ['Database Design Principles', 'Choosing SQL vs NoSQL for a use case'],
      ['Redis Caching', 'Key-value caching to speed up repeated reads'],
    ],
  },
  dsa: {
    difficulty: 'advanced',
    items: [
      ['Big-O Notation', 'Analyzing time and space complexity'],
      ['Arrays & Strings', 'Core operations and common interview patterns'],
      ['Linked Lists', 'Singly/doubly linked lists and pointer manipulation'],
      ['Stacks & Queues', 'LIFO/FIFO structures and their applications'],
      ['Hash Tables', 'Hashing, collisions, and O(1) lookups'],
      ['Trees & BSTs', 'Traversals and binary search tree operations'],
      ['Graphs & Traversals', 'BFS, DFS, and graph representations'],
      ['Recursion & Backtracking', 'Breaking problems into subproblems'],
      ['Sorting Algorithms', 'Merge sort, quick sort, and complexity trade-offs'],
      ['Searching Algorithms', 'Binary search and its variants'],
      ['Dynamic Programming', 'Memoization and tabulation techniques'],
      ['Greedy Algorithms', 'Locally optimal choices for global solutions'],
      ['Sliding Window', 'Efficient subarray/substring techniques'],
      ['Two Pointers', 'Solving array problems in linear time'],
      ['Heaps & Priority Queues', 'Min/max heaps and their use cases'],
    ],
  },
  cs: {
    difficulty: 'intermediate',
    items: [
      ['OOP Principles', 'Encapsulation, inheritance, polymorphism, abstraction'],
      ['SOLID Principles', 'Writing maintainable object-oriented code'],
      ['Design Patterns', 'Singleton, factory, observer, and other common patterns'],
      ['Operating Systems Basics', 'Processes, threads, and memory management'],
      ['Computer Networks Basics', 'TCP/IP, DNS, and HTTP fundamentals'],
      ['Database Normalization', 'Reducing redundancy in relational schemas'],
      ['System Design Basics', 'Scalability, load balancing, and caching layers'],
      ['Time & Space Complexity Analysis', 'Formally analyzing algorithm efficiency'],
    ],
  },
  devops: {
    difficulty: 'intermediate',
    items: [
      ['Git & Version Control', 'Branching, merging, and resolving conflicts'],
      ['GitHub Workflows & PRs', 'Collaborating with pull requests and reviews'],
      ['Docker Basics', 'Containerizing an application'],
      ['Docker Compose', 'Multi-container local development setups'],
      ['CI/CD Pipelines', 'Automating tests and deployments'],
      ['Linux Command Line', 'Navigating and scripting in a Unix shell'],
      ['AWS Fundamentals', 'Core services: EC2, S3, IAM'],
      ['Cloud Deployment (Render/Vercel)', 'Shipping apps to production hosts'],
      ['Kubernetes Basics', 'Pods, deployments, and services'],
      ['Nginx & Reverse Proxies', 'Routing traffic and serving static assets'],
      ['Monitoring & Logging', 'Observability for production systems'],
      ['Infrastructure as Code', 'Managing infra with declarative config'],
    ],
  },
  python: {
    difficulty: 'beginner',
    items: [
      ['Python Syntax Basics', 'Variables, control flow, and indentation rules'],
      ['Data Types & Collections', 'Lists, tuples, dicts, and sets'],
      ['Functions & Modules', 'Defining reusable code and importing modules'],
      ['OOP in Python', 'Classes, inheritance, and abstract base classes'],
      ['File Handling', 'Reading and writing files with context managers'],
      ['Exception Handling', 'try/except/finally and custom exceptions'],
      ['List/Dict Comprehensions', 'Concise, Pythonic data transformations'],
      ['Virtual Environments', 'Isolating project dependencies'],
      ['Working with APIs (requests)', 'Making HTTP calls from Python'],
      ['Flask Basics', 'Building a lightweight REST API'],
    ],
  },
  frontend: {
    difficulty: 'beginner',
    items: [
      ['HTML Semantics', 'Writing meaningful, accessible markup'],
      ['CSS Box Model', 'Margin, border, padding, and content sizing'],
      ['Flexbox & Grid', 'Modern CSS layout systems'],
      ['Responsive Design', 'Media queries and mobile-first layouts'],
      ['CSS Preprocessors (Sass)', 'Variables, nesting, and mixins'],
      ['Accessibility (a11y)', 'ARIA roles and keyboard navigation'],
      ['Web Performance', 'Lighthouse metrics and load-time optimization'],
      ['Browser Rendering', 'How the browser paints a page'],
      ['TypeScript Basics', 'Static typing on top of JavaScript'],
      ['Tailwind CSS', 'Utility-first styling workflow'],
    ],
  },
  testing: {
    difficulty: 'intermediate',
    items: [
      ['Unit Testing (Jest)', 'Writing isolated tests for functions and modules'],
      ['Integration Testing', 'Testing how modules work together'],
      ['TDD Principles', 'Red-green-refactor development cycle'],
      ['Web Security Basics (XSS/CSRF)', 'Common vulnerabilities and mitigations'],
      ['OWASP Top 10', 'Industry-standard list of web security risks'],
      ['API Security', 'Rate limiting, auth, and input validation'],
    ],
  },
};

const topics = [];
let hourBase = { beginner: 2, intermediate: 3, advanced: 4 };

const CATEGORY_MAP = {
  javascript: 'language',
  python: 'language',
  react: 'frontend',
  frontend: 'frontend',
  node: 'backend',
  database: 'database',
  devops: 'devops',
  dsa: 'other',
  cs: 'other',
  testing: 'other',
};

for (const [category, group] of Object.entries(raw)) {
  group.items.forEach(([title, description], idx) => {
    topics.push({
      title,
      description,
      category: CATEGORY_MAP[category],
      difficulty: group.difficulty,
      estimatedHours: hourBase[group.difficulty] + (idx % 3),
      resources: [CATEGORY_RESOURCE[category]],
      // sequential prerequisite within the same category (first item has none)
      _prereqTitle: idx > 0 ? group.items[idx - 1][0] : null,
      _group: category,
    });
  });
}

fs.writeFileSync('topics.json', JSON.stringify(topics, null, 2));
console.log(`Generated ${topics.length} topics -> topics.json`);
