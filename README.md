# Shared Emotional AI Space

AI-powered platform for anonymous mood check-ins, emotional analysis, and group wellbeing insights.

## Prerequisites

Make sure the following software is installed:

* Git
* Node.js (LTS version)
* Python 3.10+
* pip

---

## Clone Repository

```bash
git clone <REPOSITORY_URL>
cd shared-emotional-ai-space
```

---

## Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add:

```env
DATABASE_URL=YOUR_DATABASE_URL
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Testing

Example group codes:

```text
HAI-2026
AI-LAB
```

Expected flow:

1. Open the frontend.
2. Enter a valid group code.
3. Join the group.
4. Redirect to the Check-in page.

---

## Development Workflow

Before starting work:

```bash
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature-name
```

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push -u origin feature-name
```

Create a Pull Request on GitHub and merge into `main`.
