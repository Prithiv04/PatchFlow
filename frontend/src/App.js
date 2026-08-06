import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/providers/AppProvider';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import ImportVideoPage from '@/pages/ImportVideoPage';
import ProcessingPage from '@/pages/ProcessingPage';
import VideoDetailsPage from '@/pages/VideoDetailsPage';
import CreatePatchPage from '@/pages/CreatePatchPage';
import ImpactAnalysisPage from '@/pages/ImpactAnalysisPage';
import PreviewPage from '@/pages/PreviewPage';
import ApplyPatchPage from '@/pages/ApplyPatchPage';
import HistoryPage from '@/pages/HistoryPage';
import ReportPage from '@/pages/ReportPage';
function App() {
    return (_jsx(AppProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/import", element: _jsx(ImportVideoPage, {}) }), _jsx(Route, { path: "/import-video", element: _jsx(ImportVideoPage, {}) }), _jsx(Route, { path: "/processing", element: _jsx(ProcessingPage, {}) }), _jsx(Route, { path: "/video/:id", element: _jsx(VideoDetailsPage, {}) }), _jsx(Route, { path: "/patch/create", element: _jsx(CreatePatchPage, {}) }), _jsx(Route, { path: "/create-patch", element: _jsx(CreatePatchPage, {}) }), _jsx(Route, { path: "/patch/impact", element: _jsx(ImpactAnalysisPage, {}) }), _jsx(Route, { path: "/impact-analysis", element: _jsx(ImpactAnalysisPage, {}) }), _jsx(Route, { path: "/patch/preview", element: _jsx(PreviewPage, {}) }), _jsx(Route, { path: "/patch/apply", element: _jsx(ApplyPatchPage, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: "/report", element: _jsx(ReportPage, {}) }), _jsx(Route, { path: "/reports", element: _jsx(ReportPage, {}) })] }) }) }) }));
}
export default App;
