from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import io
import os
import httpx
from dotenv import load_dotenv

# New imports for resume parsing
import docx
import PyPDF2

load_dotenv()

app = FastAPI(title="Resume World API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LinkedIn OAuth2 credentials
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")

# Models
class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    email: str

class Resume(BaseModel):
    id: int
    user_id: int
    content: str
    skills: List[str]

class Job(BaseModel):
    id: int
    title: str
    description: str
    skills_required: List[str]

class LinkedInCallback(BaseModel):
    code: str
    redirect_uri: str

# Predefined list of skills to look for in resumes.
# In a real-world application, this could be stored in a database.
SKILLS_DB = [
    'python', 'java', 'c++', 'c#', 'javascript', 'typescript', 'html', 'css', 'sql', 'nosql',
    'react', 'angular', 'vue', 'django', 'flask', 'fastapi', 'spring', 'node.js', 'nodejs',
    'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud',
    'machine learning', 'data science', 'artificial intelligence', 'deep learning', 'nlp',
    'api', 'rest', 'graphql',
    'agile', 'scrum', 'project management',
    'figma', 'sketch', 'adobe xd',
    'autocad', 'solidworks', 'blender',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'
]

# Mock database
users_db = []
resumes_db = []
jobs_db = [
    {
        "id": 1,
        "title": "Frontend Developer",
        "description": "We're looking for a skilled frontend developer with React experience.",
        "skills_required": ["React", "JavaScript", "CSS", "HTML"]
    },
    {
        "id": 2,
        "title": "Backend Developer",
        "description": "Backend developer with Python and FastAPI experience needed.",
        "skills_required": ["Python", "FastAPI", "SQL", "API Design"]
    },
    {
        "id": 3,
        "title": "Full Stack Developer",
        "description": "Full stack developer with React and Python experience.",
        "skills_required": ["React", "Python", "JavaScript", "FastAPI"]
    }
]

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Resume World API"}

@app.post("/users/", response_model=User)
def create_user(user: UserCreate):
    user_id = len(users_db) + 1
    users_db.append({"id": user_id, "email": user.email, "password": user.password})
    return {"id": user_id, "email": user.email}

@app.post("/resumes/")
async def upload_resume(file: UploadFile = File(...)):
    """
    Uploads a resume, parses it for text, and extracts a list of skills.
    Supports PDF (.pdf) and Word (.docx) files.
    """
    content = ""
    try:
        file_bytes = await file.read()
        file_stream = io.BytesIO(file_bytes)

        if file.content_type == 'application/pdf':
            pdf_reader = PyPDF2.PdfReader(file_stream)
            for page in pdf_reader.pages:
                content += page.extract_text() or ""
        elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            doc = docx.Document(file_stream)
            for para in doc.paragraphs:
                content += para.text + "\n"
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or DOCX file.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume file: {str(e)}")

    # Extract skills from the content
    extracted_skills = set()
    content_lower = content.lower()
    for skill in SKILLS_DB:
        # Use word boundaries to avoid matching substrings (e.g., 'java' in 'javascript')
        if f' {skill.lower()} ' in content_lower or content_lower.startswith(f'{skill.lower()} '):
            # Capitalize each word in multi-word skills like 'Machine Learning'
            extracted_skills.add(" ".join(s.capitalize() for s in skill.split()))

    # --- New: Generate Resume Analysis and Cover Letter ---
    analysis = {
        "mistakes": [
            "Resume lacks a professional summary. A summary helps recruiters quickly understand your background.",
            "Some bullet points are descriptive rather than achievement-oriented. Use action verbs and quantify results.",
            "Contact information could be more prominent."
        ],
        "suggestions": [
            "Add a 2-3 sentence 'Professional Summary' at the top highlighting your key skills and career goals.",
            "Rewrite bullet points to show impact. Instead of 'Worked on a project', try 'Developed a feature that increased user engagement by 15%'.",
            "Ensure your email, phone number, and LinkedIn profile URL are clearly visible at the top of the resume."
        ]
    }

    skills_string = ", ".join(list(extracted_skills)[:5])
    cover_letter_text = f"""Dear Hiring Manager,

I am writing to express my keen interest in a role at your company. With a strong foundation in technologies like {skills_string}, I am confident that I possess the skills and experience necessary to be a valuable asset to your team.

My resume highlights my ability to [mention a key achievement from your resume, e.g., 'lead projects to successful completion' or 'develop efficient and scalable software solutions']. I am particularly drawn to this opportunity because [mention something specific about the company or role].

I am eager to learn more about this opportunity and discuss how my background can contribute to your organization's success. Thank you for your time and consideration.

Sincerely,
[Your Name]
"""
    
    resume_id = len(resumes_db) + 1
    resume = {
        "id": resume_id,
        "user_id": 1,  # Mock user ID
        "content": content,
        "skills": list(extracted_skills)
    }
    resumes_db.append(resume)
    
    return {
        "id": resume_id,
        "skills": list(extracted_skills),
        "analysis": analysis,
        "cover_letter_text": cover_letter_text
    }

@app.get("/jobs/")
def get_jobs():
    return jobs_db

@app.get("/jobs/match/{resume_id}")
def match_jobs(resume_id: int):
    # In a real app, we would implement a matching algorithm
    # For now, return all jobs with a mock score
    return [
        {"job": job, "match_score": 0.85} for job in jobs_db
    ]

@app.post("/linkedin/callback")
async def linkedin_callback(callback_data: LinkedInCallback):
    """
    Handles the OAuth 2.0 callback from LinkedIn.
    Exchanges the authorization code for an access token.
    """
    if not LINKEDIN_CLIENT_ID or not LINKEDIN_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="LinkedIn API credentials are not configured on the server."
        )

    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    params = {
        "grant_type": "authorization_code",
        "code": callback_data.code,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
        "redirect_uri": callback_data.redirect_uri,
    }

    async with httpx.AsyncClient() as client:
        try:
            token_response = await client.post(token_url, data=params)
            token_response.raise_for_status()
            token_data = token_response.json()
            access_token = token_data.get("access_token")

            if not access_token:
                raise HTTPException(status_code=400, detail="Could not retrieve access token from LinkedIn.")

            # --- Fetch basic profile information ---
            profile_url = "https://api.linkedin.com/v2/userinfo"
            headers = {"Authorization": f"Bearer {access_token}"}
            profile_response = await client.get(profile_url, headers=headers)
            profile_response.raise_for_status()
            profile_data = profile_response.json()

            # In a real app, you would save the user and tokens to your database here.
            # For now, we just return the profile data and token.
            return {
                "accessToken": access_token,
                "profile": profile_data
            }

        except httpx.HTTPStatusError as e:
            # Log the error details from LinkedIn for easier debugging
            error_detail = e.response.json() if e.response.content else str(e)
            raise HTTPException(status_code=e.response.status_code, detail=error_detail)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)