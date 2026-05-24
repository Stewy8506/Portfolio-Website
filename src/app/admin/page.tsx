"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Trash2, LogOut, Save, ExternalLink, Upload, Image as ImageIcon, X } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: "",
    link: "",
    category: "Mobile App",
    image: "/projects/default.jpg"
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
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

    const res = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'placeholder'}` 
      },
      body: JSON.stringify(projectData),
    });

    if (res.ok) {
      setNewProject({
        title: "",
        description: "",
        tech: "",
        link: "",
        category: "Mobile App",
        image: "/projects/default.jpg"
      });
      setEditingId(null);
      await fetchProjects();
    } else {
      alert(editingId ? "Failed to update project." : "Failed to add project. Check admin password.");
    }
    setLoading(false);
  };

  const handleEditProject = (project: any) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      link: project.link,
      category: project.category,
      image: project.image || "/projects/default.jpg",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProject({
      title: "",
      description: "",
      tech: "",
      link: "",
      category: "Mobile App",
      image: "/projects/default.jpg"
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setLoading(true);
    const res = await fetch(`/api/projects?id=${id}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'placeholder'}` 
      },
    });

    if (res.ok) {
      await fetchProjects();
    } else {
      alert("Failed to delete project.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    // Normally we'd call an API to clear the cookie
    router.push("/admin/login");
  };

  if (loading && projects.length === 0) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted">Manage your portfolio projects</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add New Project Form */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 rounded-3xl border border-white/10 sticky top-12"
            >
              <div className="flex items-center gap-2 mb-6">
                {editingId ? <Save size={20} /> : <Plus size={20} />}
                <h2 className="text-xl font-semibold">{editingId ? "Edit Project" : "Add New Project"}</h2>
              </div>
              
              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Title</label>
                  <input 
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors h-24"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    value={newProject.tech}
                    onChange={(e) => setNewProject({...newProject, tech: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="React, Next.js, Tailwind"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Project Link</label>
                  <input 
                    type="url" 
                    value={newProject.link}
                    onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Category</label>
                  <select 
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="Mobile App">Mobile App</option>
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="AI Product">AI Product</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted ml-1">Project Image</label>
                  <div className="flex flex-col gap-3">
                    <div className="relative h-32 w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden group">
                      {newProject.image ? (
                        <>
                          <img 
                            src={newProject.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                          <button 
                            onClick={() => setNewProject({...newProject, image: "/projects/default.jpg"})}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                          <ImageIcon size={24} className="mb-2 opacity-20" />
                          <span className="text-[10px]">No image selected</span>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-muted hover:text-white">
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Save size={18} /> {editingId ? "Update Project" : "Save Project"}
                </motion.button>
                {editingId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </motion.div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Existing Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project: any) => (
                <motion.div 
                  key={project.id || project.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center font-bold`}>
                      {project.title[0]}
                    </div>
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-xs text-muted">{project.category} • {project.tech.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {projects.length === 0 && <p className="text-muted text-center py-12">No projects found. Add your first one!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
