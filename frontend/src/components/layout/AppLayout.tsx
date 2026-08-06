import React, { PropsWithChildren } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AppLayout({ children }: PropsWithChildren<{}>) {
  const { sidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useDashboardStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block shrink-0">
        <AppSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              <AppSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-out ${
          sidebarOpen ? "md:pl-60" : "md:pl-[72px]"
        }`}
      >
        <AppHeader />

        {/* Page wrapper with page-enter animation keyed by route */}
        <main
          key={location.pathname}
          className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto page-enter"
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
