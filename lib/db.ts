/**
 * db.ts
 * SQLite database connection using better-sqlite3.
 * Creates the schema on first run if tables don't exist.
 * No personal data is ever stored.
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Store the DB file next to the project root (outside app dir)
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "cassi.db");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Singleton pattern: reuse connection across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id            TEXT    NOT NULL,
      answers               TEXT    NOT NULL,  -- JSON array of answer IDs
      tags                  TEXT    NOT NULL,  -- JSON array of collected tags
      recommended_diretoria INTEGER NOT NULL,  -- 2, 4, or 6
      recommended_fiscal    INTEGER NOT NULL,  -- 33, 55, or 77
      score_chapa2          REAL,
      score_chapa4          REAL,
      score_chapa6          REAL,
      score_chapa33         REAL,
      score_chapa55         REAL,
      score_chapa77         REAL,
      perfil_situacao       TEXT,              -- pre2018 | pos2018 | aposentado | dependente
      created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at
      ON quiz_results (created_at);

    CREATE INDEX IF NOT EXISTS idx_quiz_results_recommended_diretoria
      ON quiz_results (recommended_diretoria);
  `);

  return db;
}

export function getDb(): Database.Database {
  if (process.env.NODE_ENV === "production") {
    // In production create a single module-level connection
    if (!global.__db) {
      global.__db = createConnection();
    }
    return global.__db;
  } else {
    // In development reuse across hot-reloads via global
    if (!global.__db) {
      global.__db = createConnection();
    }
    return global.__db;
  }
}

// ---------------------------------------------------------------------------
// Typed query helpers
// ---------------------------------------------------------------------------

export type QuizResultRow = {
  id: number;
  session_id: string;
  answers: string;
  tags: string;
  recommended_diretoria: number;
  recommended_fiscal: number;
  score_chapa2: number | null;
  score_chapa4: number | null;
  score_chapa6: number | null;
  score_chapa33: number | null;
  score_chapa55: number | null;
  score_chapa77: number | null;
  perfil_situacao: string | null;
  created_at: string;
};

export type InsertResult = {
  session_id: string;
  answers: string[];
  tags: string[];
  recommended_diretoria: number;
  recommended_fiscal: number;
  score_chapa2: number;
  score_chapa4: number;
  score_chapa6: number;
  score_chapa33: number;
  score_chapa55: number;
  score_chapa77: number;
  perfil_situacao: string | null;
};

export function insertResult(data: InsertResult): number {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO quiz_results (
      session_id, answers, tags,
      recommended_diretoria, recommended_fiscal,
      score_chapa2, score_chapa4, score_chapa6,
      score_chapa33, score_chapa55, score_chapa77,
      perfil_situacao
    ) VALUES (
      @session_id, @answers, @tags,
      @recommended_diretoria, @recommended_fiscal,
      @score_chapa2, @score_chapa4, @score_chapa6,
      @score_chapa33, @score_chapa55, @score_chapa77,
      @perfil_situacao
    )
  `);

  const info = stmt.run({
    ...data,
    answers: JSON.stringify(data.answers),
    tags: JSON.stringify(data.tags),
  });

  return info.lastInsertRowid as number;
}

export function getStats() {
  const db = getDb();

  const total = (db.prepare("SELECT COUNT(*) as count FROM quiz_results").get() as { count: number }).count;
  const today = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM quiz_results WHERE DATE(created_at) = DATE('now')"
      )
      .get() as { count: number }
  ).count;

  const byDiretoria = db
    .prepare(
      "SELECT recommended_diretoria as chapa, COUNT(*) as count FROM quiz_results GROUP BY recommended_diretoria"
    )
    .all() as { chapa: number; count: number }[];

  const byFiscal = db
    .prepare(
      "SELECT recommended_fiscal as chapa, COUNT(*) as count FROM quiz_results GROUP BY recommended_fiscal"
    )
    .all() as { chapa: number; count: number }[];

  const byPerfil = db
    .prepare(
      "SELECT perfil_situacao as perfil, COUNT(*) as count FROM quiz_results WHERE perfil_situacao IS NOT NULL GROUP BY perfil_situacao"
    )
    .all() as { perfil: string; count: number }[];

  const byDay = db
    .prepare(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM quiz_results GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30"
    )
    .all() as { date: string; count: number }[];

  return { total, today, byDiretoria, byFiscal, byPerfil, byDay };
}

export function getAllResults(page = 1, pageSize = 50): { rows: QuizResultRow[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * pageSize;
  const rows = db
    .prepare(
      "SELECT * FROM quiz_results ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
    .all(pageSize, offset) as QuizResultRow[];
  const total = (db.prepare("SELECT COUNT(*) as count FROM quiz_results").get() as { count: number }).count;
  return { rows, total };
}

export function getAllResultsForExport(): QuizResultRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM quiz_results ORDER BY created_at DESC")
    .all() as QuizResultRow[];
}
