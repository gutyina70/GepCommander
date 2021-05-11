import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Pane } from './pane';
import { PathComponent } from './path/path.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.scss']
})
export class PaneComponent
{
  pane = new Pane();

  @Input() tabindex: number;

  @ViewChild('paneContainer') paneContainer: ElementRef;
  @ViewChild(PathComponent) pathComponent: PathComponent;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void
  {
    if(this.handleOnKeyDown(event))
    {
      event.stopPropagation();
    }
  }

  private handleOnKeyDown(event: KeyboardEvent): boolean
  {
    if(event.ctrlKey)
    {
      if(this.handleFocusingOnElements(event)) return true;
    }
    else if(event.shiftKey)
    {
      if(this.handleMarking(event)) return true;
    }
    else
    {
      if(this.handleNavigation(event)) return true;
      this.searchComponent.focus(); return true;
    }
    return false;
  }

  private handleFocusingOnElements(event: KeyboardEvent): boolean
  {
    switch(event.code)
    {
      case 'KeyL':
        this.pathComponent.focus();
        return true;
      case 'KeyF':
        this.searchComponent.focus();
        return true;
    }
    return false;
  }

  private handleMarking(event: KeyboardEvent): boolean
  {
    switch(event.code)
    {
      case 'ArrowUp':
        this.pane.markPrev();
        return true;
      case 'ArrowDown':
        this.pane.markNext();
        return true;
      case 'Home':
        this.pane.markToFirst();
        return true;
      case 'End':
        this.pane.markToLast();
        return true;
    }
    return false;
  }

  private handleNavigation(event: KeyboardEvent): boolean
  {
    switch(event.code)
    {
      case 'ArrowUp':
        this.pane.selectPrev();
        return true;
      case 'ArrowDown':
        this.pane.selectNext();
        return true;
      case 'Home':
        this.pane.selectFirst();
        return true;
      case 'End':
        this.pane.selectLast();
        return true;
      case 'Enter':
        this.pane.openSelected();
        return true;
      case 'Backspace':
        this.pane.goBack();
        return true;
    }
    return false;
  }

  public focus(): void
  {
    this.paneContainer.nativeElement.focus();
  }
}
