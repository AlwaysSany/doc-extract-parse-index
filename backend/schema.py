

# Pydantic schema for document extraction
from pydantic import BaseModel, Field


class Document(BaseModel):
    name: str = Field(description="Full name of candidate")
    email: str = Field(description="Email address")
    phone: str = Field(description="Phone number", default="")
    location: str = Field(description="Location/Address of candidate", default="")
    skills: list[str] = Field(description="Technical skills and technologies")
    experience: list[str] = Field(description="Work experience with company, position, duration")
    education: list[str] = Field(description="Education details with degree, institution, year")
    projects: list[str] = Field(description="Projects with name, description, technologies used")
    languages: list[str] = Field(description="Languages spoken by the candidate", default=[])
    linkedin: str = Field(description="LinkedIn profile URL", default="")
    github: str = Field(description="GitHub profile URL", default="")
    twitter: str = Field(description="Twitter profile URL", default="")
    website: str = Field(description="Personal or portfolio website URL", default="")
    awards: list[str] = Field(description="Awards or recognitions received", default=[])
    hobbies: list[str] = Field(description="Hobbies or interests", default=[])
    certifications: list[str] = Field(description="Certifications with name, issuing organization, year", default=[])
    achievements: list[str] = Field(description="Achievements or notable accomplishments", default=[])
    references: list[str] = Field(description="References with name, contact information", default=[])
    # Additional fields for enhanced information
    additional_info: dict = Field(description="Any additional information or notes", default={})
    # Optional fields for summary or objective  
    summary: str = Field(description="Professional summary or objective", default="")
    objective: str = Field(description="Career objective or goal", default="")
    # Optional fields for custom metadata
    metadata: dict = Field(description="Custom metadata for the document", default={})
