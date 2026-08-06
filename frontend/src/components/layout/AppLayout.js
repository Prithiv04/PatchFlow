import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
export default function AppLayout({ children }) {
    const { sidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useDashboardStore();
    const location = useLocation();
    return (_jsxs("div", { className: "min-h-screen bg-background text-text flex", children: [_jsx("div", { className: "hidden md:block shrink-0", children: _jsx(AppSidebar, {}) }), _jsx(AnimatePresence, { children: mobileMenuOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: () => setMobileMenuOpen(false), className: "fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden" }, "overlay"), _jsx(motion.div, { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" }, transition: { type: "spring", damping: 26, stiffness: 220 }, className: "fixed inset-y-0 left-0 z-50 w-64 md:hidden", children: _jsx(AppSidebar, {}) }, "drawer")] })) }), _jsxs("div", { className: `flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-out ${sidebarOpen ? "md:pl-60" : "md:pl-[72px]"}`, children: [_jsx(AppHeader, {}), _jsx("main", { className: "flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto page-enter", role: "main", children: children }, location.pathname)] })] }));
}
