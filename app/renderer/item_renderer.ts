import { DirectoryInfo } from "../models/file";
import { Item } from "../models/item";

export class ItemRenderer {
	public item: Item;
	public onOpen: () => void;
	public onSelect: () => void;

	public container: JQuery;

	constructor(item: Item, onOpen: () => void, onSelect: () => void) {
		this.item = item;
		this.onOpen = onOpen;
		this.onSelect = onSelect;
		this.container = this.generateElement();
		this.updateElement();
	}

	private generateElement() {
		return $('<tr>')
			.append(
				$('<td>').append(
					$('<img>')
						.addClass('icon')
				),
				$('<td>').append(
					$('<span>')
				)
			)
			.on('click', this.onSelect)
			.on('dblclick', this.onOpen);
	}

	public updateElement() {
		const iconPath = this.item.info instanceof DirectoryInfo ?
			'./images/folder.png' : './images/file.png';
		this.container.find('td img').attr('src', iconPath);
		this.container.find('td span').html(this.item.displayName);
		this.container
			.attr('is-selected', this.item.selected ? 'true' : 'false')
			.attr('is-marked', this.item.marked ? 'true' : 'false');
	}
}