#pragma once
#include <iostream>
#include <vector>
using std::string;
using std::vector;

#define print(data) std::cout << (data) << std::endl
string StringReplace(string str, const string from, const string to);
string StringReplaceAll(string str, const string from, const string to);
vector<string> StringSplit(string str, const char delimeter);
vector<string> StringSplit(string str, const string delimeter);
