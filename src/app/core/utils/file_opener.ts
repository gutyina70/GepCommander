import { ChildProcess } from 'child_process';
import { isLinux, isWindows } from '../../core/utils/cross_platform';
import { FileInfo } from '../models/file';
import { childProcess } from '../modules';

export class FileOpener
{
  constructor(private info: FileInfo)
  {
  }

  public startProcess(): void
  {
    if(isWindows())
    {
      this.startWindowsProcess();
    }
    else if(isLinux())
    {
      this.startLinuxProcess();
    }
  }

  private startWindowsProcess(): void
  {
    this.tryRun(this.openWithStart(), (startCode) =>
      this.showErrorCode(startCode));
  }

  private startLinuxProcess(): void
  {
    this.tryRun(this.openWithXdgOpen(), (xdgCode) =>
      this.tryRun(this.openWithDotSlash(), (dotSlashCode) =>
        this.showErrorCode(dotSlashCode)));
  }

  private showErrorCode(code: number): void
  {
    console.error(`Failed to open file with error code: ${code}`);
  }

  private openWithStart(): ChildProcess
  {
    return childProcess.exec(`start "" "${this.info.fullPath}"`);
  }

  private openWithXdgOpen(): ChildProcess
  {
    return childProcess.exec(`xdg-open "${this.info.fullPath}"`);
  }

  private openWithDotSlash(): ChildProcess
  {
    return childProcess.exec(`"${this.info.fullPath}"`);
  }

  private tryRun(process: ChildProcess, onError: (code: number) => void): void
  {
    process.on('exit', (code, _) =>
    {
      if(code != 0)
      {
        onError(code);
      }
    })
  }
}
