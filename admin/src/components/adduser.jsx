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
        value: "#020617",
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Association <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Management</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Create and manage student clubs and associations for INTRAMS ERM.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                All Clubs {filteredAssociations.length > 0 && `(${filteredAssociations.length})`}
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by club name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              {loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading clubs...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {error}</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length === 0 && associations.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No Clubs match your search</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sky-400 hover:text-sky-300 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {!loading && !error && associations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No Clubs found</p>
                </div>
              )}
              {!loading && !error && filteredAssociations.length > 0 && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredAssociations.map((association) => (
                    <div key={association._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {association.clubName || association.association_name}
                          </h3>
                          <p className="text-sm text-gray-600">@{association.username} • {association.email || `${association.username}@psgtech.ac.in`}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(association)}
                            className="p-2 bg-sky-500 text-white hover:bg-sky-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(association._id)}
                            className="p-2 bg-red-500 text-white hover:bg-red-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Club
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Create password"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Association Name</label>
                  <input
                    type="text"
                    placeholder="Enter association name"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    value={formData.association_name}
                    onChange={(e) => setFormData({...formData, association_name: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-orange-500 hover:to-yellow-500 focus:ring-4 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Club
                </button>
              </form>
            </div>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4 rounded-t-3xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Club
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.email || ""}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Association Name</label>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      value={editFormData.association_name}
                      onChange={(e) => setEditFormData({...editFormData, association_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500/30 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200"
                    >
                      Update
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-200"
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
          <div className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-4 max-w-sm">
            <p className="text-sm text-gray-700">{message}</p>
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
