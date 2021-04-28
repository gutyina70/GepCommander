import { Item } from "../models/item";
import { Pane } from "../models/pane";
import { ItemRenderer } from "./item_renderer";

export class PaneRenderer {
	public pane: Pane = new Pane();

	public itemRenderers: ItemRenderer[] = [];

	public container: JQuery;
	public get itemsContainer() {
		return this.container.children('.items');
	}
	public get searchBox() {
		return this.container.children('.search-box');
	}

	constructor(container: JQuery) {
		this.container = container;
	}

	public init() {
		this.container
			.on('keydown', e => this.onKeyDown(e))
			.on('keyup', e => this.onKeyUp(e))
			.on('click', e => this.onClick(e));
		this.render();
	}

	private onKeyDown(e: JQuery.KeyDownEvent): void {
		if (e.shiftKey) {
			this.handleMarking(e);
		}
		else {
			this.handleSelectionAndSearchBox(e);
		}
		this.updateSearchData();
		this.render();
	}

	private handleSelectionAndSearchBox(e: JQuery.KeyDownEvent) {
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
			case 'Escape':
				this.container.focus();
				this.searchBox.val('');
				break;
			case 'Enter':
				this.pane.openSelected();
				this.searchBox.val('');
				break;
			case 'Backspace':
				if (!this.searchBox.is(':focus')) {
					this.pane.goBack();
				}
				break;
			case 'ControlLeft':
			case 'ControlRight':
				break;
			default:
				this.searchBox.focus();
		}
	}

	private handleMarking(e: JQuery.KeyDownEvent) {
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

	private onKeyUp(e: JQuery.KeyUpEvent) {
		this.updateSearchData();
		this.render();
	}

	private updateSearchData() {
		this.pane.searchTerm = this.searchBox.val() as string;
	}

	private onClick(e: JQuery.ClickEvent) {
		if (e.ctrlKey) {
			this.pane.markSelected();
		}
		this.render();
	}


	public render() {
		this.pane.update();

		if (this.pane.shownItems.length === this.itemRenderers.length) {
			this.updateItemRenderers()
		}
		else {
			this.recreateItemRenderers();
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