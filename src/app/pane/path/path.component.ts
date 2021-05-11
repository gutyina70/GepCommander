import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { KeyboardEventHandler } from '../../core/utils/keyboard_event_handler';
import { Pane } from '../pane';
import { DirectoryInfo } from './../../core/models/file';
import { PaneComponent } from './../pane.component';

@Component({
  selector: 'app-pane-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent
{
  @Input() paneComponent: PaneComponent;
  @Input() pane: Pane;

  @ViewChild('pathInput') pathElement: ElementRef;

  onInput(): void
  {
    const newPath = this.pathElement.nativeElement.value as string;
    const newPathAsDirectory = new DirectoryInfo(newPath);
    this.pane.tryGoTo(newPathAsDirectory);
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
          this.focusParent();
          return true;
        case 'Enter':
          this.focusParent();
          return false;
        case 'Escape':
        case 'Enter':
          return true;
        case 'ArrowUp':
        case 'ArrowDown':
          return false;
      }
      return true;
    }
    return false;
  }

  private focusParent(): void
  {
    this.paneComponent.focus();
  }

  public focus(): void
  {
    this.pathElement.nativeElement.focus();
  }
}
