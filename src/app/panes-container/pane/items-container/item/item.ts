import { DirectoryInfo, FileSystemInfo } from '../../../../core/models/file';
import { FileOpener } from '../../../../core/utils/file_opener';

export class Item
{
  public shown = true;
  public selected = false;
  public marked = false;
  public renaming = false;

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
    new FileOpener(this.info).startProcess();
  }
}

export class BackItem extends Item
{
  public get displayName(): string
  {
    return '..';
  }
}
