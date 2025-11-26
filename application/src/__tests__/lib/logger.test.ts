import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Logger Utility', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Development mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.resetModules();
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should log info messages in development', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Test info message');
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test info message');
    });

    it('should log warn messages in development', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.warn('Test warn message');
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warn message');
    });

    it('should log error messages in development', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error message');
    });

    it('should log debug messages in development', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.debug('Test debug message');
      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('Test debug message');
    });

    it('should format messages with timestamp', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Test message');
      const logCall = consoleLogSpy.mock.calls[0][0];
      // Check for ISO timestamp format
      expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include additional arguments in formatted message', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Test message', { key: 'value' }, 123);
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('Test message');
      expect(logCall).toContain('key');
      expect(logCall).toContain('value');
      expect(logCall).toContain('123');
    });
  });

  describe('Production mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.resetModules();
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should not log info messages in production', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Test info message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not log warn messages in production', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.warn('Test warn message');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should always log error messages even in production', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error message');
    });

    it('should not log debug messages in production', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.debug('Test debug message');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('Message formatting', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.resetModules();
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should format messages without arguments correctly', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Simple message');
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toMatch(/\[.*\] \[INFO\] Simple message/);
    });

    it('should format messages with multiple arguments', async () => {
      const logger = (await import('@/lib/logger')).default;
      logger.info('Message with args', 'arg1', { key: 'value' });
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('Message with args');
      expect(logCall).toContain('arg1');
      expect(logCall).toContain('key');
    });

    it('should handle error objects in arguments', async () => {
      const logger = (await import('@/lib/logger')).default;
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      const logCall = consoleErrorSpy.mock.calls[0][0];
      expect(logCall).toContain('Error occurred');
    });
  });
});

