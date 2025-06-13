## Introduction

`doc-extract-parse-index` is designed to streamline the workflow of extracting, parsing, and indexing documents via a web interface. It supports various document formats and provides an easy-to-use API and UI for managing document data.

## Table of Contents

- [doc-extract-parse-index](#doc-extract-parse-index)
  - [Table of Contents](#table-of-contents)
  - [Project Requirements](#project-requirements)
  - [Dependencies](#dependencies)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
    - [Standalone Setup](#standalone-setup)
    - [Dockerized Setup](#dockerized-setup)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
   - [Inspiration](#inspiration)
   - [ToDo's](#todos)
   - [Resources](#resources)


## Project Requirements

- Python 3.13.3+
- Node.js 18+ (if frontend is present)
- UV/PIP (Python package manager)
- Docker (for containerized setup)
- Docker Compose (for multi-service orchestration)
- PostgreSQL (for database management)
- LlamaCloud (for document indexing and search capabilities)

## Dependencies

- Flask (backend web framework)
- PostgreSQL (database)
- React(frontend)
- Dependencies as listed in `requirements.txt` or `package.json`

## Project Structure

```
doc-extract-parse-index/
├── backend/                # Backend source code (API, models, services)
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── frontend/               # Frontend source code (optional)
│   ├── package.json
│   └── ...
├── uploads/                   # Uploaded or processed documents
├── Dockerfile              # Dockerfile for backend (and/or frontend)
├── docker-compose.yml      # Docker Compose configuration
├── README.md
└── ...
```

## Setup Instructions

### Standalone Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd doc-extract-parse-index
   ```

2. **Backend Setup:**

Create and updated the environment variables in `.env` file in the backend directory, you can use the `.env.example` as a template.

From the project root directory, 

```bash

   cp .env.example .env
   ```

Then, update the `.env` file with your PostgreSQL database credentials and other LlamaCloud configurations.

Then run **backend** service first, 

Using `pip`:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```

Using `uv`,

    ```bash
    cd backend
    uv venv --python 3.13.3 venv
    source venv/bin/activate 
    uv sync
    uv run app.py
    ```
  

3. **Frontend Setup (if needed):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the app:**
   - Backend API: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

### Dockerized Setup

1. **Build and run using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the app:**
   - Backend API: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

## Usage

- Upload documents via the web UI or API.
- Extract and parse content automatically.
- Search and retrieve indexed documents, **right now it stores the documents in a local postgres database instead of LlamaCloud to keep it simple**

## License

MIT License

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussion. Check the `CONTRIBUTING.md` file for more details and To Do items before start contributing.

## Inspiration

This video is a comprehensive tutorial on using LlamaExtract, a tool by LamaIndex, to automatically extract structured information from unstructured documents like PDFs and images. You'll learn how to define extraction schemas, use the graphical user interface and the Python SDK, manage extraction agents, process documents in batches, handle advanced configurations, and optimize extraction for real-world scenarios (like resumes or invoices). Thanks to the creator of LlamaCloud for providing such an informative resource and also a big thanks to [Alejandro AO](https://github.com/alejandro-ao) for the initial codebase and inspiration on his youtube video here: [![LlamaExtract Tutorial](https://img.youtube.com/vi/8b1k2j4g5hY/0.jpg)](https://www.youtube.com/watch?v=ISFmkrwJpcg)


## ToDo's

- [ ] Use LlamaCloud to index uploaded documents.
- [ ] Implement advanced search features using LlamaCloud on indexed documents.
- [ ] Add unit tests for backend services.
- [ ] Improve frontend UI/UX.
- [ ] Add more document format support (e.g., PDF, DOCX).
- [ ] Implement user authentication and authorization.
- [ ] Optimize performance for large document sets.
- [ ] Add error handling and logging.
- [ ] Create comprehensive documentation for API endpoints.
- [ ] Set up CI/CD pipeline for automated testing and deployment.
- [ ] Implement rate limiting and security measures for the API.
- [ ] Add support for multiple languages in document processing.

## Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [LlamaCloud Documentation](https://docs.cloud.llamaindex.ai/)