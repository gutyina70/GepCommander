const fs = require('fs')
const { File, Directory } = require('./file')

$(function() {
    const base = new Directory('C:\\')

	const leftPane = $('#left-pane ul')
	const rightPane = $('#right-pane ul')

	goToPath(base, leftPane)
	goToPath(base, rightPane)
})

function renderItems(items, container)
{
	container.empty()

	items.forEach(item => {
		container.append(
			$('<li>').append(
				$('<button>')
				.html(item.path)
				.on('click', function()
				{
					goToPath(item, container)
				})
			)
		)
	})
}

function goToPath(parent, container)
{
	let items = parent.getChildren()
	try
	{
		items.unshift(parent.getParent())
	}
	catch(error)
	{
		console.log('failed to get parent of ' + parent.path)
	}
	renderItems(items, container)
}

