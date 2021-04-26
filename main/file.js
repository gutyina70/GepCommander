const fs = require('fs')
const Path = require('path')

class File
{
	constructor(path)
	{
		this.path = path
	}

	getParent()
	{
		return new Directory(Path.dirname(this.path))
	}
}

class Directory
{
	constructor(path)
	{
		this.path = path
	}

	getChildren()
	{
		const children = fs.readdirSync(this.path)
		const result = []
		children.forEach(childName => {
			const childPath = Path.join(this.path, childName)
			try
			{
				if(fs.lstatSync(childPath).isDirectory())
				{
					result.push(new Directory(childPath));
				}
				else
				{
					result.push(new File(childPath));
				}
			}
			catch(error)
			{
				console.error(childPath + ' skipped')
			}
		});
		return result
	}

	getParent()
	{
		return new Directory(Path.dirname(this.path))
	}
}


exports.File = File
exports.Directory = Directory