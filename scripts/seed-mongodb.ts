import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import ProjectModel from "@/lib/models/ProjectModel";
import EventModel from "@/lib/models/EventModel";
import ManagementModel from "@/lib/models/ManagementModel";
import { Project } from "@/types/project";
import { Event } from "@/types/event";
import { ManagementMember } from "@/types/management";

const dataDir = path.join(process.cwd(), "data");

const envFiles = [".env.local", ".env"]; 

function parseEnvLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) return null;
  const key = trimmed.slice(0, eqIndex).trim();
  let value = trimmed.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

async function loadEnvFiles() {
  for (const fileName of envFiles) {
    const filePath = path.join(process.cwd(), fileName);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const entry = parseEnvLine(line);
        if (!entry) continue;
        if (process.env[entry.key] === undefined) {
          process.env[entry.key] = entry.value;
        }
      }
    } catch {
      // Ignore missing env files.
    }
  }
}

async function readJsonFile<T>(fileName: string): Promise<T[]> {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function seedProjects() {
  const projects = await readJsonFile<Project>("projects.json");
  if (!projects.length) {
    return { inserted: 0 };
  }

  const ops = projects.map((project) => ({
    updateOne: {
      filter: { id: project.id },
      update: { $set: project },
      upsert: true,
    },
  }));

  const result = await ProjectModel.bulkWrite(ops, { ordered: false });
  return { inserted: result.upsertedCount ?? 0 };
}

async function seedEvents() {
  const events = await readJsonFile<Event>("events.json");
  if (!events.length) {
    return { inserted: 0 };
  }

  const now = new Date().toISOString();
  const ops = events.map((event) => ({
    updateOne: {
      filter: { id: event.id },
      update: {
        $set: {
          ...event,
          createdAt: event.createdAt ?? now,
          updatedAt: event.updatedAt ?? now,
        },
      },
      upsert: true,
    },
  }));

  const result = await EventModel.bulkWrite(ops, { ordered: false });
  return { inserted: result.upsertedCount ?? 0 };
}

async function seedManagement() {
  const members = await readJsonFile<ManagementMember>("management-team.json");
  if (!members.length) {
    return { inserted: 0 };
  }

  const now = new Date().toISOString();
  const ops = members.map((member) => ({
    updateOne: {
      filter: { id: member.id },
      update: {
        $set: {
          ...member,
          order: member.order ?? 0,
          createdAt: member.createdAt ?? now,
          updatedAt: member.updatedAt ?? now,
        },
      },
      upsert: true,
    },
  }));

  const result = await ManagementModel.bulkWrite(ops, { ordered: false });
  return { inserted: result.upsertedCount ?? 0 };
}

async function run() {
  console.log("Seeding MongoDB from JSON data...");

  await loadEnvFiles();
  const { default: dbConnect } = await import("@/lib/mongoose");
  await dbConnect();

  const [projects, events, management] = await Promise.all([
    seedProjects(),
    seedEvents(),
    seedManagement(),
  ]);

  console.log("Seeding completed:");
  console.log(`- Projects upserted: ${projects.inserted}`);
  console.log(`- Events upserted: ${events.inserted}`);
  console.log(`- Management upserted: ${management.inserted}`);
}

run()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
