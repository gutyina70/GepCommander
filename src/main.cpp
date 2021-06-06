#include "main.h"
#include "pane.h"

MainFrame::MainFrame() : wxFrame(nullptr, wxID_ANY, "GepCommander")
{
  leftPane = new Pane(this);
  rightPane = new Pane(this);

  leftPane->SetBackgroundColour(wxSystemSettings::GetColour(wxSYS_COLOUR_BTNHIGHLIGHT));
  rightPane->SetBackgroundColour(wxSystemSettings::GetColour(wxSYS_COLOUR_BTNHIGHLIGHT));

  wxBoxSizer* panesSizerV = new wxBoxSizer(wxVERTICAL);
  wxBoxSizer* panesSizerH = new wxBoxSizer(wxHORIZONTAL);
  panesSizerH->Add(leftPane, 1, wxEXPAND | wxALL, 5);
  panesSizerH->Add(rightPane, 1, wxEXPAND | wxALL, 5);
  panesSizerV->Add(panesSizerH, 1, wxEXPAND | wxALL, 10);
  SetSizer(panesSizerV);
}

bool App::OnInit()
{
  MainFrame* window = new MainFrame();
  window->Show(true);
  return true;
};
