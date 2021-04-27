import { DirectoryInfo, FileSystemInfo } from "../models/file";

$(function () {
	const base = new DirectoryInfo('C:\\');

	const leftPane = $('#left-pane ul');
	const rightPane = $('#right-pane ul');

	goToPath(base, leftPane);
	goToPath(base, rightPane);
})

function renderItems(back: DirectoryInfo, children: FileSystemInfo[], container: JQuery) {
	container.empty();

	container.append(createItem(back, '..', () => goToPath(back, container)));
	for (const item of children) {
		container.append(
			createItem(item, item.getName(), () => goToPath(item as DirectoryInfo, container))
		);
	}
}

function createItem(item: FileSystemInfo, displayName: string, goToDestination: CallableFunction) {
	return $('<li>').append(
		$('<img>')
			.attr('src', item instanceof DirectoryInfo ? './images/folder.png' : './images/file.png')
			.addClass('icon'),
		$('<button>')
			.html(displayName)
			.on('click', () => goToDestination())
	);
}

function goToPath(parent: DirectoryInfo, container: JQuery) {
	let items = parent.getChildren();
	renderItems(parent.getParent(), items, container);
}
