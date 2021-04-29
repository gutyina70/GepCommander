import { DirectoryInfo } from "./file";
import { BackItem, Item } from "./item";

export class Pane {
	private static defaultDirectory: DirectoryInfo = new DirectoryInfo('C:/');

	private _back: BackItem = new BackItem(Pane.defaultDirectory);

	public path: DirectoryInfo = Pane.defaultDirectory;
	public items: Item[] = [];
	public get back() {
		this._back.info = this.path.parent;
		return this._back;
	}
	public get shownItems() {
		return this.items.filter(item => item.shown);
	}
	public get selectedItem() {
		const selecteds = this.items.filter(item => item.selected);
		if (selecteds) {
			return selecteds[0];
		}
		return null;
	}
	public get selectedIndex() {
		return this.shownItems.findIndex(item => item == this.selectedItem);
	}

	public shouldUpdateRenderTree = true;
	public searchTerm: string = '';

	public constructor() {
		this.goTo(this.path);
	}

	public tryGoTo(path: string) {
		const dirPath = new DirectoryInfo(path);
		if (dirPath.exists) {
			this.goTo(dirPath);
		}
	}

	public goTo(path: DirectoryInfo) {
		this.shouldUpdateRenderTree = true;
		this.path = path;
		this.items = [this.back];
		for (const child of this.path.children) {
			this.items.push(new Item(child));
		}
	}

	public goBack() {
		const oldPath = this.path;
		this.goTo(this.back.info as DirectoryInfo);
		for (const item of this.items) {
			if (item.info.fullPath == oldPath.fullPath) {
				this.select(item);
				return;
			}
		}
	}

	public update() {
		this.hideBySearch();
		if (!this.selectedItem) {
			this.selectFirst();
		}
	}

	public selectNext() {
		this.selectOffset(1);
	}

	public selectPrev() {
		this.selectOffset(-1);
	}

	public selectFirst() {
		if (this.shownItems.length) {
			this.select(this.shownItems[0]);
		}
	}

	public selectLast() {
		if (this.shownItems.length) {
			this.select(this.shownItems[this.shownItems.length - 1])
		}
	}

	public selectOffset(offset: number) {
		if (!this.shownItems.length) {
			return;
		}
		if (!this.selectedItem) {
			this.selectFirst();
		}

		const offsetIndex = (this.shownItems.length + this.selectedIndex + offset) % this.shownItems.length;
		this.select(this.shownItems[offsetIndex]);
	}

	public select(item: Item) {
		this.clearSelections();
		item.selected = true;
	}

	public clearSelections() {
		for (const item of this.items) {
			item.selected = false;
		}
	}

	public markPrev() {
		this.markSelected();
		this.selectPrev();
	}

	public markNext() {
		this.markSelected();
		this.selectNext();
	}

	public markToFirst() {
		for (let i = 0; i <= this.selectedIndex; i++) {
			this.mark(this.shownItems[i]);
		}
		this.selectFirst();
	}

	public markToLast() {
		for (let i = this.selectedIndex; i < this.shownItems.length; i++) {
			this.mark(this.shownItems[i]);
		}
		this.selectLast();
	}

	public clearMarks() {
		for (const item of this.items) {
			item.marked = false;
		}
	}

	public markSelected() {
		if (this.selectedItem) {
			this.mark(this.selectedItem);
		}
	}

	public mark(item: Item) {
		item.marked = !item.marked;
	}

	public open(item: Item) {
		if (item.info instanceof DirectoryInfo) {
			this.goTo(item.info as DirectoryInfo);
		}
		else {
			item.startProcess();
		}
	}

	public openSelected() {
		if (this.selectedItem) {
			this.open(this.selectedItem)
		}
	}

	private hideBySearch() {
		const searchText = this.searchTerm.toLowerCase();
		for (const item of this.items) {
			const itemText = item.displayName.toLowerCase();
			item.shown = this.doesSearchMatch(itemText, searchText);
			if (!item.shown) {
				item.marked = false;
				item.selected = false;
			}
		}
	}

	private doesSearchMatch(item: string, filter: string) {
		if (!filter) {
			return true;
		}

		let j = 0;
		for (let i = 0; i < item.length; i++) {
			if (item[i] === filter[j]) {
				j++;
			}
			if (j === filter.length) {
				return true;
			}
		}
		return false;
	}
}