import React from "react";
import { Search, Bell, Menu, Plus, Command } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppHeader() {
  const { toggleMobileMenu } = useDashboardStore();

  return (
    <header className="sticky top-0 z-30 h-16 glass-header px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left side: Mobile Menu Toggle & Title / Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-muted hover:text-text hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search videos, patches, or reports..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-card/60 border border-border text-sm text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 hover:border-white/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] font-medium text-muted/70 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      {/* Right side: Quick Action CTA, Notifications, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/import-video"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-medium text-sm shadow-glow transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Import Video</span>
          </Link>
        </motion.div>

        {/* Notifications Button */}
        <button className="relative p-2.5 rounded-xl bg-card/40 border border-border text-muted hover:text-text hover:bg-white/10 hover:border-white/20 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-border/50">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-sm ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
              JD
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
