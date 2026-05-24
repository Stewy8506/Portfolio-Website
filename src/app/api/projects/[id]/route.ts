import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fs.readFile(DATA_PATH, "utf8");
    let projects = JSON.parse(data);
    
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update project while preserving ID
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...body,
      id: id,
    };

    await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2));
    
    return NextResponse.json(projects[projectIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
