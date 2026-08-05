import React from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  FileCode2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Upload,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  Plus,
  Play,
  BarChart3,
  Layers,
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { mockVideos } from "@/mocks/videos";
import { mockPatchActivities } from "@/mocks/patches";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* 1. Hero Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl p-6 md:p-8 glass-card border border-white/15 bg-gradient-to-r from-card via-surface to-card">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patch Engine v2.4 Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-text tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-text via-purple-200 to-primary bg-clip-text text-transparent">Jane</span>
            </h1>
            <p className="text-muted text-sm md:text-base leading-relaxed">
              Your video patches are up to date. You saved <strong className="text-text font-semibold">142 hours</strong> of re-rendering time this month.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/import-video"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all active:scale-[0.98]"
            >
              <Upload className="w-4.5 h-4.5" />
              <span>Import Video</span>
            </Link>
            <Link
              to="/create-patch"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl glass-card hover:bg-white/10 text-text font-medium text-sm border border-border transition-all"
            >
              <Plus className="w-4.5 h-4.5 text-primary" />
              <span>Create Patch</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Four Analytics Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Videos */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Videos</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-text tracking-tight">24</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-success">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Patches */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Active Patches</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileCode2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-text tracking-tight">18</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-muted">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>3 processing now</span>
            </div>
          </div>
        </div>

        {/* Card 3: Success Rate */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Success Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-text tracking-tight">98.4%</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>High confidence score</span>
            </div>
          </div>
        </div>

        {/* Card 4: Hours Saved */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Hours Saved</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-text tracking-tight">142h</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-muted">
              <span>vs 18h manual renders</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Main Split Grid: Recent Videos & Recent Patch Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Recent Videos */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text tracking-tight">Recent Videos</h2>
              <p className="text-xs text-muted">Videos currently managed under active patch trees</p>
            </div>
            <Link
              to="/videos"
              className="text-xs font-semibold text-primary hover:text-purple-400 flex items-center gap-1 transition"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockVideos.map((vid) => (
              <div
                key={vid.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden group flex flex-col justify-between border border-border"
              >
                {/* Thumbnail Header */}
                <div className="relative h-36 w-full overflow-hidden bg-surface">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold text-text border border-white/10">
                    {vid.version}
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[11px] font-mono text-muted">
                    {vid.duration}
                  </div>

                  <button className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-glow">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-text line-clamp-1 group-hover:text-primary transition-colors">
                    {vid.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{vid.patchesCount} patches applied</span>
                    <span>{vid.lastPatched}</span>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {vid.status}
                    </span>
                    <Link
                      to={`/video/${vid.id}`}
                      className="text-xs font-semibold text-text hover:text-primary flex items-center gap-0.5 transition"
                    >
                      Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right 1 Column: Patch Activity Timeline */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text tracking-tight">Recent Patch Activity</h2>
              <p className="text-xs text-muted">Live patch events</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-primary hover:text-purple-400 flex items-center gap-1 transition"
            >
              History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border space-y-6">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
              {mockPatchActivities.map((activity) => {
                let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                let IconNode = CheckCircle2;

                if (activity.action === "failed") {
                  badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                  IconNode = AlertCircle;
                } else if (activity.action === "created") {
                  badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  IconNode = Plus;
                }

                return (
                  <div key={activity.id} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary transition">
                      <IconNode className="w-3 h-3 text-muted group-hover:text-primary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                          {activity.action}
                        </span>
                        <span className="text-[11px] text-muted font-mono">{activity.timestamp}</span>
                      </div>
                      <p className="text-xs font-semibold text-text group-hover:text-primary transition-colors">
                        {activity.patchName}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        On <span className="text-text/80">{activity.videoTitle}</span> by {activity.author}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Quick Actions Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-text tracking-tight">Quick Actions</h2>
          <p className="text-xs text-muted">Jump straight into high priority workflows</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/import-video"
            className="glass-card glass-card-hover p-5 rounded-2xl group flex flex-col justify-between space-y-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors flex items-center justify-between">
                Import Video <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted mt-1">Upload raw MP4/MOV assets to process patches.</p>
            </div>
          </Link>

          <Link
            to="/create-patch"
            className="glass-card glass-card-hover p-5 rounded-2xl group flex flex-col justify-between space-y-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors flex items-center justify-between">
                Create Patch <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted mt-1">Define region, timestamp & audio/visual edits.</p>
            </div>
          </Link>

          <Link
            to="/impact-analysis"
            className="glass-card glass-card-hover p-5 rounded-2xl group flex flex-col justify-between space-y-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors flex items-center justify-between">
                Impact Analysis <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted mt-1">Analyze patch diffs before rendering final video.</p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="glass-card glass-card-hover p-5 rounded-2xl group flex flex-col justify-between space-y-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors flex items-center justify-between">
                View Reports <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted mt-1">Export rendering time & bandwidth savings breakdown.</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
