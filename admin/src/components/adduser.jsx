import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Edit, Trash2, Plus, X, Eye, EyeOff, Search, ChevronRight } from "lucide-react";

function Add() {
  const particlesInit = React.useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#000000",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    association_name: ""
  });

  const [editingAssociation, setEditingAssociation] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    association_name: "",
    password: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredAssociations = associations.filter((association) =>
    (association.clubName || association.association_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (association.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAssociations();
      const rawClubs = Array.isArray(response.data.data) ? response.data.data : (response.data.associations || []);
      const mappedData = rawClubs.map(club => ({
        ...club,
        association_name: club.club_name || club.clubName || club.name || club.username,
        clubName: club.club_name || club.clubName || club.name || club.username
      }));
      setAssociations(mappedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.association_name) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    try {
      const cleanUsername = formData.username.toLowerCase().trim();
      await adminAPI.createAssociation({
        username: cleanUsername,
        password: formData.password,
        club_name: formData.association_name,
        name: formData.association_name,
        email: formData.email || `${cleanUsername}@psgtech.ac.in`
      });
      setMessage("✅ Association created successfully!");
      setFormData({ username: "", password: "", association_name: "", email: "" });
      fetchAssociations();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (association) => {
    setEditingAssociation(association);
    setEditFormData({
      username: association.username,
      association_name: association.club_name || association.clubName || association.association_name,
      email: association.email || `${association.username}@psgtech.ac.in`,
      password: ""
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.username || !editFormData.association_name) {
      setMessage("⚠️ Please fill in username and association name");
      return;
    }

    try {
      await adminAPI.updateAssociation(editingAssociation._id, {
        username: editFormData.username,
        club_name: editFormData.association_name,
        email: editFormData.email || `${editFormData.username}@psgtech.ac.in`,
        ...(editFormData.password ? { password: editFormData.password } : {})
      });
      setMessage("✅ Association updated successfully!");
      setShowEditModal(false);
      setEditingAssociation(null);
      fetchAssociations();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this association?")) {
      return;
    }

    try {
      await adminAPI.deleteAssociation(id);
      setMessage("✅ Association deleted successfully!");
      fetchAssociations();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-5">
        <div className="text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Association <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Management</span>
          </h1>
          <p className="text-zinc-400 text-xs max-w-2xl">
            Create and manage student clubs and associations for INTRAMS ERM.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-zinc-950/90 backdrop-blur-xl rounded-xl shadow-lg border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-3">
              <h2 className="text-xs font-semibold text-white tracking-wider uppercase">
                All Clubs {filteredAssociations.length > 0 && `(${filteredAssociations.length})`}
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by club name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all outline-none bg-zinc-950 text-white placeholder-zinc-500 font-medium text-xs"
                />
              </div>
              {loading && (
                <div className="text-center py-6">
                  <p className="text-zinc-400 text-xs">Loading clubs...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-6">
                  <p className="text-rose-400 text-xs">Error: {error}</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length === 0 && associations.length > 0 && (
                <div className="text-center py-6">
                  <p className="text-zinc-400 text-xs">No Clubs match your search</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-1 text-sky-400 hover:text-sky-300 underline text-xs"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {!loading && !error && associations.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-zinc-400 text-xs">No Clubs found</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredAssociations.map((association) => (
                    <div key={association._id} className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800/80 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-xs">
                          {association.clubName || association.association_name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">@{association.username} • {association.email || `${association.username}@psgtech.ac.in`}</p>
                      </div>
                      <div className="flex gap-1.5 ml-3">
                        <button
                          onClick={() => handleEdit(association)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sky-400 rounded-md transition-all"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(association._id)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-400 rounded-md transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-950/90 backdrop-blur-xl rounded-xl shadow-lg border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-3">
              <h2 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-400" />
                Create Club
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Create password"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Association Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter association name"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                    value={formData.association_name}
                    onChange={(e) => setFormData({...formData, association_name: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-zinc-200 text-black py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all"
                >
                  CREATE CLUB
                </button>
              </form>
            </div>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full text-slate-100 overflow-hidden">
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wide flex items-center gap-2">
                  <Edit className="w-5 h-5 text-sky-400" />
                  Edit Club
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.email || ""}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Association Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.association_name}
                      onChange={(e) => setEditFormData({...editFormData, association_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm placeholder-slate-500"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-black hover:bg-slate-950 border border-slate-700 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Update
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-slate-800 text-slate-300 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 max-w-sm text-slate-200 text-sm font-semibold z-50">
            <p>{message}</p>
          </div>
        )}

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; INTRAMS ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Add;
