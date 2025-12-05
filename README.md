# 🧠 INSIGHTS — AI-Powered Knowledge & News Feed

> **INSIGHTS** is a personalized, AI-curated platform that connects ideas, research papers, and news across technology, AI, and innovation.  
> Designed for students, researchers, and enthusiasts who want **daily or weekly digests** from trusted sources — summarized by AI.

---

## 🌟 Key Features

- 🎯 **Personalized AI Feed** — Get curated articles, blogs, and research papers based on your interests
- 🧠 **AI Summaries** — Clear, concise, and relevant summaries powered by Google Gemini AI
- 📰 **Cross-Source Aggregation** — Pulls insights from TechCrunch, Hacker News, ArXiv, MIT, and more
- 📅 **AI Digest Mode** — Choose between daily or weekly summaries delivered to your inbox
- 💾 **Save for Later** — Bookmark your favorite insights
- 🔐 **Google OAuth** — Secure authentication via Supabase
- 📧 **Email Notifications** — Stay updated with digest emails via Resend

---

## 🛠️ Tech Stack

### Frontend
| Category | Tools / Frameworks |
|----------|-------------------|
| Framework | **React 18** with **Vite** |
| Styling | **Tailwind CSS** |
| Routing | **React Router DOM v7** |
| Animations | **Framer Motion**, **Three.js**, **Vanta.js** |
| PDF Viewer | **@react-pdf-viewer** |
| Auth | **Supabase Auth UI** |

### Backend
| Category | Tools / Frameworks |
|----------|-------------------|
| Runtime | **Node.js** with **TypeScript** |
| Framework | **Express 5** |
| Database | **Supabase (PostgreSQL)** |
| AI | **Google Generative AI (Gemini)** |
| Scheduling | **node-cron** |
| Email | **Resend** |
| Scraping | **Cheerio**, **RSS Parser** |
| PDF Parsing | **pdfjs-dist** |

---

## 📁 Project Structure

```
Insight/
├── frontend/           # React Vite application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── ...
│   └── package.json
│
├── backend/            # Express TypeScript server
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic & integrations
│   │   ├── jobs/       # Background jobs & scrapers
│   │   ├── middleware/ # Auth & utility middleware
│   │   └── scheduler.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **pnpm** (recommended for backend) or **npm**
- **Supabase** project with configured auth
- **Google Gemini API** key
- **Resend** API key (for emails)

### Environment Variables

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:3000
```

#### Backend (`backend/.env`)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret
```

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
👉 Opens at **http://localhost:5173**

#### Backend
```bash
cd backend
pnpm install
pnpm dev
```
👉 Runs at **http://localhost:3000**

---

## 📜 Available Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run compiled production build |
| `pnpm test-fetch` | Test content fetching scripts |

---

## 🔮 Upcoming Features

- 📱 **Mobile APK** — Native Android app
- 🔔 **Push Notifications** — Real-time alerts
- 👤 **User Profiles** — Customizable profiles & preferences
- 📊 **Analytics Dashboard** — Track reading habits

---

## 📄 License

ISC License

---

<p align="center">
  Made with ❤️ for knowledge seekers
</p>