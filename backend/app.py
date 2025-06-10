# app.py
import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

from utils import safe_json_load
from database import get_db_connection, init_database
from llamaextract import setup_llamaextract

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# LlamaExtract configuration
os.environ['LLAMA_CLOUD_API_KEY'] = os.getenv('LLAMA_CLOUD_API_KEY')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Initialize on startup
init_database()
extract_agent = setup_llamaextract()

# Flask routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    results = []

    for file in files:
        if file.filename == '':
            continue
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to avoid conflicts
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filename = timestamp + filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                # Extract data using LlamaExtract
                result = extract_agent.extract(filepath)
                extracted_data = result.data
                
                # Store in database
                resume_id = store_resume_data(filename, extracted_data)
                
                results.append({
                    'id': str(resume_id),
                    'filename': filename,
                    'status': 'success',
                    'data': extracted_data
                })
                
                # Clean up file
                os.remove(filepath)
                
            except Exception as e:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'error': str(e)
                })
                # Clean up file on error
                if os.path.exists(filepath):
                    os.remove(filepath)
    
    return jsonify({'results': results})

def store_resume_data(filename, data):
    """Store extracted document data in PostgreSQL"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Prepare data for insertion
    skills = data.get('skills', [])
    experience = json.dumps(data.get('experience', []))
    education = json.dumps(data.get('education', []))
    projects = json.dumps(data.get('projects', []))
    raw_data = json.dumps(data)
    
    cursor.execute("""
        INSERT INTO documents (filename, name, email, phone, location, skills, experience, education, projects, summary, raw_data)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        filename,
        data.get('name', ''),
        data.get('email', ''),
        data.get('phone', ''),
        data.get('location', ''),
        skills,
        experience,
        education,
        projects,
        data.get('summary', ''),
        raw_data
    ))
    
    resume_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()
    
    return resume_id

@app.route('/api/search', methods=['GET'])
def search_documents():
    query = request.args.get('q', '').strip()
    skills_filter = request.args.get('skills', '').strip()
    experience_filter = request.args.get('experience', '').strip()
    education_filter = request.args.get('education', '').strip()
    projects_filter = request.args.get('projects', '').strip()
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Build dynamic query
    where_conditions = []
    params = []
    
    if query:
        where_conditions.append("(name ILIKE %s OR email ILIKE %s OR summary ILIKE %s)")
        params.extend([f'%{query}%', f'%{query}%', f'%{query}%'])
    
    if skills_filter:
        where_conditions.append("EXISTS (SELECT 1 FROM unnest(skills) skill WHERE skill ILIKE %s)")
        params.append(f'%{skills_filter}%')
    
    if experience_filter:
        where_conditions.append("experience::text ILIKE %s")
        params.append(f'%{experience_filter}%')
    
    if education_filter:
        where_conditions.append("education::text ILIKE %s")
        params.append(f'%{education_filter}%')
    
    if projects_filter:
        where_conditions.append("projects::text ILIKE %s")
        params.append(f'%{projects_filter}%')
    
    where_clause = "WHERE " + " AND ".join(where_conditions) if where_conditions else ""
    
    query_sql = f"""
        SELECT id, filename, name, email, phone, location, skills, experience, education, projects, summary, created_at
        FROM documents
        {where_clause}
        ORDER BY created_at DESC
        LIMIT 50
    """
    
    cursor.execute(query_sql, params)
    results = cursor.fetchall()
    
    # Convert results to JSON-serializable format
    formatted_results = []
    for row in results:
        result = dict(row)
        result['id'] = str(result['id'])
        result['created_at'] = result['created_at'].isoformat()
        # Parse JSON fields
        result['experience'] = safe_json_load(result['experience']) if result['experience'] else []
        result['education'] = safe_json_load(result['education']) if result['education'] else []
        result['projects'] = safe_json_load(result['projects']) if result['projects'] else []
        formatted_results.append(result)
    
    cursor.close()
    conn.close()
    
    return jsonify({'results': formatted_results})

@app.route('/api/documents', methods=['GET'])
def get_all_documents():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT id, filename, name, email, phone, location, skills, created_at
        FROM documents
        ORDER BY created_at DESC
    """)
    
    results = cursor.fetchall()
    
    formatted_results = []
    for row in results:
        result = dict(row)
        result['id'] = str(result['id'])
        result['created_at'] = result['created_at'].isoformat()
        formatted_results.append(result)
    
    cursor.close()
    conn.close()
    
    return jsonify({'results': formatted_results})

@app.route('/api/document/<resume_id>', methods=['GET'])
def get_resume_detail(resume_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT * FROM documents WHERE id = %s
    """, (resume_id,))
    
    result = cursor.fetchone()
    
    if not result:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Document not found'}), 404
    
    # Format result
    formatted_result = dict(result)
    formatted_result['id'] = str(formatted_result['id'])
    formatted_result['created_at'] = formatted_result['created_at'].isoformat()
    formatted_result['updated_at'] = formatted_result['updated_at'].isoformat()
    formatted_result['experience'] = safe_json_load(formatted_result['experience']) if formatted_result['experience'] else []
    formatted_result['education'] = safe_json_load(formatted_result['education']) if formatted_result['education'] else []
    formatted_result['projects'] = safe_json_load(formatted_result['projects']) if formatted_result['projects'] else []
    formatted_result['raw_data'] = safe_json_load(formatted_result['raw_data']) if formatted_result['raw_data'] else {}
    
    cursor.close()
    conn.close()
    
    return jsonify(formatted_result)

@app.route('/api/suggest', methods=['GET'])
def get_suggestions():
    query = request.args.get('q', '').strip()
    suggestions = []

    if not query:
        return jsonify({'suggestions': []})

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Search in name and email
        cursor.execute("""
            SELECT DISTINCT name FROM documents WHERE name ILIKE %s LIMIT 10
        """, (f'{query}%',))
        suggestions.extend([row[0] for row in cursor.fetchall() if row[0]])

        cursor.execute("""
            SELECT DISTINCT email FROM documents WHERE email ILIKE %s LIMIT 10
        """, (f'{query}%',))
        suggestions.extend([row[0] for row in cursor.fetchall() if row[0]])

        # Search in skills (assuming skills is an array of text)
        cursor.execute("""
            SELECT DISTINCT unnest(skills) FROM documents WHERE EXISTS (SELECT 1 FROM unnest(skills) s WHERE s ILIKE %s) LIMIT 10
        """, (f'{query}%',))
        suggestions.extend([row[0] for row in cursor.fetchall() if row[0]])

        # Search in JSONB fields (experience, education, projects)
        # For these, we might want to search within their text representation
        # and extract meaningful strings if possible. For simplicity, we'll just search for matching text.
        for field in ['experience', 'education', 'projects']:
            cursor.execute(f"""
                SELECT DISTINCT {field}::text FROM documents WHERE {field}::text ILIKE %s LIMIT 10
            """, (f'%{query}%',))
            # Attempt to extract more meaningful suggestions if the JSON is simple string lists
            # Otherwise, the full JSON text might appear as suggestion, which is not ideal.
            # For now, just add the raw text result.
            suggestions.extend([row[0] for row in cursor.fetchall() if row[0]])

    except Exception as e:
        print(f"Error fetching suggestions: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    
    # Filter out duplicates and limit total suggestions
    unique_suggestions = list(set(suggestions))
    return jsonify({'suggestions': sorted(unique_suggestions[:10])})

if __name__ == '__main__':
    app.run(debug=True)