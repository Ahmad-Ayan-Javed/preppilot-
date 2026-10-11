# PrepPilot 🚀
### AI-Powered Mock Interview & ATS Resume Analysis Platform

PrepPilot is a modern, production-grade web application engineered for candidates preparing for competitive software engineering, product, and tech roles. It combines a transparent **5-Pillar ATS Resume Scoring Engine** with **Company-Specific Prep Kits** and **Real-Time Adaptive AI Mock Interviews**.

---

## 🌟 Core Features

### 1. Resume Upload & ATS Auditor
- **Multi-Format Parsing**: Upload PDF or DOCX documents (up to 5 MB) parsed via `pdf-parse` and `mammoth`.
- **Transparent 5-Pillar ATS Breakdown (0–100 Score)**:
  - **Formatting & Parseability (20%)**: Section structure, length heuristics, and standard header detection.
  - **Keyword Match (30%)**: Technical ontologies compared against the target Job Description (JD).
  - **Section Completeness (15%)**: Contact information, Summary, Experience, Education, Skills, and Projects.
  - **Impact & Quantification (20%)**: Identification of Google XYZ achievement metrics (`%`, `$`, scale multipliers).
  - **Grammar, Clarity & Brevity (15%)**: Action verb openers vs passive responsibility statements.
- **AI Bullet Point Rewriter**: Before-and-after diff cards showing how to rewrite weak bullets into high-impact Google XYZ achievements.
- **Prioritized Top 10 Fixes**: Actionable checklists categorized by `HIGH`, `MEDIUM`, and `LOW` priority.
- **Resume Version History**: Track score progression across iterations.

### 2. Company-Specific Interview Prep Kits
- Tailored prep kits for companies like **Stripe, Google, Amazon, Meta**, or any custom company and role.
- **DNA & Culture**: Authentic engineering culture principles and leadership values.
- **Rounds Breakdown**: Expected timeline, durations, and hiring bar criteria for each round.
- **Targeted Question Bank**: Insider questions with hints and key talking points.
- **Skill Gap Matrix**: Identifies gaps between your resume and the target role with targeted study plans.

### 3. Live AI Mock Interview Room
- **AI Persona Bar Raiser**: Dynamic interviewer persona asking adaptive follow-ups based on the candidate's previous response and resume context.
- **Live Timers**: Configurable question count and countdown timer with visual alerts.
- **Voice Mode**:
  - **Speech-to-Text (STT)**: Hands-free answering using the Web Speech API.
  - **Text-to-Speech (TTS)**: Realistic AI interviewer voice synthesis.
- **Controls**: Skip question, repeat question, or conclude the session early.

### 4. Post-Interview Feedback & Analytics
- **Rubric Evaluations**: Scores across **STAR Method**, **Technical Accuracy**, **Communication Clarity**, **Confidence**, and **Relevance**.
- **Ideal 10/10 Model Answers**: Synthesized high-bar responses for every question asked.
- **Strengths, Weaknesses & Top 3 Tactical Tips**.
- **PDF Export**: Print/export performance reports directly to PDF.

### 5. Technical Coding Round (Sandbox)
- Integrated **Monaco Editor** with language support for TypeScript, JavaScript, and Python.
- Automated AI code review evaluating algorithmic correctness, time/space complexity, and code clean principles.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Code Editor**: `@monaco-editor/react` (Monaco Sandbox)
- **Database**: PostgreSQL with Prisma ORM (configured with SQLite for zero-config local run)
- **Authentication**: NextAuth.js (Credentials + demo account + Google OAuth ready)
- **AI Layer**: Google Gemini API (`@google/generative-ai`) behind a decoupled provider abstraction (`/lib/ai`) with deterministic local fallback
- **Parsing**: `pdf-parse`, `mammoth`
- **Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (Node v24 LTS recommended)
- **npm** or **pnpm**

### 2. Clone and Install
```bash
git clone <repo-url> preppilot
cd preppilot
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```
Key variables in `.env`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db" # Or postgresql://postgres:postgrespassword@localhost:5432/preppilot
NEXTAUTH_SECRET="preppilot-super-secret-key-32chars"
GEMINI_API_KEY="" # Optional: Add your key from https://aistudio.google.com
GEMINI_MODEL="gemini-1.5-flash"
```

### 4. Database Setup & Seed
Initialize the database and populate realistic seed data (demo user, sample resume, ATS report, prep kit):
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 5. Start the Application
```bash
npm run dev
# Or production build:
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 👤 Demo Login Credentials

For instant testing without signing up, use the **One-Click Demo Login** button on `/login` or enter:
- **Email**: `alex@example.com`
- **Password**: `password123`

---

## 🧪 Running Unit Tests

To run the automated test suite verifying the ATS section parser, heuristic metric counter, 5-pillar calculation, and prompt-injection resilience:
```bash
npx tsx tests/unit/ats-scoring.test.ts
```

---

## 🐳 Docker Deployment (Optional PostgreSQL)

To run local PostgreSQL in Docker:
```bash
docker compose up -d
```
Update `.env` to point to:
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/preppilot?schema=public"
```
Switch `prisma/schema.prisma` provider to `postgresql` or copy from `prisma/schema.postgresql.prisma`.
