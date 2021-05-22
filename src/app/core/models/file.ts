import { fs, nodeDiskInfo, path } from '../modules';
import { isLinux, isWindows } from '../utils/cross_platform';

export abstract class FileSystemInfo
{
  private _fullPath = '';

  public get fullPath(): string
  {
    return this._fullPath;
  }

  public set fullPath(value: string)
  {
    if(isWindows())
    {
      this._fullPath = value.replace('/', path.sep)
    }
    else if(isLinux())
    {
      this._fullPath = value.replace('\\', path.sep)
    }
  }

  public constructor(fullPath: string)
  {
    this.fullPath = fullPath;
  }

  public get parent(): DirectoryInfo | null
  {
    return new DirectoryInfo(path.dirname(this.fullPath));
  }

  public get exists(): boolean
  {
    return fs.existsSync(this.fullPath);
  }

  public get name(): string
  {
    return path.basename(this.fullPath);
  }

  public equals(other: FileSystemInfo): boolean
  {
    return this.fullPath === other.fullPath;
  }

  public abstract rename(newName: string): void

  public move(newInfo: FileSystemInfo): void
  {
    fs.renameSync(this.fullPath, newInfo.fullPath);
  }

  public abstract copyTo(newInfo: FileSystemInfo): void

  public abstract moveTo(newInfo: FileSystemInfo): void

  public copyFile(newInfo: FileSystemInfo): void
  {
    fs.copyFileSync(this.fullPath, newInfo.fullPath);
  }
}

export class FileInfo extends FileSystemInfo
{
  public rename(newName: string): void
  {
    const newPath = new FileInfo(path.join(this.parent.fullPath, newName));
    this.move(newPath);
  }

  public copyTo(toFolder: DirectoryInfo): void
  {
    const newPath = new FileInfo(path.join(toFolder.fullPath, this.name));
    this.copyFile(newPath);
  }

  public moveTo(toFolder: DirectoryInfo): void
  {
    const newPath = new FileInfo(path.join(toFolder.fullPath, this.name));
    this.move(newPath);
  }
}

export class DirectoryInfo extends FileSystemInfo
{
  public constructor(fullPath: string, format = true)
  {
    if(format && fullPath != DirectoryInfo.root.fullPath)
    {
      fullPath = DirectoryInfo.formatPath(fullPath);
    }
    super(fullPath);
  }

  private static formatPath(fullPath: string): string
  {
    fullPath = fullPath.replace('/', '\\');
    if(isWindows())
    {
      if(fullPath.length == 1)
      {
        fullPath += ':';
      }
    }
    if(!fullPath.endsWith(path.sep))
    {
      fullPath = path.join(fullPath, path.sep);
    }
    return fullPath
  }

  public get children(): FileSystemInfo[]
  {
    let infos: FileSystemInfo[];
    if(isWindows())
    {
      if(this.equals(DirectoryInfo.root))
      {
        infos = this.getDriveInfos();
      }
      else
      {
        infos = this.getChildrenDirectoryInfos();
      }
    }
    if(isLinux())
    {
      infos = this.getChildrenDirectoryInfos();
    }
    this.sortItems(infos);
    return infos;
  }

  private getChildrenDirectoryInfos(): FileSystemInfo[]
  {
    const infos: FileSystemInfo[] = [];
    const children = fs.readdirSync(this.fullPath);
    for(const childName of children)
    {
      const childPath = path.join(this.fullPath, childName);
      const childInfo = this.pathAsFileOrDirectory(childPath);
      if(childInfo)
      {
        infos.push(childInfo);
      }
    }
    return infos;
  }

  private getDriveInfos(): FileSystemInfo[]
  {
    const infos: FileSystemInfo[] = [];
    const drives = nodeDiskInfo.getDiskInfoSync();
    for(const drive of drives)
    {
      const info = new DirectoryInfo(drive.mounted);
      if(info.exists)
      {
        infos.push(info);
      }
    }
    return infos;
  }

  private sortItems(items: FileSystemInfo[]): void
  {
    items.sort((a, b) =>
    {
      if(a instanceof DirectoryInfo && b instanceof FileInfo) return -1;
      if(a instanceof FileInfo && b instanceof DirectoryInfo) return 1;
      return 0;
    });
  }

  private pathAsFileOrDirectory(fullPath: string): FileInfo | DirectoryInfo | null
  {
    try
    {
      if(fs.lstatSync(fullPath).isDirectory())
      {
        return new DirectoryInfo(fullPath);
      }
      else
      {
        return new FileInfo(fullPath);
      }
    }
    catch(error)
    {
      // Probably a system file or folder, skip this.
      // console.error(path + ' skipped');
      return null;
    }
  }

  public get parent(): DirectoryInfo | null
  {
    if(this.equals(DirectoryInfo.root))
    {
      return null;
    }
    if(isWindows() && this.isDriveRoot)
    {
      return DirectoryInfo.root;
    }
    return new DirectoryInfo(path.dirname(this.fullPath));
  }

  public get name(): string
  {
    if(isWindows() && this.isDriveRoot)
    {
      return this.drive;
    }
    return path.basename(this.fullPath);
  }

  private get drive(): string
  {
    return this.fullPath.split(':')[0];
  }

  private get isDriveRoot(): boolean
  {
    return this.fullPath.endsWith(':\\');
  }

  public static get root(): DirectoryInfo
  {
    return new DirectoryInfo(path.sep, false);
  }

  public rename(newName: string): void
  {
    const newPath = new DirectoryInfo(path.join(this.parent.fullPath, newName));
    this.move(newPath);
  }

  public copyTo(toFolder: DirectoryInfo): void
  {
    const newPath = new DirectoryInfo(path.join(toFolder.fullPath, this.name));
    fs.mkdirSync(newPath.fullPath);
    for(const info of this.children)
    {
      info.copyTo(newPath);
    }
  }

  public moveTo(toFolder: DirectoryInfo): void
  {
    const newPath = new DirectoryInfo(path.join(toFolder.fullPath, this.name));
    this.move(newPath);
  }
}
