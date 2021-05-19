import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ItemComponent } from './pane/items-container/item/item.component';
import { ItemsContainerComponent } from './pane/items-container/items-container.component';
import { PaneComponent } from './pane/pane.component';
import { PathComponent } from './pane/path/path.component';
import { SearchComponent } from './pane/search/search.component';
import { SharedModule } from './shared/shared.module';




@NgModule({
  declarations: [
    AppComponent,
    PaneComponent,
    PathComponent,
    ItemComponent,
    SearchComponent,
    ItemsContainerComponent
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
