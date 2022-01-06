export default interface ILogger {
  /**
   * Logs a silly message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  silly(...args: unknown[]): void;

  /**
   * Logs a trace message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  trace(...args: unknown[]): void;

  /**
   * Logs a debug message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  debug(...args: unknown[]): void;

  /**
   * Logs an info message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  info(...args: unknown[]): void;

  /**
   * Logs a warn message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  warn(...args: unknown[]): void;

  /**
   * Logs an error message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  error(...args: unknown[]): void;

  /**
   * Logs a fatal message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  fatal(...args: unknown[]): void;
}
