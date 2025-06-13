# doc-extract-parse-index

A simple web app for document extraction, parsing, and indexing. This project allows users to upload documents, extract their contents, parse relevant information, and index them for search and retrieval.

## Table of Contents

- [doc-extract-parse-index](#doc-extract-parse-index)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Requirements](#project-requirements)
  - [Dependencies](#dependencies)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
    - [Standalone Setup](#standalone-setup)
    - [Dockerized Setup](#dockerized-setup)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)

## Introduction

`doc-extract-parse-index` is designed to streamline the workflow of extracting, parsing, and indexing documents via a web interface. It supports various document formats and provides an easy-to-use API and UI for managing document data.

## Project Requirements

- Python 3.13.3+
- Node.js 14+ (if frontend is present)
- pip (Python package manager)
- Docker (for containerized setup)
- Docker Compose (for multi-service orchestration)

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
  

3. **Frontend Setup (if applicable):**
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
- Search and retrieve indexed documents.

## License

MIT License

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussion.

