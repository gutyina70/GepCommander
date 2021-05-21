import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { KeyboardEventHandler } from '../../../../../core/utils/keyboard_event_handler';
import { Pane } from '../../../pane';
import { Item } from '../item';
import { PaneComponent } from './../../../pane.component';

@Component({
  selector: 'app-pane-item-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss']
})
export class RenameComponent implements AfterViewInit
{
  @Input() item: Item;
  @Input() pane: Pane;
  @Input() paneComponent: PaneComponent;

  @ViewChild('renameInput') renameInput: ElementRef;

  ngAfterViewInit(): void
  {
    this.renameInput.nativeElement.focus();
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
          this.item.renaming = false;
          this.focusParent();
          return true;
        case 'Enter':
          this.item.renaming = false;
          this.rename();
          this.pane.refresh();
          return true;
      }
      return true;
    }
    return false;
  }

  private rename()
  {
    this.item.info.rename(this.renameInput.nativeElement.value);
  }

  private focusParent(): void
  {
    this.paneComponent.focus();
  }
}
