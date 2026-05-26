import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "src/data/config.json");

async function getLocalConfig() {
  try {
    const data = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { employed: false }; // default: employed is no (false), so available for opportunities text is shown
  }
}

export async function GET() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "config", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return NextResponse.json(docSnap.data());
      }
    } catch (error) {
      console.error("Firestore Config GET Error:", error);
    }
  }

  // Fallback to local config
  const localConfig = await getLocalConfig();
  return NextResponse.json(localConfig);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { employed } = body;

    const newConfig = { employed: !!employed };

    // Always write to local config first for robustness in local/dev setup
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
      await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf8");
    } catch (err) {
      console.error("Failed to write local config:", err);
    }

    // Write to Firestore if configured
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "config", "settings");
      await setDoc(docRef, newConfig, { merge: true });
    }

    return NextResponse.json(newConfig);
  } catch (error) {
    console.error("Config PUT Error:", error);
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
  }
}
