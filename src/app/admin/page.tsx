"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, LogOut, Save, ExternalLink, Upload, Image as ImageIcon, X, Search, Filter, Edit2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: "",
    link: "",
    category: "Mobile App",
    images: [] as string[]
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...newProject,
      tech: typeof newProject.tech === 'string' ? newProject.tech.split(",").map(t => t.trim()) : newProject.tech,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        toast(editingId ? "Project updated successfully!" : "Project added successfully!", "success");
        closeModal();
        await fetchProjects();
      } else {
        toast(editingId ? "Failed to update project. Check admin password." : "Failed to add project. Check admin password.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (project: any) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      link: project.link,
      category: project.category,
      images: project.images || (project.image ? [project.image] : []),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewProject({
      title: "",
      description: "",
      tech: "",
      link: "",
      category: "Mobile App",
      images: []
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE"
      });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB.", "error");
      return;
    }

    setUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      // Graceful verification
      if (!cloudName || !uploadPreset || cloudName === "your_cloud_name" || uploadPreset === "your_unsigned_upload_preset") {
        throw new Error("Missing Cloudinary configuration in .env.local. Please configure NEXT_PUBLIC_CLOUDINARY_* variables.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image to Cloudinary.");
      }

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

  if (loading && projects.length === 0) return <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">Loading...</div>;

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
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm"
            >
              <Plus size={16} /> New Project
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Toolbar: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
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
              <option value="Mobile App">Mobile App</option>
              <option value="Embedded Systems">Embedded Systems</option>
              <option value="AI Product">AI Product</option>
              <option value="Website">Website</option>
            </select>
          </div>
        </div>

        {/* Projects Data Table */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium w-16">Image</th>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Tech Stack</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredProjects.map((project: any) => (
                  <tr key={project.id || project.title} className="hover:bg-zinc-800/20 transition-colors">
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
                          onClick={() => openEditModal(project)}
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
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No projects found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal for Add/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={closeModal} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
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
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select 
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="Mobile App">Mobile App</option>
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="AI Product">AI Product</option>
                    <option value="Website">Website</option>
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
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, images: newProject.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-500/80 text-[9px] text-white text-center py-0.5 font-bold uppercase tracking-wider">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                    <label className="h-20 w-32 flex flex-col items-center justify-center gap-2 rounded-md bg-zinc-950 border border-zinc-800 border-dashed hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 text-xs">
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploading ? "Uploading..." : "Add Image"}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button 
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors text-sm border border-zinc-700"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="project-form"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={14} /> {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
