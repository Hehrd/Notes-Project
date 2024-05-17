
const note = document.getElementById('note');
const dropZone = document.getElementById('drop-zone');
note.addEventListener('dragstart', function(event) {
	console.log(event)
})
dropZone.addEventListener('dragover', function(event) {
	event.preventDefault()
})
dropZone.addEventListener('drop', function(event) {
	dropZone.prepend(note)
})
