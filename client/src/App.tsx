import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlanDetailPage from './pages/PlanDetailPage';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wochenendtrip/:slug" element={<PlanDetailPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
