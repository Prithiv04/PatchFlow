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
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/videos", label: "Videos", icon: Video },
  { to: "/patches", label: "Patches", icon: FileCode2 },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/history", label: "History", icon: History },
];

export default function AppSidebar() {
  const { sidebarOpen, toggleSidebar, setMobileMenuOpen } = useDashboardStore();

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 bottom-0 z-40 glass-sidebar flex flex-col transition-[width] duration-300 ease-out ${
        sidebarOpen ? "w-60" : "w-[72px]"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-glow shrink-0">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-extrabold text-sm text-text tracking-tight whitespace-nowrap flex items-center gap-1.5">
                  PatchFlow
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                    PRO
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle — desktop only */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden md:flex p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/8 border border-transparent hover:border-white/10 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          )}
        </motion.button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all group focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isActive
                    ? "bg-primary/12 text-text border border-primary/28"
                    : "text-muted hover:text-text hover:bg-white/5 border border-transparent hover:border-white/8"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full"
                      style={{ boxShadow: "0 0 10px rgba(124,58,237,0.7)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? "text-primary" : "text-muted group-hover:text-text"
                    }`}
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-card/90 border border-border text-xs font-semibold text-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50"
                    >
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — User card */}
      <div className="p-2.5 border-t border-border/40 shrink-0">
        {sidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-3 flex items-center justify-between gap-2 hover:border-white/18 transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                JD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text truncate">Jane Doe</p>
                <p className="text-[11px] text-muted truncate">jane@patchflow.io</p>
              </div>
            </div>
            <motion.button
              type="button"
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label="Open settings"
              className="text-muted hover:text-text p-1.5 rounded-lg hover:bg-white/8 transition shrink-0 focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
