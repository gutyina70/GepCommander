import { DirectoryInfo, FileSystemInfo } from "../../core/models/file";
import { childProcess } from "../../core/modules";

export class Item
{
  public shown = true;
  public selected = false;
  public marked = false;

  public info: FileSystemInfo;
  public get displayName(): string
  {
    return this.info.name;
  }

  public get icon(): string
  {
    return this.info instanceof DirectoryInfo ? 'folder' : 'file';
  }

  constructor(info: FileSystemInfo)
  {
    this.info = info;
  }

  public startProcess(): void
  {
    childProcess.exec(`start "" "${this.info.fullPath}"`);
  }
}

export class BackItem extends Item
{
  public get displayName(): string
  {
    return '..';
  }
}
