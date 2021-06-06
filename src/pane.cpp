#include "pane.h"

Pane::Pane(wxWindow* parent) : wxPanel(parent, wxID_ANY)
{
	path = new wxTextCtrl(this, wxID_ANY);
	files = new wxListBox(this, wxID_ANY);
	search = new wxTextCtrl(this, wxID_ANY);

	wxBoxSizer* sizerH = new wxBoxSizer(wxVERTICAL);
	sizerH->Add(path, 0, wxEXPAND | wxALL, 5);
	sizerH->Add(files, 1, wxEXPAND | wxALL, 5);
	sizerH->Add(search, 0, wxEXPAND | wxALL, 5);
	SetSizer(sizerH);
}
