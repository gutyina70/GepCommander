import { Item } from "../models/item";
import { Pane } from "../models/pane";
import { ItemRenderer } from "./item_renderer";

export class PaneRenderer {
	public pane: Pane = new Pane();

	public itemRenderers: ItemRenderer[] = [];

	public container: JQuery;
	public get itemsContainer() {
		return this.container.find('.items');
	}
	public get searchBox() {
		return this.container.find('.search-box');
	}
	public get pathBox() {
		return this.container.find('.path')
	}

	constructor(container: JQuery) {
		this.container = container;
	}

	public init() {
		this.container
			.on('keydown', e => this.onContainerKeyDown(e))
			.on('click', e => this.onContainerClick(e));
		this.pathBox
			.on('keydown', e => this.onPathBoxChanged(e))
			.on('keyup', e => this.onPathBoxChanged(e));
		this.searchBox
			.on('keydown', e => this.onSearchBoxChanged(e))
			.on('keyup', e => this.onSearchBoxChanged(e));
		this.render();
	}

	private onContainerKeyDown(e: JQuery.KeyboardEventBase) {
		if (e.ctrlKey && e.code == 'KeyL') {
			this.pathBox.focus();
			this.pathBox.select();
		}
		else if (e.shiftKey) {
			this.handleMarking(e);
		}
		else if (!e.shiftKey && !e.ctrlKey) {
			this.handleSelectionAndSearchBox(e);
		}

		this.render();
	}

	private handleMarking(e: JQuery.KeyboardEventBase) {
		switch (e.code) {
			case 'ArrowUp':
				this.pane.markPrev();
				break;
			case 'ArrowDown':
				this.pane.markNext();
				break;
			case 'Home':
				this.pane.markToFirst();
				break;
			case 'End':
				this.pane.markToLast();
				break;
		}
	}

	private handleSelectionAndSearchBox(e: JQuery.KeyboardEventBase) {
		switch (e.code) {
			case 'ArrowUp':
				this.pane.selectPrev();
				break;
			case 'ArrowDown':
				this.pane.selectNext();
				break;
			case 'Home':
				this.pane.selectFirst();
				break;
			case 'End':
				this.pane.selectLast();
				break;
			case 'Enter':
				this.searchBox.val('');
				this.updateSearchData();
				this.pane.openSelected();
				break;
			case 'Backspace':
				this.pane.goBack();
				break;
			default:
				this.searchBox.focus();
		}
	}

	private onPathBoxChanged(e: JQuery.KeyboardEventBase) {
		this.pane.tryGoTo(this.pathBox.val() as string);
		switch (e.code) {
			case 'Escape':
			case 'Enter':
				this.container.focus();
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				return;
		}
		this.pane.tryGoTo(this.pathBox.val() as string);
		this.render();
		e.stopPropagation();
	}

	private onSearchBoxChanged(e: JQuery.KeyboardEventBase) {
		this.pane.shouldUpdateRenderTree = true;
		switch (e.code) {
			case 'Escape':
				this.container.focus();
				this.searchBox.val('');
				break;
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Enter':
				return;
		}
		this.updateSearchData();
		this.render();
		e.stopPropagation();
	}

	private onContainerClick(e: JQuery.ClickEvent) {
		if (e.ctrlKey) {
			this.pane.markSelected();
		}
		this.render();
	}

	private updateSearchData() {
		this.pane.searchTerm = this.searchBox.val() as string;
	}

	public render() {
		this.pane.update();
		if (!this.pathBox.is(':focus')) {
			this.pathBox.val(this.pane.path.fullPath);
		}

		if (this.pane.shouldUpdateRenderTree) {
			this.pane.shouldUpdateRenderTree = false;
			this.recreateItemRenderers();
		}
		else {
			this.updateItemRenderers()
		}
	}

	private updateItemRenderers() {
		for (const renderer of this.itemRenderers) {
			renderer.updateElement();
		}
	}

	private recreateItemRenderers() {
		this.itemRenderers = [];
		this.itemsContainer.empty();

		for (const item of this.pane.shownItems) {
			const renderer = this.getItemElement(item);
			this.itemRenderers.push(renderer);
			this.itemsContainer.append(renderer.container);
		}
	}

	private getItemElement(item: Item) {
		return new ItemRenderer(item,
			this.getOpenAction(item),
			this.getSelectAction(item));
	}

	private getOpenAction(item: Item) {
		return () => {
			this.pane.open(item);
			this.pathBox.val(this.pane.path.fullPath);
			this.render();
		};
	}

	private getSelectAction(item: Item) {
		return () => {
			this.pane.select(item);
			this.render();
		};
	}
}

export const leftPane = new PaneRenderer($('#left-pane'));
export const rightPane = new PaneRenderer($('#right-pane'));