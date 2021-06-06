#pragma once
#include <wx/wx.h>
#include "pane.h"

class MainFrame : public wxFrame
{
	private:
	Pane* leftPane;
	Pane* rightPane;

	public:
	MainFrame();
};

class App : public wxApp
{
	public:
	virtual bool OnInit();
};

wxIMPLEMENT_APP(App);
