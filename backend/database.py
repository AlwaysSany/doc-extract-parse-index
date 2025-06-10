

import os
import psycopg2

# Database configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'doc_parser'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db_connection():
    return psycopg2.connect(**DATABASE_CONFIG)

def init_database():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create document table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            filename VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            location VARCHAR(255),
            skills TEXT[],
            experience JSONB,
            education JSONB,
            projects JSONB,
            summary TEXT,
            raw_data JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create indexes for better search performance
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_documents_skills ON documents USING GIN (skills);
        CREATE INDEX IF NOT EXISTS idx_documents_name ON documents (name);
        CREATE INDEX IF NOT EXISTS idx_documents_email ON documents (email);
    """)
    
    conn.commit()
    cursor.close()
    conn.close()