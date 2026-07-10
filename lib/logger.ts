type LogMeta = Record<string, unknown>;

function safeMeta(meta?: LogMeta) {
  if (!meta) return '';

  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return '';
  }
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(`[store-bridge] INFO ${message}${safeMeta(meta)}`);
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(`[store-bridge] WARN ${message}${safeMeta(meta)}`);
  },
  error(message: string, meta?: LogMeta) {
    console.error(`[store-bridge] ERROR ${message}${safeMeta(meta)}`);
  },
};
