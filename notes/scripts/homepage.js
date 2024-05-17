
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
	var xhr = new XMLHttpRequest();
	var url = "/createnote";
	var username = sessionStorage.getItem('notes_username')

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.status === 201) {  // The server responded with a successful status
			console.log('Success:', xhr.responseText);
			note.querySelector('label').textContent = xhr.statusText
		} else {
			console.log('Error:', xhr.status, xhr.statusText);
		}
	}

	var data = {
		username: sessionStorage.getItem('notes_username'),
		type: 1,
		text: note.querySelector('input').value
	};
	var jsonData = JSON.stringify(data)
	xhr.send(jsonData);
})
