import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ItemComponent } from './panes-container/pane/items-container/item/item.component';
import { ItemsContainerComponent } from './panes-container/pane/items-container/items-container.component';
import { PaneComponent } from './panes-container/pane/pane.component';
import { PathComponent } from './panes-container/pane/path/path.component';
import { SearchComponent } from './panes-container/pane/search/search.component';
import { PanesContainerComponent } from './panes-container/panes-container.component';
import { SharedModule } from './shared/shared.module';
import { RenameComponent } from './panes-container/pane/items-container/item/rename/rename.component';




@NgModule({
  declarations: [
    AppComponent,
    PaneComponent,
    PathComponent,
    ItemComponent,
    SearchComponent,
    ItemsContainerComponent,
    PanesContainerComponent,
    RenameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
