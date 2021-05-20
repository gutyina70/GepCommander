import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-panes-container',
  templateUrl: './panes-container.component.html',
  styleUrls: ['./panes-container.component.scss']
})
export class PanesContainerComponent
{
  @ViewChild('leftPane') leftPane: ElementRef;
  @ViewChild('rightPane') rightPane: ElementRef;
}
