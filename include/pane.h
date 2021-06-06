#pragma once
#include <wx/wx.h>

class Pane : public wxPanel
{
	private:
	wxTextCtrl* path;
	wxListBox* files;
	wxTextCtrl* search;

	public:
	Pane(wxWindow* parent);
};
