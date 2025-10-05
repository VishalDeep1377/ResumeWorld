# ResumeWorld - Streamlining Your Job Search

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/VishalDeep1377/ResumeWorld/graphs/commit-activity)
[![Website](https://img.shields.io/badge/Website-ComingSoon-orange)](https://example.com) <!-- Replace with your actual website link -->

ResumeWorld is a modern web application designed to empower job seekers by providing a seamless platform to upload resumes, extract key skills, and discover relevant job opportunities. Leveraging a robust Python FastAPI backend and a dynamic React frontend, ResumeWorld offers a streamlined and efficient job search experience.

## Key Features

*   **Effortless User Management:** Secure user account creation and authentication (mocked in the current version, future iterations will include full authentication).
*   **Intelligent Resume Parsing:**  Upload your resume in various formats (PDF, DOC, DOCX) and let ResumeWorld automatically extract relevant skills and experience (currently mocked, with plans to integrate NLP libraries for accurate extraction).
*   **Personalized Job Recommendations:**  Receive tailored job recommendations based on your extracted skills and preferences.
*   **Comprehensive Job Listings:** Browse a wide array of job postings aggregated from various sources.
*   **Smart Job Matching Algorithm:**  Get a detailed match score for each job based on your skills, experience, and the job requirements (mocked initially, with future enhancements planned to use machine learning models for improved accuracy).
*   **RESTful API:** Well-documented API endpoints for seamless integration with other services.

## Technology Stack

*   **Backend:**
    *   [Python 3.9+](https://www.python.org/) - The core programming language.
    *   [FastAPI](https://fastapi.tiangolo.com/) - A modern, fast (high-performance), web framework for building APIs.
    *   [Pydantic](https://docs.pydantic.dev/) - Data validation and settings management using Python type annotations.
    *   [Uvicorn](https://www.uvicorn.org/) - An ASGI server for running FastAPI applications.
    *   [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL toolkit and Object Relational Mapper (ORM) (Planned for future database integration).
    *   [pytest](https://docs.pytest.org/en/7.1.x/) - Testing framework.
*   **Frontend:**
    *   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
    *   [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/) - JavaScript runtime and package manager.
    *   [Axios](https://axios-http.com/docs/intro) - Promise based HTTP client for the browser and node.js (inferred from project dependencies).
    *   [Redux](https://redux.js.org/) (Consider implementing for state management in larger applications).
*   **Infrastructure**
    *   [Docker](https://www.docker.com/) (Planned for containerization)
    *   [GitHub Actions](https://github.com/features/actions) (Planned for CI/CD)

## Project Structure

```
ResumeWorld/
├── backend/                # FastAPI backend application
│   ├── app/              # Core application logic
│   │   ├── __init__.py
│   │   ├── api/          # API endpoint definitions
│   │   ├── models/       # Data models (Pydantic)
│   │   ├── services/     # Business logic and services
│   │   └── utils/        # Utility functions
│   ├── tests/            # Backend tests
│   ├── main.py           # FastAPI application entry point
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Docker configuration (future)
├── frontend/               # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # React application source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages/views
│   │   ├── services/     # API client and data fetching
│   │   └── App.js        # Main application component
│   ├── package.json      # Node.js dependencies and scripts
│   └── README.md         # Frontend README
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
└── README.md             # Project README (this file)
```

## API Endpoints

The backend provides a RESTful API with the following endpoints:

*   `GET /`:  Welcome message and API status.
*   `POST /users/`: Create a new user account (mocked).
    *   **Request Body**:
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    *   **Response**: (Example)
        ```json
        {
          "id": 1,
          "email": "user@example.com"
        }
        ```
*   `POST /resumes/`: Upload a resume file.
    *   **Request Body**: `multipart/form-data` with a file (`resume`).
    *   **Response**: (Example)
        ```json
        {
          "resume_id": "unique_resume_id",
          "filename": "uploaded_resume.pdf"
        }
        ```
*   `GET /jobs/`: Retrieve a list of all available jobs.
    *   **Query Parameters**: `limit`, `offset` for pagination.
    *   **Response**: (Example)
        ```json
        [
          { "id": 1, "title": "Software Engineer", "description": "...", "company": "Acme Corp" },
          { "id": 2, "title": "Data Scientist", "description": "...", "company": "Beta Inc" }
        ]
        ```
*   `GET /jobs/match/{resume_id}`: Match jobs for a given resume ID and return a match score.
    *   **Response**: (Example)
        ```json
        [
          { "job_id": 1, "match_score": 0.85 },
          { "job_id": 2, "match_score": 0.70 }
        ]
        ```

## Getting Started

Follow these steps to set up and run ResumeWorld on your local machine.

### Prerequisites

*   [Python 3.9+](https://www.python.org/downloads/)
*   [Node.js](https://nodejs.org/en/download/) (v16 or higher) and [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/))

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/VishalDeep1377/ResumeWorld.git
    cd ResumeWorld
    ```

2.  **Backend Setup:**

    ```sh
    cd backend
    python3 -m venv venv  # Create a virtual environment
    source venv/bin/activate   # Activate the virtual environment (Linux/macOS)
    # OR
    .\venv\Scripts\activate  # Activate the virtual environment (Windows)
    pip install -r requirements.txt  # Install dependencies
    ```

3.  **Frontend Setup:**

    ```sh
    cd ../frontend
    npm install        # Install dependencies (or yarn install)
    ```

### Configuration

1.  **Environment Variables:**

    *   The backend uses environment variables for configuration. Create a `.env` file in the `backend/` directory and define the following variables:

        ```
        DATABASE_URL=postgresql://user:password@host:port/database  # (If using a database)
        SECRET_KEY="your_secret_key"  # For JWT authentication (future)
        # Add other environment variables as needed
        ```

    *   The frontend may also require environment variables. Refer to the frontend's `README.md` for details.

### Running the Application

1.  **Start the Backend Server:**

    ```sh
    cd backend
    uvicorn app.main:app --reload  # Start the server with hot-reloading
    ```

    The backend server will typically run on `http://127.0.0.1:8000`.

2.  **Start the Frontend Development Server:**

    ```sh
    cd frontend
    npm start  # Start the React development server (or yarn start)
    ```

    The frontend application will usually be accessible at `http://localhost:3000`.

## Contributing

We welcome contributions to ResumeWorld! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Write clear and concise commit messages.
4.  Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

[Your Name](mailto:your.email@example.com) - [Your Website](https://example.com)

## Acknowledgements

*   [FastAPI](https://fastapi.tiangolo.com/)
*   [React](https://reactjs.org/)
*   Other libraries and tools used in this project.
