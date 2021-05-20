import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { KeyboardEventHandler } from '../../../core/utils/keyboard_event_handler';
import { Pane } from '../pane';
import { PaneComponent } from '../pane.component';

@Component({
  selector: 'app-pane-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent
{
  @Input() paneComponent: PaneComponent;
  @Input() pane: Pane;

  @ViewChild('searchInput') searchElement: ElementRef;

  onInput(): void
  {
    const searchTerm = this.searchElement.nativeElement.value as string;
    this.pane.updateItemsBySearch(searchTerm);
  }

  catchKeys(event: KeyboardEvent): void
  {
    if(this.handleCatchKeys(event))
    {
      event.stopPropagation();
    }
  }

  private handleCatchKeys(event: KeyboardEvent): boolean
  {
    if(KeyboardEventHandler.handleTextboxNavigation(event)) return true;
    if(!event.ctrlKey && !event.shiftKey && !event.altKey)
    {
      switch(event.code)
      {
        case 'Escape':
          this.clearAndFocusPane();
          return true;
        case 'Enter':
          this.clearAndFocusPane();
          return false;
        case 'ArrowUp':
        case 'ArrowDown':
          return false;
      }
      return true;
    }
    return false;
  }

  private clearAndFocusPane()
  {
    this.clear();
    this.paneComponent.focus();
    this.pane.updateItemsBySearch(this.value);
  }

  public get value(): string
  {
    return this.searchElement.nativeElement.value;
  }

  public focus(): void
  {
    this.searchElement.nativeElement.focus();
  }

  public clear(): void
  {
    this.searchElement.nativeElement.value = '';
  }
}
