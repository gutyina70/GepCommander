import { DirectoryInfo, FileSystemInfo } from "../models/file";

$(function () {
	const base = new DirectoryInfo('C:\\');

	const leftPane = $('#left-pane ul');
	const rightPane = $('#right-pane ul');

	goToPath(base, leftPane);
	goToPath(base, rightPane);
})

function renderItems(items: FileSystemInfo[], container: JQuery) {
	container.empty();

	for (const item of items) {
		container.append(
			$('<li>').append(
				$('<button>')
					.html(item.fullPath)
					.on('click', function () {
						goToPath(item as DirectoryInfo, container)
					})
			)
		);
	}
}

function goToPath(parent: DirectoryInfo, container: JQuery) {
	let items = parent.getChildren();
	try {
		items.unshift(parent.getParent());
	}
	catch (error) {
		console.log('failed to get parent of ' + parent.fullPath);
	}
	renderItems(items, container);
}
