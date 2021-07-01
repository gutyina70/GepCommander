#include "std_extension.h"

string StringReplace(string str, const string from, const string to)
{
	size_t startPos = str.find(from);
	if(startPos != std::string::npos)
	{
		str.replace(startPos, from.length(), to);
	}
	return str;
}

string StringReplaceAll(string str, const string from, const string to)
{
	string newStr;
	while((newStr = StringReplace(str, from, to)) != str)
	{
		str = newStr;
	}
	return str;
}

vector<string> StringSplit(string str, const char delimeter)
{
	return StringSplit(str, string(1, delimeter));
}

vector<string> StringSplit(string str, const string delimeter)
{
	vector<string> tokens;
	size_t pos;
	string token;
	while((pos = str.find(delimeter)) != string::npos)
	{
		token = str.substr(0, pos);
		tokens.push_back(token);
		str.erase(0, pos + delimeter.length());
	}
	tokens.push_back(str);
	return tokens;
}
