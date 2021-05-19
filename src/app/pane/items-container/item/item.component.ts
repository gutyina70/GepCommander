import { Component, HostListener, Input } from '@angular/core';
import { Pane } from '../../pane';
import { Item } from './item';

@Component({
  selector: 'app-pane-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent
{
  @Input() item: Item;
  @Input() pane: Pane;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): boolean
  {
    this.pane.select(this.item);
    if(event.ctrlKey)
    {
      this.pane.mark(this.item);
    }
    return true;
  }

  @HostListener('dblclick')
  onDoubleClick(): boolean
  {
    this.pane.open(this.item);
    return true;
  }
}
