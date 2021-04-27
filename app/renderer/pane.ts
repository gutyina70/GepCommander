import { exec } from "child_process";
import { DirectoryInfo, FileSystemInfo } from "../models/file";

export class Pane {

	private visibleItems: FileSystemInfo[] = [];

	public path: DirectoryInfo = new DirectoryInfo('C://');
	public get back() {
		return this.path.parent;
	}
	public get items() {
		return this.path.children;
	}

	public container: JQuery;
	public get itemsContainer() {
		return this.container.children('ul');
	}
	public get searchBox() {
		return this.container.children('.search-box');
	}

	constructor(container: JQuery) {
		this.container = container;
	}

	public init() {
		this.goToPath(this.path)
		this.container.on('keydown', ev => {
			this.searchBox.focus();
			if (ev.code == 'Escape') {
				this.searchBox.val('');
			}
			this.renderItems()
		});
	}

	public renderItems() {
		this.visibleItems = this.filterItems(this.items);
		this.itemsContainer.empty();
		this.itemsContainer.append(this.createBackItem());

		for (const item of this.visibleItems) {
			this.itemsContainer.append(this.createNormalItem(item));
		}
	}

	private filterItems(items: FileSystemInfo[]) {
		const searchText = this.searchBox.val()?.toString().toLowerCase() as string;
		return items.filter(item => {
			return this.searchMatch(item.name.toLowerCase(), searchText)
		})
	}

	private searchMatch(item: string, filter: string) {
		if (filter.length === 0) {
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

	private createBackItem() {
		return this.createItem(this.back, '..', () => this.goToPath(this.back));
	}

	private createNormalItem(item: FileSystemInfo) {
		return this.createItem(item, item.name, this.getToDoForInfo(item))
	}

	private getToDoForInfo(item: FileSystemInfo) {
		if (item instanceof DirectoryInfo) {
			return () => this.goToPath(item as DirectoryInfo)
		}
		else {
			return () => exec(`start "" "${item.fullPath}"`);
		}
	}

	private createItem(item: FileSystemInfo, displayName: string, openAction: CallableFunction) {
		return $('<li>').append(
			$('<img>')
				.attr('src', item instanceof DirectoryInfo ? './images/folder.png' : './images/file.png')
				.addClass('icon'),
			$('<button>')
				.html(displayName)
				.attr('tabindex', '-1')
				.on('click', () => openAction())
		);
	}

	public goToPath(path: DirectoryInfo) {
		this.path = path;
		this.renderItems();
	}

}

export const leftPane = new Pane($('#left-pane'));
export const rightPane = new Pane($('#right-pane'));