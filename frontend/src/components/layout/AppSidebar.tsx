import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Video, 
  FileCode2, 
  BarChart3, 
  History, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/videos", label: "Videos", icon: Video },
  { to: "/patches", label: "Patches", icon: FileCode2 },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/history", label: "History", icon: History },
];

export default function AppSidebar() {
  const { sidebarOpen, toggleSidebar, setMobileMenuOpen } = useDashboardStore();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 glass-sidebar flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-60" : "w-18"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-glow shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-base text-text tracking-tight flex items-center gap-1.5">
                PatchFlow
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  PRO
                </span>
              </span>
            </motion.div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                  isActive
                    ? "bg-primary/15 text-text border border-primary/30 shadow-sm"
                    : "text-muted hover:text-text hover:bg-white/5 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-muted"}`} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Quick Info */}
      <div className="p-3 border-t border-border/50">
        {sidebarOpen ? (
          <div className="glass-card rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                JD
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-text truncate">Jane Doe</p>
                <p className="text-[11px] text-muted truncate">jane@patchflow.io</p>
              </div>
            </div>
            <button className="text-muted hover:text-text p-1 rounded hover:bg-white/10 transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
