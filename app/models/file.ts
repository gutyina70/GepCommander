import fs from 'fs';
import path from 'path';

export abstract class FileSystemInfo
{
	public fullPath: string;

	public constructor(fullPath: string)
	{
		this.fullPath = fullPath;
	}

	public get parent()
	{
		return new DirectoryInfo(path.dirname(this.fullPath));
	}

	public get name()
	{
		return path.basename(this.fullPath);
	}

	public get exists()
	{
		return fs.existsSync(this.fullPath);
	}
}

export class FileInfo extends FileSystemInfo
{
}

export class DirectoryInfo extends FileSystemInfo
{
	public get children()
	{
		const children = fs.readdirSync(this.fullPath);
		const items: FileSystemInfo[] = [];

		for(const childName of children)
		{
			const childPath = path.join(this.fullPath, childName);
			const childElement = this.infoAsFileOrDirectory(childPath);

			if(childElement)
			{
				items.push(childElement);
			}
		}

		this.sortItems(items)
		return items;
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
}