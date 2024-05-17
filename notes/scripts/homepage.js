
const note = document.getElementById('note');
const dropZone = document.getElementById('drop-zone');
card.addEventListener('dragstart', function(event) {
	console.log(event)
})
dropZone.addEventListener('dragover', function(event) {
	event.preventDefault()
})
dropZone.addEventListener('drop', function(event) {
	dropZone.prepend(note)
})
