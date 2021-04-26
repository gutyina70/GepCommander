import fs from 'fs';
import path from 'path';

export abstract class FileSystemInfo {

	fullPath: string;

	constructor(fullPath: string) {
		this.fullPath = fullPath;
	}

	getParent() {
		return new DirectoryInfo(path.dirname(this.fullPath));
	}

}

export class FileInfo extends FileSystemInfo {



}

export class DirectoryInfo extends FileSystemInfo {

	getChildren() {
		const children = fs.readdirSync(this.fullPath);
		const result: FileSystemInfo[] = [];

		for (const childName of children) {
			const childPath = path.join(this.fullPath, childName);
			const childElement = this.getInfoAsFileOrDirectory(childPath);

			if (childElement) {
				result.push(childElement);
			}
		}

		return result;
	}

	private getInfoAsFileOrDirectory(path: string): (FileInfo | DirectoryInfo | null) {
		try {
			if (fs.lstatSync(path).isDirectory()) {
				return new DirectoryInfo(path);
			}
			else {
				return new FileInfo(path);
			}
		}
		catch (error) {
			console.error(path + ' skipped');
			return null;
		}
	}
}