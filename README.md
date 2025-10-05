# Resume World

Welcome to Resume World! This project is a web application designed to help users upload their resumes and find job opportunities that match their skills. It features a Python FastAPI backend and a React frontend.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)

## Features

*   **User Management**: Create new user accounts (mocked).
*   **Resume Upload**: Upload a resume file for processing.
*   **Skill Extraction**: Automatically extract skills from the resume (mocked).
*   **Job Listings**: View a list of available job postings.
*   **Job Matching**: Get a match score for jobs based on the skills from an uploaded resume (mocked).

## Technology Stack

*   **Backend**:
    *   [Python 3](https://www.python.org/)
    *   [FastAPI](https://fastapi.tiangolo.com/)
    *   [Pydantic](https://docs.pydantic.dev/)
    *   [Uvicorn](https://www.uvicorn.org/)
*   **Frontend**:
    *   [React](https://reactjs.org/) (inferred from project dependencies)
    *   [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)

## Project Structure

```
ResumeWorld/
├── backend/
│   ├── main.py         # FastAPI application logic and endpoints
│   └── requirements.txt  # Python dependencies
└── frontend/
    ├── node_modules/
    ├── public/
    └── src/            # React application source code
```

## API Endpoints

The backend provides the following API endpoints:

*   `GET /`: Welcome message for the API.
*   `POST /users/`: Create a new user.
    *   **Body**: `{ "email": "user@example.com", "password": "password123" }`
*   `POST /resumes/`: Upload a resume file.
    *   **Body**: `multipart/form-data` with a file.
*   `GET /jobs/`: Retrieve a list of all available jobs.
*   `GET /jobs/match/{resume_id}`: Match jobs for a given resume ID and return a match score.

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

*   Python 3.8+
*   Node.js and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required Python packages:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Run the backend server:**
    The server will start on `http://127.0.0.1:8000`.
    ```sh
    uvicorn main:app --reload
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```sh
    npm install
    ```

3.  **Run the frontend development server:**
    The React app will open in your browser, usually at `http://localhost:3000`.
    ```sh
    npm start
    ```

## Usage

Once both the backend and frontend servers are running, you can open your browser to `http://localhost:3000` to use the application. The frontend will make requests to the backend API running on `http://127.0.0.1:8000`.