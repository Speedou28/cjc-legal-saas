import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'consultations.db');

let db: Database.Database | null = null;

export function initDatabase() {
  if (db) return db;

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      question_original TEXT NOT NULL,
      domains_detected TEXT NOT NULL,
      response_text TEXT NOT NULL,
      tokens_input INTEGER,
      tokens_output INTEGER,
      model TEXT DEFAULT 'claude-3-5-sonnet',
      cost DECIMAL(10, 4),
      word_document_path TEXT,
      pdf_document_path TEXT,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP,
      voice_input BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS api_usage (
      id TEXT PRIMARY KEY,
      consultation_id TEXT REFERENCES consultations(id),
      model TEXT,
      tokens_input INTEGER,
      tokens_output INTEGER,
      cost DECIMAL(10, 4),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT,
      resource_id TEXT,
      resource_type TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_consultations_client ON consultations(client_id);
    CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_usage_consultation ON api_usage(consultation_id);
  `);

  return db;
}

export function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db!;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
