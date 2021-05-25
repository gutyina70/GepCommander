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
  @Input() otherPane: PaneComponent;

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
      if(this.handleFileOperations(event)) return true;
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
  private handleFileOperations(event: KeyboardEvent): boolean
  {
    switch(event.code)
    {
      case 'F2':
        this.pane.selectedItem.renaming = true;
        return true;
      case 'F5':
        this.copy();
        this.pane.refresh();
        this.otherPane.pane.refresh();
        return true;
      case 'F6':
        this.move();
        this.pane.refresh();
        this.otherPane.pane.refresh();
        return true;
      case 'Delete':
        this.delete();
        this.pane.refresh();
        return true;
    }
    return false;
  }

  private copy(): void
  {
    if(this.pane.markedItems.length)
    {
      for(const item of this.pane.markedItems)
      {
        item.info.copyTo(this.otherPane.pane.path);
      }
    }
    else
    {
      this.pane.selectedItem.info.copyTo(this.otherPane.pane.path);
    }
  }

  private move(): void
  {
    if(this.pane.markedItems.length)
    {
      for(const item of this.pane.markedItems)
      {
        item.info.moveTo(this.otherPane.pane.path);
      }
    }
    else
    {
      this.pane.selectedItem.info.moveTo(this.otherPane.pane.path);
    }
  }

  private delete(): void
  {
    if(this.pane.markedItems.length)
    {
      for(const item of this.pane.markedItems)
      {
        item.info.delete();
      }
    }
    else
    {
      this.pane.selectedItem.info.delete();
    }
  }

  public focus(): void
  {
    this.paneContainer.nativeElement.focus();
  }
}
