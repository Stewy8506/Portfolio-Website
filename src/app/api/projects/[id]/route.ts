import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { normalizeProjectCategory } from "@/lib/projects";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Reference and set/update document directly on Firestore (creates if doesn't exist)
    const projectRef = doc(db, "projects", id);
    await setDoc(projectRef, {
      title: body.title,
      description: body.description,
      overview: body.overview,
      problem: body.problem,
      liveDemoUrl: body.liveDemoUrl,
      sourceCodeUrl: body.sourceCodeUrl,
      tech: body.tech,
      link: body.link,
      category: normalizeProjectCategory(body.category),
      images: body.images || (body.image ? [body.image] : ["/projects/default.jpg"]),
      ...(body.solution !== undefined && { solution: body.solution }),
      ...(body.approach !== undefined && { approach: body.approach }),
      ...(body.learnings !== undefined && { learnings: body.learnings }),
      ...(body.isCurrentlyWorkingOn !== undefined && { isCurrentlyWorkingOn: body.isCurrentlyWorkingOn }),
      ...(body.architectureDiagram !== undefined && { architectureDiagram: body.architectureDiagram }),
      ...(body.databaseSchema !== undefined && { databaseSchema: body.databaseSchema }),
      ...(body.stateManagement !== undefined && { stateManagement: body.stateManagement }),
      ...(body.challenges !== undefined && { challenges: body.challenges }),
      ...(body.order !== undefined && { order: body.order }),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const updatedProject = {
      id,
      ...body
    };

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Firestore Project PUT Error:", error);
    return NextResponse.json({ error: "Failed to update project in Firestore" }, { status: 500 });
  }
}
