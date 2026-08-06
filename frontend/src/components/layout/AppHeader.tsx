import React from "react";
import { Search, Bell, Menu, Plus, Command } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppHeader() {
  const { toggleMobileMenu } = useDashboardStore();

  return (
    <header
      className="sticky top-0 z-30 h-16 glass-header px-4 md:px-6 flex items-center justify-between gap-4"
      role="banner"
    >
      {/* Left — Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-xl text-muted hover:text-text hover:bg-white/8 border border-transparent hover:border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Global Search */}
        <div className="relative w-full max-w-md hidden sm:block group">
          <label htmlFor="global-search" className="sr-only">Search videos, patches, or reports</label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            autoComplete="off"
            placeholder="Search videos, patches, reports…"
            className="w-full h-10 pl-10 pr-14 rounded-xl bg-card/60 border border-border text-sm text-text placeholder:text-muted/55 hover:border-white/18 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-card/90 transition-all"
          />
          <kbd
            aria-label="keyboard shortcut command K"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] font-medium text-muted/60 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded pointer-events-none"
          >
            <Command className="w-3 h-3" aria-hidden="true" /> K
          </kbd>
        </div>
      </div>

      {/* Right — CTA, Notifications, Avatar */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Import CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/import-video"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all"
            aria-label="Import a new video"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Import Video</span>
          </Link>
        </motion.div>

        {/* Notifications */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="View notifications"
          className="relative p-2.5 rounded-xl bg-card/40 border border-border text-muted hover:text-text hover:bg-white/8 hover:border-white/18 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span
            aria-label="1 unread notification"
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-background"
          />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-border/60 mx-1" aria-hidden="true" />

        {/* User Avatar */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open user menu for Jane Doe"
          className="relative focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-primary/25 hover:ring-primary/55 transition-all">
            JD
          </div>
          <span
            aria-label="online"
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-background"
          />
        </motion.button>
      </div>
    </header>
  );
}
