import { fs, nodeDiskInfo, path } from '../modules';

export abstract class FileSystemInfo
{
  private _fullPath = '';

  public get fullPath(): string
  {
    return this._fullPath;
  }

  public set fullPath(value: string)
  {
    this._fullPath = value.replace('/', '\\');
  }

  public constructor(fullPath: string)
  {
    this.fullPath = fullPath;
  }

  public get parent(): (DirectoryInfo | null)
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
}

export class FileInfo extends FileSystemInfo
{
}

export class DirectoryInfo extends FileSystemInfo
{
  public constructor(fullPath: string)
  {
    if(fullPath.endsWith(':'))
    {
      fullPath += '\\';
    }
    super(fullPath);
  }

  public get children(): FileSystemInfo[]
  {
    let infos: FileSystemInfo[];
    if(this.equals(DirectoryInfo.root))
    {
      infos = this.getDriveInfos();
    }
    else
    {
      infos = this.getChildrenDirectoryInfos();
    }
    this.sortItems(infos);
    return infos;
  }

  private getChildrenDirectoryInfos()
  {
    const infos: FileSystemInfo[] = [];
    const children = fs.readdirSync(this.fullPath);
    for(const childName of children)
    {
      const childPath = path.join(this.fullPath, childName);
      const childInfo = this.infoAsFileOrDirectory(childPath);

      if(childInfo)
      {
        infos.push(childInfo);
      }
    }
    return infos;
  }

  private getDriveInfos()
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

  private sortItems(items: FileSystemInfo[])
  {
    items.sort((a, b) =>
    {
      if(a instanceof DirectoryInfo && b instanceof FileInfo) return -1;
      if(a instanceof FileInfo && b instanceof DirectoryInfo) return 1;
      return 0;
    });
  }

  private infoAsFileOrDirectory(path: string): (FileInfo | DirectoryInfo | null)
  {
    try
    {
      if(fs.lstatSync(path).isDirectory())
      {
        return new DirectoryInfo(path);
      }
      else
      {
        return new FileInfo(path);
      }
    }
    catch(error)
    {
      // Probably a system file or folder, skip this.
      // console.error(path + ' skipped');
      return null;
    }
  }

  public get parent(): DirectoryInfo
  {
    if(this.equals(DirectoryInfo.root))
    {
      return null;
    }
    if(this.isDriveRoot)
    {
      return DirectoryInfo.root;
    }
    return new DirectoryInfo(path.dirname(this.fullPath));
  }

  public get name(): string
  {
    if(this.isDriveRoot)
    {
      return this.drive;
    }
    return path.basename(this.fullPath);
  }

  private get drive()
  {
    return this.fullPath.split(':')[0];
  }

  private get isDriveRoot()
  {
    return this.fullPath.endsWith(':\\');
  }

  private static get root()
  {
    return new DirectoryInfo('\\');
  }
}
