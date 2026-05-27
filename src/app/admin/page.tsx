"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, LogOut, Save, ExternalLink, Upload, Image as ImageIcon, X, Search, Filter, Edit2, LayoutTemplate, Wrench, GripVertical, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "@/components/ui/Toast";
import {
  DEFAULT_PROJECT_CATEGORY,
  DEFAULT_SKILL_CATEGORY,
  PROJECT_CATEGORIES,
  SKILL_CATEGORIES,
  normalizeProjectCategory,
  normalizeSkillCategory,
} from "@/lib/projects";

type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "guestbook">("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Projects Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    overview: "",
    problem: "",
    solution: "",
    approach: "",
    learnings: "",
    liveDemoUrl: "",
    sourceCodeUrl: "",
    tech: "",
    link: "",
    category: DEFAULT_PROJECT_CATEGORY as ProjectCategory,
    hasLiveDemo: true,
    isCurrentlyWorkingOn: false,
    images: [] as string[],
    architectureDiagram: "",
    databaseSchema: "",
    stateManagement: "",
    challenges: [] as Array<{ title: string; description: string; solution: string }>
  });

  const [showArchitecture, setShowArchitecture] = useState(false);
  const [challengeInput, setChallengeInput] = useState({ title: "", description: "", solution: "" });

  // Skills Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: "",
    slug: "",
    category: DEFAULT_SKILL_CATEGORY as SkillCategory,
    white: false
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [employedStatus, setEmployedStatus] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
    fetchEmploymentStatus();
    fetchGuestbook();
  }, []);

  const fetchEmploymentStatus = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setEmployedStatus(data.employed);
    } catch (error) {
      console.error("Failed to fetch employment status.");
    }
  };

  const updateEmploymentStatus = async (status: boolean) => {
    setEmployedStatus(status);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employed: status }),
      });
      if (res.ok) {
        toast(`Employment status updated successfully to ${status ? "Yes" : "No"}.`, "success");
      } else {
        toast("Failed to update employment status.", "error");
        fetchEmploymentStatus();
      }
    } catch (error) {
      toast("An error occurred.", "error");
      fetchEmploymentStatus();
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast("Failed to fetch projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      toast("Failed to fetch skills.", "error");
    }
  };

  const fetchGuestbook = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuestbookEntries(entries);
    } catch (error) {
      toast("Failed to fetch guestbook.", "error");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...newProject,
      tech: typeof newProject.tech === 'string' ? newProject.tech.split(",").map(t => t.trim()) : newProject.tech,
    };

    const method = editingProjectId ? "PUT" : "POST";
    const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        toast(editingProjectId ? "Project updated successfully!" : "Project added successfully!", "success");
        closeProjectModal();
        await fetchProjects();
      } else {
        toast(editingProjectId ? "Failed to update project. Check admin password." : "Failed to add project. Check admin password.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingSkillId ? "PUT" : "POST";
    const url = editingSkillId ? `/api/skills/${editingSkillId}` : "/api/skills";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      if (res.ok) {
        toast(editingSkillId ? "Skill updated successfully!" : "Skill added successfully!", "success");
        closeSkillModal();
        await fetchSkills();
      } else {
        toast(editingSkillId ? "Failed to update skill." : "Failed to add skill.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditProjectModal = (project: any) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      overview: project.overview || "",
      problem: project.problem || "",
      solution: project.solution || "",
      approach: project.approach || "",
      learnings: project.learnings || "",
      liveDemoUrl: project.liveDemoUrl || "",
      sourceCodeUrl: project.sourceCodeUrl || "",
      tech: project.tech.join(", "),
      link: project.link,
      category: normalizeProjectCategory(project.category),
      hasLiveDemo: project.hasLiveDemo !== false,
      isCurrentlyWorkingOn: project.isCurrentlyWorkingOn || false,
      images: project.images || (project.image ? [project.image] : []),
      architectureDiagram: project.architectureDiagram || "",
      databaseSchema: project.databaseSchema || "",
      stateManagement: project.stateManagement || "",
      challenges: project.challenges || [],
    });
    setIsProjectModalOpen(true);
  };

  const openEditSkillModal = (skill: any) => {
    setEditingSkillId(skill.id);
    setNewSkill({
      name: skill.name,
      slug: skill.slug,
      category: normalizeSkillCategory(skill.category),
      white: skill.white,
    });
    setIsSkillModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProjectId(null);
    setNewProject({
      title: "",
      description: "",
      overview: "",
      problem: "",
      solution: "",
      approach: "",
      learnings: "",
      liveDemoUrl: "",
      sourceCodeUrl: "",
      tech: "",
      link: "",
      category: DEFAULT_PROJECT_CATEGORY as ProjectCategory,
      hasLiveDemo: true,
      isCurrentlyWorkingOn: false,
      images: [],
      architectureDiagram: "",
      databaseSchema: "",
      stateManagement: "",
      challenges: []
    });
    setShowArchitecture(false);
    setChallengeInput({ title: "", description: "", solution: "" });
  };

  const closeSkillModal = () => {
    setIsSkillModalOpen(false);
    setEditingSkillId(null);
    setNewSkill({ name: "", slug: "", category: DEFAULT_SKILL_CATEGORY as SkillCategory, white: false });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Project deleted successfully.", "success");
        await fetchProjects();
      } else {
        toast("Failed to delete project.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Skill deleted successfully.", "success");
        await fetchSkills();
      } else {
        toast("Failed to delete skill.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuestbookEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guestbook entry?")) return;
    setLoading(true);
    try {
      if (db) {
        await deleteDoc(doc(db, "guestbook", id));
        toast("Guestbook entry deleted.", "success");
        await fetchGuestbook();
      }
    } catch (error) {
      toast("Failed to delete entry.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (searchQuery || categoryFilter !== "All") {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      handleDragEnd();
      return;
    }

    const updatedProjects = [...projects];
    const [draggedProject] = updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);

    // Optimistically update the UI list instantly
    setProjects(updatedProjects);
    handleDragEnd();
    setLoading(true);

    try {
      // Re-assign order for ALL projects to maintain consistency
      const promises = updatedProjects.map((proj: any, idx: number) => {
        return fetch(`/api/projects/${proj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...proj, order: idx }),
        });
      });

      await Promise.all(promises);
      toast("Projects reordered successfully!", "success");
      await fetchProjects();
    } catch (error) {
      toast("Failed to save project order.", "error");
      await fetchProjects();
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB.", "error");
      return;
    }

    setUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName === "your_cloud_name" || uploadPreset === "your_unsigned_upload_preset") {
        throw new Error("Missing Cloudinary configuration in .env.local.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image to Cloudinary.");

      const data = await res.json();
      setNewProject({ ...newProject, images: [...newProject.images, data.secure_url] });
      toast("Image uploaded to Cloudinary successfully!", "success");
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      toast(error.message || "Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    }
    router.push("/admin/login");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, categoryFilter]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s: any) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, categoryFilter]);

  const filteredGuestbook = useMemo(() => {
    return guestbookEntries.filter((entry: any) => {
      const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            entry.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [guestbookEntries, searchQuery]);

  if (loading && projects.length === 0 && skills.length === 0) return <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Admin Dashboard</h1>
            <p className="text-sm text-zinc-400">Manage your portfolio projects and configurations.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => activeTab === 'projects' ? setIsProjectModalOpen(true) : activeTab === 'skills' ? setIsSkillModalOpen(true) : null}
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm ${activeTab === 'guestbook' ? 'hidden' : ''}`}
            >
              <Plus size={16} /> New {activeTab === 'projects' ? 'Project' : 'Skill'}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Settings Bar */}
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Employment Status</span>
            <span className="text-xs text-zinc-400">When "No", your portfolio will show "Available for new opportunities".</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Employed:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-zinc-950 border border-zinc-800">
              <button
                onClick={() => updateEmploymentStatus(true)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
                  employedStatus === true
                    ? "bg-zinc-100 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateEmploymentStatus(false)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
                  employedStatus === false
                    ? "bg-zinc-100 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button 
            onClick={() => { setActiveTab("projects"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "projects" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutTemplate size={16} /> Projects
          </button>
          <button 
            onClick={() => { setActiveTab("skills"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "skills" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Wrench size={16} /> Skills
          </button>
          <button 
            onClick={() => { setActiveTab("guestbook"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "guestbook" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <MessageSquare size={16} /> Guestbook
          </button>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {activeTab === "projects" ? (
                <>
                  {PROJECT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </>
              ) : activeTab === "skills" ? (
                <>
                  {SKILL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </>
              ) : null}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === "projects" ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-4 py-4 font-medium w-10"></th>
                    <th className="px-6 py-4 font-medium w-16">Image</th>
                    <th className="px-6 py-4 font-medium">Project Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Tech Stack</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredProjects.map((project: any, index: number) => {
                    const isDraggable = !searchQuery && categoryFilter === "All";
                    return (
                      <tr 
                        key={project.id || project.title} 
                        draggable={isDraggable}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`hover:bg-zinc-800/20 transition-all duration-200 border-l-2 select-none ${
                          draggedIndex === index
                            ? "bg-zinc-900/60 border-l-zinc-500 opacity-40 scale-[0.99]"
                            : dragOverIndex === index
                            ? "bg-zinc-800/30 border-l-zinc-300"
                            : "border-l-transparent"
                        }`}
                      >
                        <td className="px-4 py-3 text-zinc-500 w-10">
                          {isDraggable ? (
                            <div className="cursor-grab active:cursor-grabbing hover:text-zinc-300 p-1 flex items-center justify-center">
                              <GripVertical size={16} />
                            </div>
                          ) : (
                            <div className="text-zinc-700 p-1 flex items-center justify-center opacity-30 cursor-not-allowed" title="Clear filters/search to drag and drop">
                              <GripVertical size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                            {project.images?.length > 0 || project.image ? (
                              <img src={project.images?.[0] || project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-zinc-500">{project.title[0]}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-medium text-zinc-100">{project.title}</p>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5 w-max">
                            View Link <ExternalLink size={10} />
                          </a>
                        </td>
                        <td className="px-6 py-3 text-zinc-300">{project.category}</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-1 flex-wrap w-48 truncate">
                            {project.tech.map((t: string) => (
                              <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditProjectModal(project)}
                              className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                        No projects found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : activeTab === "skills" ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">Icon</th>
                    <th className="px-6 py-4 font-medium">Skill Name</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredSkills.map((skill: any) => (
                    <tr key={skill.id || skill.slug} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center p-1.5 overflow-hidden border border-zinc-700">
                          <img 
                            src={`https://cdn.simpleicons.org/${skill.slug}${skill.white ? '/white' : ''}`} 
                            alt={skill.name}
                            className="w-full h-full object-contain"
                            onError={(e) => (e.currentTarget.src = "/favicon.ico")} // fallback
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-zinc-100">{skill.name}</p>
                      </td>
                      <td className="px-6 py-3 text-zinc-400">{skill.slug}</td>
                      <td className="px-6 py-3 text-zinc-300">{skill.category}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditSkillModal(skill)}
                            className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSkills.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No skills found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Message</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredGuestbook.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-3 font-medium text-zinc-100">{entry.name}</td>
                      <td className="px-6 py-3 text-zinc-300 max-w-xs truncate" title={entry.message}>{entry.message}</td>
                      <td className="px-6 py-3 text-zinc-400">
                        {entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleString() : "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleDeleteGuestbookEntry(entry.id)}
                            className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredGuestbook.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                        No guestbook entries found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h2 className="text-lg font-semibold">{editingProjectId ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={closeProjectModal} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="project-form" onSubmit={handleSaveProject} className="space-y-4 text-sm">
                <div>
                  <label className="block text-zinc-400 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Overview</label>
                  <textarea 
                    value={newProject.overview}
                    onChange={(e) => setNewProject({...newProject, overview: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">The Problem</label>
                  <textarea 
                    value={newProject.problem}
                    onChange={(e) => setNewProject({...newProject, problem: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">The Solution</label>
                  <textarea 
                    value={newProject.solution}
                    onChange={(e) => setNewProject({...newProject, solution: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">The Approach</label>
                  <textarea 
                    value={newProject.approach}
                    onChange={(e) => setNewProject({...newProject, approach: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Key Learnings</label>
                  <textarea 
                    value={newProject.learnings}
                    onChange={(e) => setNewProject({...newProject, learnings: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    value={newProject.tech}
                    onChange={(e) => setNewProject({...newProject, tech: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                    placeholder="React, Next.js, Tailwind"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Project Link</label>
                  <input 
                    type="url" 
                    value={newProject.link}
                    onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Live Demo URL</label>
                  <input 
                    type="url" 
                    value={newProject.liveDemoUrl}
                    onChange={(e) => setNewProject({...newProject, liveDemoUrl: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-zinc-400 mb-4 cursor-pointer mt-2 w-fit">
                    <input 
                      type="checkbox" 
                      checked={newProject.hasLiveDemo}
                      onChange={(e) => setNewProject({...newProject, hasLiveDemo: e.target.checked})}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                    />
                    <span>Has Live Demo / Live Site link?</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-400 mb-4 cursor-pointer mt-2 w-fit">
                    <input 
                      type="checkbox" 
                      checked={newProject.isCurrentlyWorkingOn}
                      onChange={(e) => setNewProject({...newProject, isCurrentlyWorkingOn: e.target.checked})}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                    />
                    <span>Currently Working On?</span>
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Source Code URL</label>
                  <input 
                    type="url" 
                    value={newProject.sourceCodeUrl}
                    onChange={(e) => setNewProject({...newProject, sourceCodeUrl: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select 
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: normalizeProjectCategory(e.target.value)})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors appearance-none"
                  >
                    {PROJECT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2">Project Images</label>
                  <div className="flex flex-wrap gap-4 items-start">
                    {newProject.images.map((img, idx) => (
                      <div key={idx} className="relative h-20 w-20 rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0 group">
                        <img 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                          <div className="flex justify-end w-full">
                            <button
                              type="button"
                              onClick={() => setNewProject({ ...newProject, images: newProject.images.filter((_, i) => i !== idx) })}
                              className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white hover:bg-black/80 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex justify-between w-full">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const newImages = [...newProject.images];
                                [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                                setNewProject({ ...newProject, images: newImages });
                              }}
                              className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === newProject.images.length - 1}
                              onClick={() => {
                                const newImages = [...newProject.images];
                                [newImages[idx + 1], newImages[idx]] = [newImages[idx], newImages[idx + 1]];
                                setNewProject({ ...newProject, images: newImages });
                              }}
                              className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <label className="h-20 w-32 flex flex-col items-center justify-center gap-2 rounded-md bg-zinc-950 border border-zinc-800 border-dashed hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 text-xs">
                      {uploading ? <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Upload size={16} />}
                      {uploading ? "Uploading..." : "Add Image"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowArchitecture(!showArchitecture)}
                    className="w-full flex items-center justify-between py-2 text-zinc-300 hover:text-white font-medium border border-zinc-800 bg-zinc-900/50 px-3 rounded-md transition-colors"
                  >
                    <span>Architecture Case Study (Optional)</span>
                    {showArchitecture ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showArchitecture && (
                    <div className="space-y-4 mt-4 p-4 rounded-md border border-zinc-800 bg-zinc-950/40">
                      <div>
                        <label className="block text-zinc-400 mb-1">Architecture Diagram (Mermaid syntax)</label>
                        <textarea
                          value={newProject.architectureDiagram}
                          onChange={(e) => setNewProject({...newProject, architectureDiagram: e.target.value})}
                          placeholder="graph TD;&#10;  A[Frontend] --> B[Backend];"
                          className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 font-mono text-xs resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Database Schema (Mermaid syntax)</label>
                        <textarea
                          value={newProject.databaseSchema}
                          onChange={(e) => setNewProject({...newProject, databaseSchema: e.target.value})}
                          placeholder="erDiagram;&#10;  USER ||--o{ POST : writes"
                          className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 font-mono text-xs resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">State Management Details</label>
                        <textarea
                          value={newProject.stateManagement}
                          onChange={(e) => setNewProject({...newProject, stateManagement: e.target.value})}
                          placeholder="Describe the state management approach (e.g., Zustand with global slice, local React state for modal forms)..."
                          className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-y"
                        />
                      </div>

                      <div className="border-t border-zinc-800 pt-4">
                        <label className="block text-zinc-300 font-medium mb-2">Technical Challenges</label>
                        
                        {/* Challenges List Builder */}
                        {newProject.challenges && newProject.challenges.length > 0 && (
                          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                            {newProject.challenges.map((challenge, idx) => (
                              <div key={idx} className="p-3 rounded bg-zinc-900 border border-zinc-800 relative group">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewProject({
                                      ...newProject,
                                      challenges: newProject.challenges.filter((_, i) => i !== idx)
                                    });
                                  }}
                                  className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove Challenge"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <h4 className="font-semibold text-zinc-200 pr-6 text-xs flex items-center gap-1">
                                  <span className="text-zinc-500">{idx + 1}.</span> {challenge.title}
                                </h4>
                                <p className="text-[11px] text-zinc-400 mt-1"><strong className="text-zinc-500 text-[10px]">CHALLENGE:</strong> {challenge.description}</p>
                                <p className="text-[11px] text-zinc-400 mt-1"><strong className="text-zinc-500 text-[10px]">SOLUTION:</strong> {challenge.solution}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Challenge Inputs */}
                        <div className="p-3 rounded bg-zinc-900/50 border border-dashed border-zinc-800 space-y-3">
                          <p className="text-xs font-semibold text-zinc-400">Add Technical Challenge</p>
                          <div>
                            <input
                              type="text"
                              placeholder="Challenge Title (e.g. Memory Leak on Re-mount)"
                              value={challengeInput.title}
                              onChange={(e) => setChallengeInput({ ...challengeInput, title: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors"
                            />
                          </div>
                          <div>
                            <textarea
                              placeholder="Describe the challenge..."
                              value={challengeInput.description}
                              onChange={(e) => setChallengeInput({ ...challengeInput, description: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors h-14 resize-none"
                            />
                          </div>
                          <div>
                            <textarea
                              placeholder="Explain your solution..."
                              value={challengeInput.solution}
                              onChange={(e) => setChallengeInput({ ...challengeInput, solution: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors h-14 resize-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!challengeInput.title || !challengeInput.description || !challengeInput.solution) {
                                toast("Please fill out all challenge fields.", "error");
                                return;
                              }
                              setNewProject({
                                ...newProject,
                                challenges: [...(newProject.challenges || []), challengeInput]
                              });
                              setChallengeInput({ title: "", description: "", solution: "" });
                              toast("Challenge added to list!", "success");
                            }}
                            className="w-full py-1.5 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <Plus size={12} /> Add to Challenges List
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button type="button" onClick={closeProjectModal} className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors text-sm border border-zinc-700">Cancel</button>
              <button type="submit" form="project-form" disabled={loading} className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
                <Save size={14} /> {editingProjectId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h2 className="text-lg font-semibold">{editingSkillId ? "Edit Skill" : "Add New Skill"}</h2>
              <button onClick={closeSkillModal} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="skill-form" onSubmit={handleSaveSkill} className="space-y-4 text-sm">
                <div>
                  <label className="block text-zinc-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                    placeholder="e.g., React.js"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">SimpleIcons Slug</label>
                  <input 
                    type="text" 
                    value={newSkill.slug}
                    onChange={(e) => setNewSkill({...newSkill, slug: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                    placeholder="e.g., react"
                    required
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Find slugs at <a href="https://simpleicons.org" target="_blank" className="underline hover:text-blue-400">simpleicons.org</a></p>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select 
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({...newSkill, category: normalizeSkillCategory(e.target.value)})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors appearance-none"
                  >
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="white-icon"
                    checked={newSkill.white}
                    onChange={(e) => setNewSkill({...newSkill, white: e.target.checked})}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 checked:bg-zinc-100"
                  />
                  <label htmlFor="white-icon" className="text-zinc-400 cursor-pointer">Use White Icon (for dark background)</label>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button type="button" onClick={closeSkillModal} className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors text-sm border border-zinc-700">Cancel</button>
              <button type="submit" form="skill-form" disabled={loading} className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
                <Save size={14} /> {editingSkillId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
