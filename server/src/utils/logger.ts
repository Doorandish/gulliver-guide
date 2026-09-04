export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  endpoint?: string;
  message: string;
  details?: any;
}

class RingBufferLogger {
  private logs: LogEntry[] = [];
  private readonly maxSize = 100;

  addLog(entry: Omit<LogEntry, 'timestamp'>) {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    this.logs.unshift(fullEntry);
    if (this.logs.length > this.maxSize) {
      this.logs.pop();
    }
  }

  getLogs() {
    return this.logs;
  }
}

export const systemLogger = new RingBufferLogger();

// Intercept console.error
const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  systemLogger.addLog({
    level: 'ERROR',
    message: args.map(a => (typeof a === 'object' && a instanceof Error ? a.message : String(a))).join(' '),
    details: args.find(a => a instanceof Error) ? (args.find(a => a instanceof Error) as Error).stack : args
  });
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  originalConsoleWarn(...args);
  systemLogger.addLog({
    level: 'WARN',
    message: args.map(a => String(a)).join(' ')
  });
};
