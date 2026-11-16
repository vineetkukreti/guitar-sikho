# GuitarSikho 🎸

An open-source guitar learning web app with a real-time tuner, Bollywood song tabs, and an AI-powered tutor — built with React, FastAPI, and Claude.

## Features

- **Guitar Tuner** — Real-time pitch detection via microphone using Web Audio API
- **Bollywood Tabs** — Browse and view guitar tabs for Hindi songs
- **AI Chat Tutor** — Multi-agent system powered by Claude (senior tutor + tab finder + tuning assistant)
- **Lessons** — Structured beginner-to-advanced guitar lessons

## Tech Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS  |
| Backend  | Python, FastAPI, Uvicorn                  |
| AI       | Anthropic Claude API (claude-sonnet-4-6)  |

## Project Structure

```
music/
├── backend/
│   ├── agents/          # AI agents (tutor, tab finder, tuning assistant)
│   ├── routes/          # API routes (chat, tabs, tuner, lessons)
│   ├── services/        # Pitch detection, tab service
│   ├── data/            # Hindi tabs and lessons JSON
│   └── main.py          # FastAPI entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Tuner, TabViewer, AgentChat, Navbar
│   │   ├── pages/       # Home, TunerPage, TabsPage, LearnPage
│   │   └── hooks/       # useAudioCapture, useAgentChat
│   └── index.html
├── env_template.txt
└── run.sh               # One-command startup script
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup & Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/vineetkukreti/guitar-sikho.git
   cd guitar-sikho
   ```

2. **Configure environment**

   ```bash
   cp env_template.txt .env
   # Edit .env and add your ANTHROPIC_API_KEY (the only required variable)
   ```

3. **Start the app** (installs all deps automatically)

   ```bash
   chmod +x run.sh
   ./run.sh
   ```

4. Open your browser:
   - App: http://localhost:5173
   - API docs: http://localhost:8000/docs

### Manual Setup (optional)

**Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Contributing

Contributions are welcome! Here are some ways to get involved:

- Add more Bollywood/Hindi song tabs to `backend/data/hindi_tabs.json`
- Improve pitch detection accuracy in `backend/services/pitch_detection.py`
- Add new lessons to `backend/data/lessons.json`
- Build new AI agents in `backend/agents/`
- Improve the UI/UX

### How to contribute

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep PRs focused — one feature or fix per PR.

## License

No license file has been added yet, so all rights are reserved by default. Open an issue if you'd like to reuse the code.
