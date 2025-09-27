## AI-Powered Interview Assistant 
## Project info

**URL**: https://ai-powered-interview-assistant-dun.vercel.app/

# Crisp — AI-Powered Interview Assistant

**Crisp** is a React-based web application designed to simulate an AI-powered interview process for full-stack candidates. It provides both an **Interviewee (Chat)** experience and an **Interviewer (Dashboard)** for managing candidate evaluations.

---

## Features

### Interviewee (Chat)
- Upload resume (PDF required, DOCX optional)
- Automatic extraction of Name, Email, Phone from resume
- Chatbot prompts candidate to fill missing fields
- Timed AI-generated interview:
  - 6 questions: 2 Easy → 2 Medium → 2 Hard
  - Timers per question: Easy 20s, Medium 60s, Hard 120s
  - Auto-submit on timer expiration
- AI-generated final score and summary
- Resume interrupted sessions with **“Welcome Back”** modal

### Interviewer (Dashboard)
- List of candidates with sortable and searchable table
- View candidate profile, chat history, and final AI summary
- Detailed view showing questions, answers, and AI scores
- Supports pause/resume for ongoing interviews

### Data Persistence
- State management with **Redux**
- Persistent storage using **redux-persist / IndexedDB**
- All answers, timers, and progress are restored on page reload

---

## Tech Stack
- **Frontend:** React, Redux, Ant Design / shadcn/ui
- **File Parsing:** PDF/DOCX parsing libraries (e.g., `pdfjs-dist`, `docx`)
- **Timers:** Per-question countdown with auto-submit
- **State Persistence:** Redux + redux-persist / IndexedDB
- **Optional AI:** OpenAI API for dynamic question generation and scoring

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crisp-interview-assistant.git
cd crisp-interview-assistant
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
Open http://localhost:3000 in your browser.

Folder Structure
php
Copy code
crisp-interview-assistant/
├── public/
├── src/
│   ├── components/      # React components (Chat, Dashboard, Modals)
│   ├── pages/           # Interviewee and Interviewer pages
│   ├── redux/           # Redux store, slices, and persistence
│   ├── utils/           # Helper functions (resume parsing, AI logic)
│   ├── App.js           # Main app with routing
│   └── index.js
├── package.json
└── README.md
Usage
Candidate: Upload resume → Fill missing info → Answer AI-generated questions

Interviewer: Monitor candidates, view chat history, see AI scoring and summaries

Future Improvements
Integrate real AI for question generation and scoring using OpenAI API

Add multi-role interview support

Enhance UI with animations and better responsive design

Support additional resume formats (e.g., TXT, RTF)

License
This project is MIT licensed.

Author
Supriya Lankotu

Location: Tirupati, Andhra Pradesh

GitHub: yourusername

