import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api';
import { LogOut, Code, BarChart3, Menu, X, Package, TrendingUp, FileText, Download, Loader2, Users, Gift, History, ShieldCheck, ShoppingCart } from 'lucide-react';

function NavItem({ to, icon: Icon, label, mobile }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-white/30 text-white font-semibold'
            : 'text-white/80 hover:bg-white/20 hover:text-white'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { logout, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [summaryPdfUrl, setSummaryPdfUrl] = useState(null);
  const [summaryPdfBlob, setSummaryPdfBlob] = useState(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [summaryFileName, setSummaryFileName] = useState('event_summary');

  useEffect(() => {
    return () => {
      if (summaryPdfUrl) URL.revokeObjectURL(summaryPdfUrl);
    };
  }, [summaryPdfUrl]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userRole = user?.role ?? localStorage.getItem('role') ?? 'member';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500/30" />
      </div>
    );
  }

  const adminItems = [
    { to: '/cards',        icon: BarChart3,    label: 'Dashboard'    },
    { to: '/add',          icon: Code,         label: 'Add User'     },
    { to: '/items',        icon: Package,      label: 'Items'        },
    { to: '/stocks',       icon: Package,      label: 'Stocks'       },
    { to: '/procurements', icon: ShoppingCart, label: 'Procurements' },
    { to: '/stats',        icon: TrendingUp,   label: 'Statistics'   },
    { to: '/grant-items',  icon: Gift,         label: 'Grant Items'  },
    { to: '/grant-logs',   icon: History,      label: 'Past Grants'  },
    { to: '/edit-access',  icon: ShieldCheck,  label: 'Edit Access'  },
    { to: '/role-pdf',     icon: Users,        label: 'Role PDFs'    },
  ];

  const memberItems = [
    { to: '/cards',       icon: BarChart3,   label: 'Dashboard'    },
    { to: '/edit-access', icon: ShieldCheck, label: 'Edit Access'  },
    { to: '/role-pdf',    icon: Users,       label: 'Role PDFs'    },
  ];

  const procurementItems = [
    { to: '/grant-items',  icon: Gift,         label: 'Grant Items'  },
    { to: '/grant-logs',   icon: History,      label: 'Past Grants'  },
    { to: '/stocks',       icon: Package,      label: 'Stocks'       },
    { to: '/procurements', icon: ShoppingCart, label: 'Procurements' },
  ];

  const navItems =
    userRole === 'admin'
      ? adminItems
      : userRole === 'procurement'
      ? procurementItems
      : memberItems;

  const openSummaryModal = () => setSummaryModalOpen(true);

  const closeSummaryModal = () => {
    setSummaryModalOpen(false);
    if (summaryPdfUrl) {
      URL.revokeObjectURL(summaryPdfUrl);
      setSummaryPdfUrl(null);
    }
    setSummaryPdfBlob(null);
  };

  const handleEventSummary = async () => {
    if (summaryLoading) return;
    setSummaryError('');
    setSummaryLoading(true);
    if (summaryPdfUrl) {
      URL.revokeObjectURL(summaryPdfUrl);
      setSummaryPdfUrl(null);
    }
    try {
      const response = await adminAPI.getEventsSummaryPDF();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSummaryPdfBlob(blob);
      setSummaryPdfUrl(url);
      openSummaryModal();
    } catch (err) {
      setSummaryError(err?.response?.data?.message || 'Failed to load summary PDF.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSummaryDownload = () => {
    if (!summaryPdfBlob) return;
    const url = URL.createObjectURL(summaryPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summaryFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full pt-4 bg-slate-950/95 border-r border-slate-800/80 text-slate-100">
      <div className="flex flex-col flex-grow px-4 py-4 bg-slate-900/60 backdrop-blur-sm rounded-xl mx-2 border border-slate-800/60">
        <div className="mb-4 px-3 py-1.5 rounded-lg bg-sky-950/80 border border-sky-500/30 text-center">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest font-mono">
            {userRole} • Horizon
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} mobile={mobile} />
          ))}

          {userRole !== 'procurement' && (
            <button
              onClick={handleEventSummary}
              disabled={summaryLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 mt-3 w-full rounded-xl text-sm font-medium transition-all bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {summaryLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              ) : (
                <FileText className="w-5 h-5 text-sky-400" />
              )}
              Event Summary
            </button>
          )}
        </nav>

        {summaryError && (
          <div className="mt-3 px-3 py-2 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg">
            {summaryError}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 bg-slate-900 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30 border border-slate-800 rounded-xl text-sm transition-all font-medium"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 ocean-gradient-bg">
      {desktopSidebarOpen && (
        <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-60 bg-slate-950 shadow-2xl border-r border-slate-800">
          <div className="flex items-center justify-between px-4 py-4 bg-slate-900/90 border-b border-cyan-500/20">
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 mr-2 transition-colors"
            >
              {desktopSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-bold text-white font-heading tracking-wide">INTRAMS Admin</h1>
          </div>
          <SidebarContent />
        </div>
      )}

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-10 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-20 w-60 bg-slate-950 shadow-2xl transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 z-30"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent mobile />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-950 border-b border-cyan-500/20 shadow-lg z-20">
        <div className="flex items-center px-6 py-4 bg-slate-950">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white mr-3"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-bold text-white font-heading">INTRAMS Admin</h1>
          </div>
        </div>
      </div>

      <div className={`${desktopSidebarOpen ? 'lg:ml-60' : ''} flex-1 flex flex-col`}>
        {!desktopSidebarOpen && (
          <button
            onClick={() => setDesktopSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-400 hover:to-indigo-500 shadow-xl shadow-sky-500/20"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <main className="flex-1">{children}</main>
      </div>

      {summaryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 rounded-3xl shadow-2xl border border-sky-500/20 w-full max-w-6xl h-[90vh] flex flex-col text-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                Event Summary Report
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSummaryDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={closeSummaryModal}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6">
              {summaryPdfUrl ? (
                <iframe
                  src={summaryPdfUrl}
                  className="w-full h-full border border-slate-800 rounded-xl bg-slate-950"
                  title="Event Summary PDF"
                  frameBorder="0"
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No PDF available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
