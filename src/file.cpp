#include "file.h"

FileSystemInfo::FileSystemInfo(fs::path path)
{
	SetPath(path);
}

FileSystemInfo::~FileSystemInfo() = default;

void FileSystemInfo::SetPath(fs::path path)
{
	#ifdef __linux__
	path = StringReplaceAll(path, "\\", "/");
	#endif
	#ifdef _WIN32
	path = StringReplaceAll(path, "/", "\\");
	#endif
	this->path = path.lexically_normal();
}

fs::path FileSystemInfo::GetPath()
{
	return path;
}

string FileSystemInfo::GetName()
{
	return this->path.filename();
}

bool FileSystemInfo::Exists()
{
	return fs::exists(path);
}

FileSystemInfo* FileSystemInfo::GetParent()
{
	bool hasParent = this->GetPath().has_relative_path();
	if(!hasParent)
	{
		return nullptr;
	}
	return new FileSystemInfo(this->GetPath().parent_path().string());
}

void FileSystemInfo::Move(fs::path newPath)
{
	fs::rename(this->GetPath(), newPath);
}

void FileSystemInfo::MoveTo(fs::path existingFolder)
{
	this->Move(existingFolder / this->GetName());
}

void FileSystemInfo::Rename(string newName)
{
	this->Move(this->GetParent()->GetPath() / newName);
}

void FileSystemInfo::Copy(fs::path newPath)
{
	fs::copy(this->GetPath(), newPath, fs::copy_options::recursive);
}

void FileSystemInfo::CopyTo(fs::path existingFolder)
{
	this->Copy(existingFolder / this->GetName());
}

void FileSystemInfo::Remove()
{
	fs::remove_all(this->GetPath());
}

bool FileSystemInfo::operator==(FileSystemInfo other)
{
	return this->GetPath() == other.GetPath();
}


FileInfo::FileInfo(fs::path path) : FileSystemInfo(path)
{
}


DirectoryInfo::DirectoryInfo(fs::path path) : FileSystemInfo(path)
{
}

vector<FileSystemInfo*> DirectoryInfo::GetChildren()
{
	vector<FileSystemInfo*> children;
	FileSystemInfo* child = nullptr;
	for(const fs::directory_entry& entry : fs::directory_iterator(this->GetPath()))
	{
		if(entry.is_directory())
		{
			child = new DirectoryInfo(entry.path());
		}
		else
		{
			child = new FileInfo(entry.path());
		}
		children.push_back(child);
	}
	return children;
}
