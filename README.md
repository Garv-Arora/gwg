# Gupshup with Garv — Full-Stack JavaScript App

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Initial Setup and Installation](#initial-setup-and-installation)
4. [Creating Configuration Files](#creating-configuration-files)
5. [Package.json (Complete)](#packagejson-complete)
6. [Vite Configuration](#vite-configuration)
7. [Tailwind Configuration](#tailwind-configuration)
8. [PostCSS Configuration](#postcss-configuration)
9. [Project Files](#project-files)
   - [index.html](#indexhtml)
   - [index.js (Express Server)](#indexjs-express-server)
   - [src/main.jsx](#srcmainjsx)
   - [src/App.jsx](#srcappjsx)
   - [src/styles/index.css](#srcstylesindexcss)
   - [server/data/blogPosts.js](#serverdatablogpostsjs)
   - [server/data/products.js](#serverdataproductsjs)
   - [Common Components](#common-components)
     - [Header.jsx](#headerjsx)
     - [Footer.jsx](#footerjsx)
     - [NewsletterCTA.jsx](#newsletterctajsx)
   - [Home Components](#home-components)
     - [LatestBlogPosts.jsx](#latestblogpostsjsx)
     - [FeaturedProducts.jsx](#featuredproductsjsx)
     - [YouTubeSection.jsx](#youtubesectionjsx)
   - [Pages](#pages)
     - [HomePage.jsx](#homepagejsx)
     - [ContactPage.jsx](#contactpagejsx)
     - [BlogPage.jsx (Sample)](#blogpagejsx-sample)
     - [BlogPostPage.jsx (Sample)](#blogpostpagejsx-sample)
     - [StorePage.jsx (Sample)](#storepagejsx-sample)
     - [ProductPage.jsx (Sample)](#productpagejsx-sample)
10. [Running the Project Locally](#running-the-project-locally)
11. [Running the Project on Replit](#running-the-project-on-replit)
12. [Future Enhancements](#future-enhancements)

---

## Overview

This README contains **all** instructions and code for the _“Gupshup with Garv”_ personal brand website. The app is a **full-stack JavaScript** application using:

- **React** + **Vite** for the frontend
- **Tailwind CSS** for styling
- **Express.js** for the backend API
- **In-memory data** for blog posts and products (MVP)
- **React Router** for client-side routing
- **Framer Motion** for animations
- **Nodemailer** (placeholder usage) for future mailing features
- **Axios** for making API requests

The code below is intentionally large and somewhat repetitive so nothing is lost.

---

## Project Structure

Below is the intended folder structure:

```
gupshup-with-garv/
├── index.html
├── index.js              // Main Express server
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .replit               // (For Replit - optional)
├── replit.nix            // (For Replit - optional)
├── server/
│   └── data/
│       ├── blogPosts.js
│       └── products.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── index.css
    ├── assets/
    │   └── images/
    │       └── logo.png
    ├── components/
    │   ├── common/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── NewsletterCTA.jsx
    │   ├── home/
    │   │   ├── LatestBlogPosts.jsx
    │   │   ├── FeaturedProducts.jsx
    │   │   └── YouTubeSection.jsx
    │   ├── blog/         // (Optional expansions)
    │   ├── store/        // (Optional expansions)
    │   ├── youtube/      // (Optional expansions)
    │   └── contact/      // (Optional expansions)
    └── pages/
        ├── HomePage.jsx
        ├── BlogPage.jsx              // Sample code or expansions
        ├── BlogPostPage.jsx          // Sample code or expansions
        ├── StorePage.jsx             // Sample code or expansions
        ├── ProductPage.jsx           // Sample code or expansions
        └── ContactPage.jsx
```

---

## Initial Setup and Installation

1. **Clone or create** a new project folder named `gupshup-with-garv`.
2. **Initialize** a new `package.json`:
   ```bash
   npm init -y
   ```
3. **Install dependencies**:
   ```bash
   npm install react react-dom react-router-dom axios framer-motion react-icons react-markdown express cors nodemailer
   npm install --save-dev @vitejs/plugin-react vite tailwindcss postcss autoprefixer concurrently nodemon @tailwindcss/typography @tailwindcss/forms
   ```

---

## Creating Configuration Files

> You will need four main configuration files in the **root** of the project:
> 
> - `vite.config.js`
> - `tailwind.config.js`
> - `postcss.config.js`
> - `.replit` (optional, for Replit usage)

These files enable Vite, Tailwind, and (on Replit) the run commands.

---

## package.json (Complete)

Below is a **sample** complete `package.json` with all scripts mentioned:

```jsonc
{
  "name": "gupshup-with-garv",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "build": "vite build",
    "preview": "vite preview",
    "dev:server": "nodemon index.js",
    "dev:client": "vite",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
  },
  "dependencies": {
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "framer-motion": "^10.16.4",
    "nodemailer": "^6.9.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.11.0",
    "react-markdown": "^9.0.0",
    "react-router-dom": "^6.18.0"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

---

## Vite Configuration

Create `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

---

## Tailwind Configuration

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-orange': '#FF8800',
        'brand-gold': '#FFD700',
        'brand-white': '#FFFFFF',
        'brand-gray': '#AAAAAA',
        'brand-red': '#FF4444',
        'brand-yellow': '#FFDD22',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 136, 0, 0.7), 0 0 20px rgba(255, 136, 0, 0.5)',
        'neon-hover': '0 0 15px rgba(255, 136, 0, 0.8), 0 0 30px rgba(255, 136, 0, 0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
};
```

---

## PostCSS Configuration

Create `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Project Files

Below are **all** the main project files. Copy these exactly into your structure to avoid missing lines.

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/src/assets/images/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gupshup with Garv</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    >
  </head>
  <body class="bg-brand-black text-brand-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### index.js (Express Server)

```js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Import our data
const blogPosts = require('./server/data/blogPosts');
const products = require('./server/data/products');

// In-memory storage for MVP
const subscribers = [];
const contactMessages = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/blog', (req, res) => {
  const { category, tag, search } = req.query;
  let filteredPosts = [...blogPosts];

  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post =>
      post.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredPosts);
});

app.get('/api/blog/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = [...products];

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if email already exists
  const exists = subscribers.some(sub => sub.email === email);

  if (exists) {
    return res.status(400).json({ message: 'Email already subscribed' });
  }

  // Add to subscribers
  subscribers.push({
    id: subscribers.length + 1,
    email,
    date: new Date()
  });

  res.status(201).json({ message: 'Successfully subscribed' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Store message
  contactMessages.push({
    id: contactMessages.length + 1,
    name,
    email,
    message,
    date: new Date()
  });

  res.status(201).json({ message: 'Message sent successfully' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // For development, just serve the API and let Vite handle the frontend
  app.get('/', (req, res) => {
    res.send('API is running. Frontend is served by Vite.');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### src/main.jsx

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### src/App.jsx

```js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import ContactPage from './pages/ContactPage';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:id" element={<ProductPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

---

### src/styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-brand-black text-brand-white;
  margin: 0;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-heading font-bold;
}

@layer components {
  .btn {
    @apply px-6 py-3 rounded-xl font-medium transition-all duration-300;
  }
  
  .btn-primary {
    @apply bg-brand-orange text-brand-white shadow-neon hover:shadow-neon-hover;
  }
  
  .btn-outline {
    @apply border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-white;
  }
  
  .card {
    @apply bg-gray-900 rounded-2xl p-6 shadow-lg;
  }

  .glow-text {
    text-shadow: 0 0 10px rgba(255, 136, 0, 0.7), 0 0 20px rgba(255, 136, 0, 0.5);
  }
}
```

---

### server/data/blogPosts.js

```js
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI: How It Will Transform Our Daily Lives',
    excerpt: 'Artificial intelligence is evolving at a rapid pace. Here\'s how it will change the way we live and work in the coming years.',
    content: `# The Future of AI: How It Will Transform Our Daily Lives
Artificial intelligence is evolving at a rapid pace, and its impact on our daily lives is becoming increasingly profound. From virtual assistants that anticipate our needs to autonomous vehicles navigating our streets, AI technologies are reshaping how we live, work, and interact with the world around us.
## The Current State of AI
AI has already made significant inroads into our daily routines. Consider these applications:
- **Smart Assistants**: Devices like Amazon Echo, Google Home, and Apple's Siri have become commonplace in homes, helping with tasks ranging from setting timers to controlling smart home devices.
- **Recommendation Systems**: Streaming services like Netflix and Spotify use AI to suggest content based on your preferences and viewing/listening history.
- **Smartphone Features**: From predictive text to portrait mode photography, AI enhances many smartphone functions we use daily.
## The Near Future: What's Coming in the Next 5 Years
The next few years will see AI becoming more sophisticated and integrated into our lives in several key ways:
### 1. Personalized Healthcare
AI is set to revolutionize healthcare through:
- Predictive diagnostics that can identify potential health issues before symptoms appear
- Personalized treatment plans based on individual genetic profiles
- AI-assisted surgeries with greater precision and lower risk
### 2. Autonomous Transportation
While fully autonomous vehicles are still developing, we'll see:
- More advanced driver assistance systems becoming standard in new vehicles
- Autonomous public transportation in controlled environments
- Delivery drones and robots in urban areas
## Conclusion
The future with AI promises extraordinary benefits—from solving complex global challenges to enhancing our daily lives in countless ways. At the same time, it requires thoughtful navigation of new ethical territories and social adjustments.
What aspects of AI are you most excited or concerned about? I'd love to hear your thoughts in the comments below.`,
    category: 'Tech & Products',
    date: 'March 25, 2025',
    image: 'https://source.unsplash.com/random/900x600/?tech,ai',
    tags: ['AI', 'Technology', 'Future'],
  },
  {
    id: 2,
    title: 'Mindfulness Practices That Actually Work According to Science',
    excerpt: 'Not all mindfulness practices are created equal. These science-backed techniques can truly transform your mental state.',
    content: `# Mindfulness Practices That Actually Work According to Science
In a world filled with constant distractions and information overload, the practice of mindfulness has emerged as a powerful antidote. But with so many approaches and techniques being promoted, it can be challenging to determine which mindfulness practices are truly effective and which are simply passing trends.
## What is Mindfulness?
At its core, mindfulness is the ability to be fully present and engaged in the current moment, aware of your thoughts and feelings without distraction or judgment. It's about experiencing life as it unfolds, moment by moment, with curiosity and acceptance.
## Science-Backed Mindfulness Practices
### 1. Mindfulness-Based Stress Reduction (MBSR)
Developed by Jon Kabat-Zinn at the University of Massachusetts Medical School, MBSR is perhaps the most extensively researched mindfulness program.
**Key Practice**: Body Scan Meditation
Set aside 20-30 minutes to systematically focus your attention on different parts of your body, starting from your toes and moving up to the top of your head. Notice sensations without trying to change them—simply observe with curiosity.
### 2. Focused Attention Meditation
This fundamental meditation technique involves focusing on a single point of reference, such as the breath.
**Key Practice**: Breath Awareness
Sit comfortably with your spine erect. Direct your attention to the sensation of your breath—either at the nostrils, chest, or abdomen. When your mind wanders (which it inevitably will), gently bring your attention back to your breath without judgment.
## Conclusion
While mindfulness isn't a panacea, the scientific evidence strongly supports its effectiveness for enhancing mental well-being, improving attention, and fostering compassion. By incorporating these evidence-based practices into your routine, you can cultivate a more aware, balanced, and engaged relationship with your life.
What has your experience been with mindfulness practices? I'd love to hear what's worked for you in the comments below.`,
    category: 'Psychology & Mind Hacks',
    date: 'March 20, 2025',
    image: 'https://source.unsplash.com/random/900x600/?meditation,mindfulness',
    tags: ['Mindfulness', 'Psychology', 'Mental Health'],
  },
  {
    id: 3,
    title: 'How I Built a Six-Figure Business: Lessons Learned',
    excerpt: 'The honest truth about what it takes to build a successful business in today\'s competitive landscape.',
    content: `# How I Built a Six-Figure Business: Lessons Learned
Building a successful business is rarely a straightforward journey. My path to creating a six-figure business came with its share of challenges, pivots, and valuable lessons. In this post, I want to share the most important insights I've gained, hoping they might help others on their entrepreneurial journey.
## The Beginning: Finding My Why
Every successful business starts with a compelling "why." For me, it wasn't simply about making money—though financial freedom was certainly a goal. My deeper motivation was to create solutions that genuinely helped people while allowing me to work on my own terms.
**Key Lesson #1**: Identify a purpose beyond profit. When times get tough (and they will), this deeper motivation will sustain you.
## Market Research: The Foundation of Success
Before investing significant time and resources, I spent three months conducting thorough market research:
- Identifying problems and pain points in my target market
- Analyzing existing solutions and their limitations
- Speaking directly with potential customers about their needs
- Evaluating competition and finding gaps in the market
This research phase was crucial—it prevented me from creating a product no one wanted.
## The MVP Approach: Start Small, Learn Fast
Rather than attempting to build a perfect product from the start, I developed a Minimum Viable Product (MVP) that addressed the core problem. This allowed me to:
- Get my solution to market quickly
- Gather real user feedback
- Iterate based on actual user behavior rather than assumptions
- Generate early revenue to fund further development
## Conclusion
Building a six-figure business has been the most challenging and rewarding journey of my professional life. While there's no guaranteed formula for success, I hope these lessons provide some valuable guidance for your own entrepreneurial path.
Remember that most overnight successes actually take years. Stay patient, remain adaptable, and keep learning—success often comes to those who persist through the inevitable challenges along the way.
What business challenges are you currently facing? I'd love to hear from you in the comments below.`,
    category: 'Life Lessons & Real Talks',
    date: 'March 15, 2025',
    image: 'https://source.unsplash.com/random/900x600/?business,success',
    tags: ['Business', 'Entrepreneurship', 'Growth'],
  }
];

module.exports = blogPosts;
```

---

### server/data/products.js

```js
const products = [
  {
    id: 1,
    title: 'Advanced Productivity Mastery Course',
    description: 'Learn proven techniques to 10x your productivity and accomplish more in less time.',
    longDescription: `# Advanced Productivity Mastery Course
Are you tired of feeling overwhelmed, constantly busy yet never making meaningful progress on your important goals? The Advanced Productivity Mastery Course offers a comprehensive system for dramatically increasing your effectiveness while reducing stress and burnout.
## What You'll Learn
- The science of focus and how to achieve deep work consistently
- Energy management techniques that work better than traditional time management
- How to design your ideal week for maximum productivity
- Task prioritization frameworks for making high-impact decisions
- Digital minimalism strategies to eliminate distractions
- Habit stacking methods to automate your productivity
- How to measure and track your productivity metrics that actually matter`,
    price: 99.99,
    category: 'Courses',
    image: 'https://source.unsplash.com/random/900x600/?productivity,course',
    highlights: [
      '12 hours of video instruction',
      '30+ downloadable worksheets',
      'Private community access',
      'Quarterly live Q&A sessions',
    ],
    featured: true,
  },
  {
    id: 2,
    title: 'Mindfulness Meditation Bundle',
    description: 'A collection of guided meditations and tools to help you develop a consistent mindfulness practice.',
    longDescription: `# Mindfulness Meditation Bundle
Develop a consistent meditation practice with this comprehensive bundle of guided meditations, tools, and resources designed for both beginners and experienced practitioners.
## What's Included
### 40+ Guided Meditation Recordings
- **Beginner Series**: 10 progressive sessions to build your foundation
- **Focus & Concentration**: 8 practices to sharpen attention
- **Emotional Balance**: 10 meditations for working with difficult emotions
- **Compassion Practices**: 6 heart-centered meditations
- **Sleep & Relaxation**: 8 sessions for deep rest and better sleep`,
    price: 49.99,
    category: 'Meditation Kits',
    image: 'https://source.unsplash.com/random/900x600/?meditation,mindfulness',
    highlights: [
      '40+ guided meditation recordings',
      'Digital meditation journal',
      'Mindfulness in daily life guide',
      'Techniques for beginners and experienced practitioners',
    ],
    featured: true,
  },
  {
    id: 3,
    title: 'Gupshup Premium Journal',
    description: 'High-quality journal designed specifically for daily reflection and growth planning.',
    longDescription: `# Gupshup Premium Journal
The Gupshup Premium Journal combines thoughtful design with high-quality materials to create the ultimate tool for reflection, planning, and personal growth.
## Features & Details
### Premium Materials
- Luxurious vegan leather cover that gets better with age
- 192 pages of premium 100 gsm cream paper
- Smyth-sewn binding that lays flat when open
- Double satin ribbon markers
- Elastic closure band
- Back pocket for notes and mementos`,
    price: 29.99,
    category: 'Merch',
    image: 'https://source.unsplash.com/random/900x600/?journal,notebook',
    highlights: [
      'Premium vegan leather cover',
      '192 pages of 100 gsm cream paper',
      'Thoughtful prompts and frameworks',
      'Smyth-sewn binding lays flat when open',
    ],
    featured: true,
  }
];

module.exports = products;
```

---

## Common Components

### Header.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollPosition > 50 ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Gupshup with Garv" className="h-12 md:h-16" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
            <NavLink to="/blog" isActive={isActive('/blog')}>Blog</NavLink>
            <NavLink to="/store" isActive={isActive('/store')}>Store</NavLink>
            <NavLink to="/contact" isActive={isActive('/contact')}>Contact</NavLink>
            <Link to="/store" className="btn btn-primary ml-4">
              Visit Store
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brand-white text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden fixed top-0 right-0 h-screen w-full bg-brand-black z-40 ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
        initial={{ x: '100%' }}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
          <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink to="/blog" onClick={toggleMenu}>Blog</MobileNavLink>
          <MobileNavLink to="/store" onClick={toggleMenu}>Store</MobileNavLink>
          <MobileNavLink to="/contact" onClick={toggleMenu}>Contact</MobileNavLink>
          <Link to="/store" className="btn btn-primary mt-8" onClick={toggleMenu}>
            Visit Store
          </Link>
        </div>
      </motion.div>
    </header>
  );
};

const NavLink = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`font-medium transition-all duration-300 hover:text-brand-orange ${
      isActive ? 'text-brand-orange' : 'text-brand-white'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    className="text-2xl font-medium text-brand-white hover:text-brand-orange transition-all duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;
```

---

### Footer.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaDiscord } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Gupshup with Garv" className="h-12" />
            </Link>
            <p className="text-brand-gray mb-6">
              Unfiltered talks on tech, psychology & everything in between
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://twitter.com" icon={<FaTwitter />} label="Twitter" />
              <SocialLink href="https://instagram.com" icon={<FaInstagram />} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={<FaLinkedin />} label="LinkedIn" />
              <SocialLink href="https://youtube.com" icon={<FaYoutube />} label="YouTube" />
              <SocialLink href="https://discord.com" icon={<FaDiscord />} label="Discord" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/store">Store</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Categories</h3>
            <ul className="space-y-3">
              <FooterLink to="/blog?category=tech">Tech & Products</FooterLink>
              <FooterLink to="/blog?category=psychology">Psychology & Mind Hacks</FooterLink>
              <FooterLink to="/blog?category=life">Life Lessons & Real Talks</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-brand-gray mb-4">
              Real, raw thoughts once a week. No spam.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-brand-gray">
            © {new Date().getFullYear()} Gupshup with Garv. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-brand-gray hover:text-brand-orange transition-colors duration-300 text-xl"
    aria-label={label}
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-brand-gray hover:text-brand-orange transition-colors duration-300">
      {children}
    </Link>
  </li>
);

export default Footer;
```

---

### NewsletterCTA.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';

const NewsletterCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 glow-text">
            Join the Conversation
          </h2>
          <p className="text-lg text-brand-gray mb-8 md:px-12">
            Real, raw thoughts once a week. No spam, no fluff - just authentic insights on tech, psychology, and life.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-brand-orange text-white"
                required
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-sm text-brand-gray">
              By subscribing, you agree to receive emails from Gupshup with Garv. No spam, promise!
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
```

---

## Home Components

### LatestBlogPosts.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// For MVP, we're directly importing blogPosts
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI: How It Will Transform Our Daily Lives',
    excerpt: 'Artificial intelligence is evolving at a rapid pace. Here\'s how it will change the way we live and work in the coming years.',
    category: 'Tech & Products',
    date: 'March 25, 2025',
    image: 'https://source.unsplash.com/random/600x400/?tech,ai',
    tags: ['AI', 'Technology', 'Future'],
  },
  {
    id: 2,
    title: 'Mindfulness Practices That Actually Work According to Science',
    excerpt: 'Not all mindfulness practices are created equal. These science-backed techniques can truly transform your mental state.',
    category: 'Psychology & Mind Hacks',
    date: 'March 20, 2025',
    image: 'https://source.unsplash.com/random/600x400/?meditation,mindfulness',
    tags: ['Mindfulness', 'Psychology', 'Mental Health'],
  },
  {
    id: 3,
    title: 'How I Built a Six-Figure Business: Lessons Learned',
    excerpt: 'The honest truth about what it takes to build a successful business in today\'s competitive landscape.',
    category: 'Life Lessons & Real Talks',
    date: 'March 15, 2025',
    image: 'https://source.unsplash.com/random/600x400/?business,success',
    tags: ['Business', 'Entrepreneurship', 'Growth'],
  },
];

const LatestBlogPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // In a real app, we would fetch from the API
    setPosts(blogPosts);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <BlogPostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};

const BlogPostCard = ({ post, index }) => {
  return (
    <motion.article
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/blog/${post.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-brand-orange px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="text-brand-gray text-sm mb-2">{post.date}</div>

        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-brand-orange transition-colors duration-300">
            {post.title}
          </h3>
        </Link>

        <p className="text-brand-gray mb-4">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-700 text-brand-gray text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/blog/${post.id}`}
          className="text-brand-orange font-medium hover:underline"
        >
          Read More
        </Link>
      </div>
    </motion.article>
  );
};

export default LatestBlogPosts;
```

---

### FeaturedProducts.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

// For MVP, we're directly importing products
const products = [
  {
    id: 1,
    title: 'Advanced Productivity Mastery Course',
    description: 'Learn proven techniques to 10x your productivity and accomplish more in less time.',
    price: 99.99,
    category: 'Courses',
    image: 'https://source.unsplash.com/random/600x400/?productivity,course',
  },
  {
    id: 2,
    title: 'Mindfulness Meditation Bundle',
    description: 'A collection of guided meditations and tools to help you develop a consistent mindfulness practice.',
    price: 49.99,
    category: 'Meditation Kits',
    image: 'https://source.unsplash.com/random/600x400/?meditation,mindfulness',
  },
  {
    id: 3,
    title: 'Gupshup Premium Journal',
    description: 'High-quality journal designed specifically for daily reflection and growth planning.',
    price: 29.99,
    category: 'Merch',
    image: 'https://source.unsplash.com/random/600x400/?journal,notebook',
  },
  {
    id: 4,
    title: 'Digital Minimalism Guide',
    description: 'A comprehensive ebook on how to declutter your digital life and regain focus in a distracted world.',
    price: 19.99,
    category: 'Digital Products',
    image: 'https://source.unsplash.com/random/600x400/?digital,minimalism',
  },
];

const FeaturedProducts = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // In a real app, we would fetch from the API
    setItems(products);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  return (
    <motion.article
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/store/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-brand-orange px-3 py-1 rounded-full text-xs font-medium">
            {product.category}
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/store/${product.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-brand-orange transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        <p className="text-brand-gray mb-4 text-sm">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-brand-white font-bold">${product.price.toFixed(2)}</span>
          <button className="bg-brand-orange hover:bg-brand-orange/90 text-white p-2 rounded-full">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProducts;
```

---

### YouTubeSection.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

// Mock data for MVP
const videos = [
  {
    id: 'video1',
    title: 'How Technology is Changing Our Brains | Gupshup Podcast #42',
    thumbnail: 'https://source.unsplash.com/random/600x400/?technology,brain',
    views: '12K',
    date: '2 weeks ago',
    duration: '48:22',
    playlist: 'Podcast Episodes',
  },
  {
    id: 'video2',
    title: 'The Most Powerful Morning Routine I\'ve Ever Tried',
    thumbnail: 'https://source.unsplash.com/random/600x400/?morning,routine',
    views: '45K',
    date: '1 month ago',
    duration: '15:47',
    playlist: 'Deep Dives',
  },
  {
    id: 'video3',
    title: 'This AI Tool Will Change Everything',
    thumbnail: 'https://source.unsplash.com/random/600x400/?ai,future',
    views: '78K',
    date: '3 weeks ago',
    duration: '12:18',
    playlist: 'Shorts',
  },
];

const YouTubeSection = () => {
  const [activePlaylist, setActivePlaylist] = React.useState('All');

  const playlists = ['All', 'Podcast Episodes', 'Shorts', 'Deep Dives'];

  const filteredVideos = activePlaylist === 'All'
    ? videos
    : videos.filter(video => video.playlist === activePlaylist);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        {playlists.map(playlist => (
          <button
            key={playlist}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activePlaylist === playlist
                ? 'bg-brand-orange text-white'
                : 'bg-gray-800 text-brand-gray hover:bg-gray-700'
            }`}
            onClick={() => setActivePlaylist(playlist)}
          >
            {playlist}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
};

const VideoCard = ({ video, index }) => {
  return (
    <motion.article
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
        <div className="relative group">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center">
              <FaPlay className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 text-xs">
            {video.duration}
          </div>
          <div className="absolute top-2 left-2 bg-brand-orange px-2 py-1 rounded-full text-xs">
            {video.playlist}
          </div>
        </div>
      </a>

      <div className="p-4">
        <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg font-semibold mb-2 hover:text-brand-orange transition-colors duration-300 line-clamp-2">
            {video.title}
          </h3>
        </a>

        <div className="flex justify-between text-sm text-brand-gray">
          <span>{video.views} views</span>
          <span>{video.date}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default YouTubeSection;
```

---

## Pages

### HomePage.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

// Components
import LatestBlogPosts from '../components/home/LatestBlogPosts';
import FeaturedProducts from '../components/home/FeaturedProducts';
import YouTubeSection from '../components/home/YouTubeSection';
import NewsletterCTA from '../components/common/NewsletterCTA';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black opacity-90"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 z-10 pt-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.img
              src={logo}
              alt="Gupshup with Garv"
              className="h-32 md:h-40 mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />
            
            <motion.h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 glow-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Unfiltered talks on tech, psychology & everything in between
            </motion.h1>
            
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Gupshup with Garv Intro"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link to="/blog" className="btn btn-primary">
                Read the Blog
              </Link>
              <Link to="/store" className="btn btn-outline">
                Visit the Store
              </Link>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Watch on YouTube
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Blog Posts</h2>
            <Link to="/blog" className="flex items-center text-brand-orange hover:underline">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <LatestBlogPosts />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/store" className="flex items-center text-brand-orange hover:underline">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <FeaturedProducts />
        </div>
      </section>
      
      {/* YouTube Videos */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Videos</h2>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-brand-orange hover:underline"
            >
              YouTube Channel <FaArrowRight className="ml-2" />
            </a>
          </div>
          
          <YouTubeSection />
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <NewsletterCTA />
    </>
  );
};

export default HomePage;
```

---

### ContactPage.jsx

```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaDiscord } from 'react-icons/fa';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formState);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };
  
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 glow-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl text-brand-gray max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a question, feedback, or just want to say hello? I'd love to hear from you!
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <motion.div
              className="bg-gray-900 rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-brand-orange font-medium mb-2">Email</h3>
                  <p className="text-brand-gray">hello@gupshupwithgarv.com</p>
                </div>
                
                <div>
                  <h3 className="text-brand-orange font-medium mb-2">Location</h3>
                  <p className="text-brand-gray">Mumbai, India</p>
                </div>
                
                <div>
                  <h3 className="text-brand-orange font-medium mb-4">Connect on Social</h3>
                  <div className="flex space-x-4">
                    <SocialLink href="https://twitter.com" icon={<FaTwitter />} label="Twitter" />
                    <SocialLink href="https://instagram.com" icon={<FaInstagram />} label="Instagram" />
                    <SocialLink href="https://linkedin.com" icon={<FaLinkedin />} label="LinkedIn" />
                    <SocialLink href="https://youtube.com" icon={<FaYoutube />} label="YouTube" />
                    <SocialLink href="https://discord.com" icon={<FaDiscord />} label="Discord" />
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Join the Community</h3>
                <p className="text-brand-gray mb-6">
                  Connect with like-minded individuals in our Discord community.
                </p>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Join Discord
                </a>
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              className="bg-gray-900 rounded-2xl p-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-400/10 border border-green-400 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-brand-gray">Thank you for reaching out. I'll get back to you soon!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-brand-gray mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-brand-gray mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-brand-gray mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full bg-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full flex justify-center items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-brand-gray hover:bg-brand-orange hover:text-white transition-colors duration-300"
    aria-label={label}
  >
    {icon}
  </a>
);

export default ContactPage;
```

---

### BlogPage.jsx (Sample)

Below is a **sample** structure for a `BlogPage.jsx` if you want it. Feel free to customize:

```jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

// Mock data for MVP
import { blogPosts } from '../data/blogData'; // Or from server

const BlogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState('');
  
  useEffect(() => {
    // Simulating API call to fetch blog posts
    setPosts(blogPosts);
    setFilteredPosts(blogPosts);
    
    // Update URL with query params
    if (selectedCategory && selectedCategory !== 'all') {
      queryParams.set('category', selectedCategory);
      navigate(`?${queryParams.toString()}`);
    }
  }, []);
  
  useEffect(() => {
    // Filter posts based on search term, category, and tag
    let result = [...posts];
    
    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(post =>
        post.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    if (selectedTag) {
      result = result.filter(post =>
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }
    
    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, selectedTag, posts]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedTag('');
    
    // Update URL with query params
    if (category && category !== 'all') {
      queryParams.set('category', category);
    } else {
      queryParams.delete('category');
    }
    navigate(`?${queryParams.toString()}`);
  };
  
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
  };
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'tech', name: 'Tech & Products' },
    { id: 'psychology', name: 'Psychology & Mind Hacks' },
    { id: 'life', name: 'Life Lessons & Real Talks' },
  ];
  
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 glow-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Blog
          </motion.h1>
          <motion.p
            className="text-xl text-brand-gray max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Unfiltered thoughts, insights, and discoveries on tech, psychology, and life.
          </motion.p>
        </div>
        
        {/* ... remainder of your blog listing here ... */}
      </div>
    </div>
  );
};

export default BlogPage;
```

---

### BlogPostPage.jsx (Sample)

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FaArrowLeft, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

// Example from local data
import { blogPosts } from '../data/blogData'; // or fetch from server

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // For MVP, read from local array
    const fetchedPost = blogPosts.find(p => p.id === parseInt(id));
    
    if (fetchedPost) {
      setPost(fetchedPost);
    } else {
      setError('Post not found');
    }
    
    setLoading(false);
    window.scrollTo(0, 0);
  }, [id]);
  
  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading post...</p>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-brand-gray mb-6">{error || 'Post not found'}</p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <Link to="/blog" className="inline-flex items-center text-brand-orange mb-6 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Blog
        </Link>
        
        <article>
          <header className="mb-12">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {post.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center text-brand-gray mb-8">
              <span className="mr-4">{post.date}</span>
              <span className="mr-4">|</span>
              <span className="bg-brand-orange px-3 py-1 rounded-full text-white text-sm">
                {post.category}
              </span>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-brand-gray text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gray hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  <FaTwitter />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gray hover:bg-blue-700 hover:text-white transition-colors duration-300">
                  <FaFacebook />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gray hover:bg-blue-600 hover:text-white transition-colors duration-300">
                  <FaLinkedin />
                </button>
              </div>
            </div>
          </header>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
```

---

### StorePage.jsx (Sample)

```jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

// Mock data for MVP
import { products } from '../data/productData'; // or from server

const StorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'all');
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    setAllProducts(products);
    setFilteredProducts(products);

    if (selectedCategory && selectedCategory !== 'all') {
      queryParams.set('category', selectedCategory);
      navigate(`?${queryParams.toString()}`);
    }
  }, []);

  useEffect(() => {
    let result = [...allProducts];

    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, allProducts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    if (category && category !== 'all') {
      queryParams.set('category', category);
    } else {
      queryParams.delete('category');
    }
    navigate(`?${queryParams.toString()}`);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    // Real app: handle quantity, store in localStorage, etc.
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'courses', name: 'Courses' },
    { id: 'digital', name: 'Digital Products' },
    { id: 'meditation', name: 'Meditation Kits' },
    { id: 'merch', name: 'Merch' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 glow-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Store
          </motion.h1>
          <motion.p
            className="text-xl text-brand-gray max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tools, courses, and merch to elevate your mind, skills, and life.
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-1/4">
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-gray-800 px-4 py-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray" />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`text-left w-full px-3 py-2 rounded-lg transition-colors duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-brand-orange text-white'
                            : 'text-brand-gray hover:bg-gray-800'
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    className="w-full accent-brand-orange"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-brand-gray">
                  <span>$0</span>
                  <span>$200</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-2xl">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-brand-gray">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable ProductCard
function ProductCard({ product, index, onAddToCart }) {
  return (
    <motion.article
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-brand-orange px-3 py-1 rounded-full text-xs font-medium">
          {product.category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 hover:text-brand-orange transition-colors duration-300">
          {product.title}
        </h3>
        
        <p className="text-brand-gray mb-4 text-sm">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-brand-white font-bold">${product.price.toFixed(2)}</span>
          <button
            className="bg-brand-orange hover:bg-brand-orange/90 text-white p-2 rounded-full"
            onClick={onAddToCart}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default StorePage;
```

---

### ProductPage.jsx (Sample)

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FaArrowLeft, FaShoppingCart, FaCheck } from 'react-icons/fa';

// Example from local data
import { products } from '../data/productData'; // or fetch from server

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchedProduct = products.find(p => p.id === parseInt(id));
    
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      setError('Product not found');
    }
    setLoading(false);
    window.scrollTo(0, 0);
  }, [id]);
  
  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading product...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-brand-gray mb-6">{error || 'Product not found'}</p>
          <Link to="/store" className="btn btn-primary">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <Link to="/store" className="inline-flex items-center text-brand-orange mb-6 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Store
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            className="rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="mb-2">
                <span className="bg-brand-orange px-3 py-1 rounded-full text-white text-sm">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.title}
              </h1>
              
              <p className="text-xl text-brand-gray mb-6">
                {product.description}
              </p>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</h2>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Highlights</h3>
              <ul className="space-y-2 mb-8">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand-orange mr-2 mt-1">
                      <FaCheck />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <button className="btn btn-primary w-full flex items-center justify-center">
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16">
          <div className="bg-gray-900 p-8 rounded-2xl prose prose-lg prose-invert max-w-none">
            <ReactMarkdown>{product.longDescription}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
```

---

## Running the Project Locally

1. **Install Dependencies** (if you haven’t already):
   ```bash
   npm install
   ```
2. **Run in Development Mode** (both server and client with concurrency):
   ```bash
   npm run dev
   ```
   - This runs **Express** on port 3000 (by default) and **Vite** on port 5173 (by default).  
   - The frontend is served at `http://localhost:5173` and proxies `/api` calls to `http://localhost:3000`.
3. **Build for Production**:
   ```bash
   npm run build
   ```
   - This will create a `dist` folder with optimized frontend assets.

4. **Serve Production Build**:
   ```bash
   npm start
   ```
   - This uses the Express server to serve the static `dist` files and the API at the same time.

---

## Future Enhancements

- **Database Integration** (e.g., PostgreSQL or MongoDB) to store blog posts, products, subscribers, etc.
- **Admin Dashboard** for managing blog posts, products, and user submissions
- **Payment Gateway Integration** (Stripe/Razorpay) for actual e-commerce
- **YouTube API Integration** to automatically fetch the latest videos
- **Podcast Integration** if you plan on hosting podcasts
- **Authentication & Authorization** for secure, multi-user roles
- **Improved Email Services** with Nodemailer or an external service
