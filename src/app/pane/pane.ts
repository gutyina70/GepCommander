import { DirectoryInfo } from '../core/models/file';
import { BackItem, Item } from './items-container/item/item';

export class Pane
{
  public path: DirectoryInfo = DirectoryInfo.root;
  public items: Item[] = [];

  public get back(): BackItem | null
  {
    if(!this.path.parent)
    {
      return null;
    }
    return new BackItem(this.path.parent);
  }

  public get shownItems(): Item[]
  {
    return this.items.filter(item => item.shown);
  }

  public get selectedItem(): Item | null
  {
    const selecteds = this.items.filter(item => item.selected);
    if(selecteds)
    {
      return selecteds[0];
    }
    return null;
  }

  public get selectedIndex(): number
  {
    return this.shownItems.findIndex(item => item == this.selectedItem);
  }

  public constructor()
  {
    this.goTo(this.path);
  }

  public tryGoTo(path: DirectoryInfo): void
  {
    if(path.exists)
    {
      this.goTo(path);
    }
  }

  public goTo(path: DirectoryInfo): void
  {
    this.path = path;
    this.items = [];
    if(this.back)
    {
      this.items.push(this.back);
    }
    for(const child of this.path.children)
    {
      this.items.push(new Item(child));
    }
    this.updateSelection();
  }

  public goBack(): void
  {
    if(!this.back)
    {
      return;
    }
    const oldPath = this.path;
    this.goTo(this.back.info as DirectoryInfo);
    for(const item of this.items)
    {
      if(item.info.fullPath == oldPath.fullPath)
      {
        this.select(item);
        return;
      }
    }
  }

  public updateSelection(): void
  {
    if(!this.selectedItem)
    {
      this.selectFirst();
    }
  }

  public selectNext(): void
  {
    this.selectOffset(1);
  }

  public selectPrev(): void
  {
    this.selectOffset(-1);
  }

  public selectFirst(): void
  {
    if(this.shownItems.length)
    {
      this.select(this.shownItems[0]);
    }
  }

  public selectLast(): void
  {
    if(this.shownItems.length)
    {
      this.select(this.shownItems[this.shownItems.length - 1]);
    }
  }

  public selectOffset(offset: number): void
  {
    if(!this.shownItems.length)
    {
      return;
    }
    if(!this.selectedItem)
    {
      this.selectFirst();
    }

    const offsetIndex = (this.shownItems.length + this.selectedIndex + offset) % this.shownItems.length;
    this.select(this.shownItems[offsetIndex]);
  }

  public select(item: Item): void
  {
    this.clearSelections();
    item.selected = true;
  }

  public clearSelections(): void
  {
    for(const item of this.items)
    {
      item.selected = false;
    }
  }

  public markPrev(): void
  {
    this.markSelected();
    this.selectPrev();
  }

  public markNext(): void
  {
    this.markSelected();
    this.selectNext();
  }

  public markToFirst(): void
  {
    for(let i = 0; i <= this.selectedIndex; i++)
    {
      this.mark(this.shownItems[i]);
    }
    this.selectFirst();
  }

  public markToLast(): void
  {
    for(let i = this.selectedIndex; i < this.shownItems.length; i++)
    {
      this.mark(this.shownItems[i]);
    }
    this.selectLast();
  }

  public clearMarks(): void
  {
    for(const item of this.items)
    {
      item.marked = false;
    }
  }

  public markSelected(): void
  {
    if(this.selectedItem)
    {
      this.mark(this.selectedItem);
    }
  }

  public mark(item: Item): void
  {
    item.marked = !item.marked;
  }

  public open(item: Item): void
  {
    if(item.info instanceof DirectoryInfo)
    {
      if(item instanceof BackItem)
      {
        this.goBack();
      } else
      {
        this.goTo(item.info);
      }
    }
    else
    {
      item.startProcess();
    }
  }

  public openSelected(): void
  {
    if(this.selectedItem)
    {
      this.open(this.selectedItem);
    }
  }

  public updateItemsBySearch(searchTerm: string): void
  {
    const searchText = searchTerm.toLowerCase();
    for(const item of this.items)
    {
      const itemText = item.displayName.toLowerCase();
      item.shown = this.doesSearchMatch(itemText, searchText);
      if(!item.shown)
      {
        item.marked = false;
        item.selected = false;
      }
    }
    this.updateSelection();
  }

  private doesSearchMatch(item: string, filter: string)
  {
    if(!filter)
    {
      return true;
    }

    let j = 0;
    for(let i = 0; i < item.length; i++)
    {
      if(item[i] === filter[j])
      {
        j++;
      }
      if(j === filter.length)
      {
        return true;
      }
    }
    return false;
  }
}
