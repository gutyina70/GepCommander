import { Component, Input } from '@angular/core';
import { Pane } from '../pane';
import { Item } from './item/item';

@Component({
  selector: 'app-pane-items-container',
  templateUrl: './items-container.component.html',
  styleUrls: ['./items-container.component.scss']
})
export class ItemsContainerComponent
{
  @Input() items: Item[];
  @Input() pane: Pane;
}
