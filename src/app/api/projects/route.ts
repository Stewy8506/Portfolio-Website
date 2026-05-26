/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";
import { normalizeProjectCategory } from "@/lib/projects";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

// Helper to load static fallback projects if Firestore is unconfigured or empty
async function getLocalProjects() {
  try {
    const data = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(data);
    return parsed.map((p: any, idx: number) => ({
      id: p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `project-${idx}`,
      ...p
    }));
  } catch (error) {
    return [];
  }
}

export async function GET() {
  if (!isFirebaseConfigured || !db) {
    const localData = await getLocalProjects();
    localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return NextResponse.json(localData);
  }

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects: any[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects.push({
        id: docSnap.id,
        ...data,
        images: data.images || (data.image ? [data.image] : ["/projects/default.jpg"])
      });
    });

    // If Firestore has no projects yet, seed with local projects so the UI remains beautiful
    if (projects.length === 0) {
      const localData = await getLocalProjects();
      localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      return NextResponse.json(localData);
    }

    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Firestore Projects Fetch Error:", error);
    const localData = await getLocalProjects();
    return NextResponse.json(localData);
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const body = await req.json();
    
    // Save to Firestore 'projects' collection
    const docRef = await addDoc(collection(db, "projects"), {
      title: body.title || "",
      description: body.description || "",
      overview: body.overview || "",
      problem: body.problem || "",
      solution: body.solution || "",
      approach: body.approach || "",
      learnings: body.learnings || "",
      liveDemoUrl: body.liveDemoUrl || "",
      sourceCodeUrl: body.sourceCodeUrl || "",
      tech: body.tech || [],
      link: body.link || "",
      category: normalizeProjectCategory(body.category),
      images: body.images || (body.image ? [body.image] : ["/projects/default.jpg"]),
      isCurrentlyWorkingOn: body.isCurrentlyWorkingOn || false,
      architectureDiagram: body.architectureDiagram || "",
      databaseSchema: body.databaseSchema || "",
      stateManagement: body.stateManagement || "",
      challenges: body.challenges || [],
      order: body.order !== undefined ? body.order : 999,
      createdAt: new Date().toISOString()
    });

    const newProject = {
      id: docRef.id,
      ...body
    };

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Firestore Project POST Error:", error);
    return NextResponse.json({ error: "Failed to save project to Firestore" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Delete document directly from Firestore
    await deleteDoc(doc(db, "projects", id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Firestore Project DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
