export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  error: (message: string, ...meta: any[]) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  audit: (actor: string, action: string, entity: string, entityId: string, metadata?: any) => {
    console.log(`[AUDIT] [${new Date().toISOString()}] Actor: ${actor} | Action: ${action} | Entity: ${entity}#${entityId}`, metadata ? JSON.stringify(metadata) : '');
  }
};
