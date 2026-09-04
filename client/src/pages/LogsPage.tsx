import { useState, useEffect } from 'react';
import { Database, Zap, Activity, RefreshCw } from 'lucide-react';
import SeoHead from '../components/SeoHead';

interface LogEntry {
  timestamp: string;
  level: string;
  endpoint?: string;
  message: string;
  details?: any;
}

interface SystemHealth {
  geminiConfigured: boolean;
  geminiKeyPrefix: string;
  mongoDb: string;
  redis: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/system/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setHealth(data.health);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTestGemini = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/system/test-gemini', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ error: true, message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusColor = (status: string | boolean) => {
    if (status === true || status === 'connected' || status === 'ready') return 'bg-emerald-500';
    if (status === 'connecting') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <>
      <SeoHead title="System Diagnostics — Gulliver Guide" description="Live logs and system health." />
      <div className="min-h-screen bg-slate-900 text-slate-300 p-6 md:p-10 font-mono">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="text-emerald-400" /> System Diagnostics
            </h1>
            <button 
              onClick={fetchLogs} 
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Aktualisieren
            </button>
          </div>

          {/* Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400 flex items-center gap-2"><Database size={16}/> MongoDB</span>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(health?.mongoDb || '')}`}></span>
              </div>
              <div className="text-lg text-white font-semibold capitalize">{health?.mongoDb || 'Unknown'}</div>
            </div>

            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400 flex items-center gap-2"><Zap size={16}/> Redis</span>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(health?.redis || '')}`}></span>
              </div>
              <div className="text-lg text-white font-semibold capitalize">{health?.redis || 'Unknown'}</div>
            </div>

            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400 flex items-center gap-2"><Activity size={16}/> Gemini API</span>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(health?.geminiConfigured || false)}`}></span>
              </div>
              <div className="text-lg text-white font-semibold flex items-center justify-between">
                <span>{health?.geminiConfigured ? 'Configured' : 'Missing'}</span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Key: {health?.geminiKeyPrefix}</span>
              </div>
            </div>
          </div>

          {/* Gemini Test Section */}
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Gemini API Ping Test</h2>
              <button 
                onClick={handleTestGemini}
                disabled={isTesting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {testResult && (
              <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto text-sm">
                <pre className="text-emerald-400">{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Logs Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Live Logs ({logs.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                  <tr>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Level</th>
                    <th className="px-5 py-3">Endpoint</th>
                    <th className="px-5 py-3">Message / Error Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                          log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                        {log.endpoint || '-'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-slate-200 mb-1">{log.message}</div>
                        {log.details && (
                          <pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap font-mono bg-slate-900/50 p-2 rounded">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                        No logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
