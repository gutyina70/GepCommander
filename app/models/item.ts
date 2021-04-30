import { exec } from "child_process";
import { FileSystemInfo } from "./file";

export class Item
{
	public shown: boolean = true;
	public selected: boolean = false;
	public marked: boolean = false;

	public info: FileSystemInfo;
	public get displayName()
	{
		return this.info.name
	}

	constructor(info: FileSystemInfo)
	{
		this.info = info;
	}

	public startProcess()
	{
		exec(`start "" "${this.info.fullPath}"`)
	}
}

export class BackItem extends Item
{
	public get displayName()
	{
		return '..'
	}
}