import { injectable } from 'inversify';
import { LoggerWithoutCallSite } from 'tslog';
import ILogger from '../../domain/interface/infra/repository/log/ILogger';

@injectable()
export default class Logger implements ILogger {
  private readonly logger = new LoggerWithoutCallSite();

  silly(...args: unknown[]): void {
    this.logger.silly(args);
  }

  trace(...args: unknown[]): void {
    this.logger.trace(args);
  }

  debug(...args: unknown[]): void {
    this.logger.debug(args);
  }

  info(...args: unknown[]): void {
    this.logger.info(args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(args);
  }

  error(...args: unknown[]): void {
    this.logger.error(args);
  }

  fatal(...args: unknown[]): void {
    this.logger.fatal(args);
  }
}
