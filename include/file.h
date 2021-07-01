#pragma once
#include <iostream>
#include <filesystem>
#include "std_extension.h"
namespace fs = std::filesystem;

class FileSystemInfo
{
	private:
	fs::path path;

	public:
	FileSystemInfo(fs::path path);
	virtual ~FileSystemInfo();
	void SetPath(fs::path path);
	fs::path GetPath();
	string GetName();
	bool Exists();
	FileSystemInfo* GetParent();
	void Move(fs::path newPath);
	void MoveTo(fs::path existingFolder);
	void Rename(string newName);
	void Copy(fs::path newPath);
	void CopyTo(fs::path existingFolder);
	void Remove();
	bool operator==(FileSystemInfo other);
};

class FileInfo : public FileSystemInfo
{
	public:
	FileInfo(fs::path path);
};

class DirectoryInfo : public FileSystemInfo
{
	public:
	DirectoryInfo(fs::path path);
	vector<FileSystemInfo*> GetChildren();
};
