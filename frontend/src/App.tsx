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
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<DashboardPage />} />

            {/* Import & Processing Flow */}
            <Route path="/import" element={<ImportVideoPage />} />
            <Route path="/import-video" element={<ImportVideoPage />} />
            <Route path="/processing" element={<ProcessingPage />} />

            {/* Video Details */}
            <Route path="/video/:id" element={<VideoDetailsPage />} />
            <Route path="/videos" element={<VideoDetailsPage />} />

            {/* Patch Workflow */}
            <Route path="/create-patch" element={<CreatePatchPage />} />
            <Route path="/patch/create" element={<CreatePatchPage />} />
            <Route path="/patch/preview" element={<PreviewPage />} />
            <Route path="/patch/apply" element={<ApplyPatchPage />} />

            {/* Impact Analysis */}
            <Route path="/patch/impact" element={<ImpactAnalysisPage />} />
            <Route path="/impact-analysis" element={<ImpactAnalysisPage />} />

            {/* History & Report */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/reports" element={<ReportPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
