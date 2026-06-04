import fs from "fs";
import path from "path";
import type { MockUser } from "./types";
import { INITIAL_SENIORS } from "./users";

const DB_FILE = path.join(process.cwd(), "mock-db.json");

interface MockDB {
  seniors: MockUser[];
}

function readDB(): MockDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading mock-db.json", e);
  }
  return { seniors: [] };
}

function writeDB(data: MockDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing mock-db.json", e);
  }
}

export function getMockSeniors(): MockUser[] {
  const db = readDB();
  // Combine hardcoded initial seniors with any new ones stored in the JSON file
  return [...INITIAL_SENIORS, ...db.seniors];
}

export function addMockSenior(senior: MockUser) {
  const db = readDB();
  // Check if already exists (e.g. by email)
  if (!db.seniors.some((s) => s.email === senior.email)) {
    db.seniors.push(senior);
    writeDB(db);
  }
}
