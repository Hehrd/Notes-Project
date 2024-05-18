document.addEventListener('DOMContentLoaded', function(event) {
	var xhr = new XMLHttpRequest();
	var url = "/loadnotes";

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.status === 200) {  // The server responded with a successful status
			console.log('Success:', xhr.responseText);
			var notes = JSON.parse(xhr.responseText)
			for (let i = 0; i < notes.length; i++) {
				sessionStorage.setItem('newNoteID', String(Number(currID) + 1))
				currID = sessionStorage.getItem('newNoteID')
				let noteID = notes[i].noteID
				let text = notes[i].note_text
				let type = notes[i].note_type
				generateLoadedNote(noteID, text, type)
			}
		} else {
			console.log('Error:', xhr.status, xhr.statusText);
		}
	}

		var username = sessionStorage.getItem('notes_username')
	xhr.send(JSON.stringify(username));
})



const newNotesContainer = document.getElementById('newNotes-container')
const generalZone = document.getElementById('drop-zone1');
const pendingZone = document.getElementById('drop-zone2');
const doneZone = document.getElementById('drop-zone3');
const originalNote = document.getElementById('note0')

let currID = sessionStorage.getItem('newNoteID')
let selectedNote

originalNote.addEventListener('dragstart', function(event) {
	selectedNote = originalNote
})

generalZone.addEventListener('dragover', function(event) {
	event.preventDefault()
})
pendingZone.addEventListener('dragover', function(event) {
	event.preventDefault()
})
doneZone.addEventListener('dragover', function(event) {
	event.preventDefault()
})
generalZone.addEventListener('drop', function(event) {
	let note = selectedNote
	sessionStorage.setItem('newNoteID', String(Number(currID) + 1))
	currID = sessionStorage.getItem('newNoteID')
	generalZone.prepend(note)
	let labelText = note.querySelector('label').textContent
	if (labelText === 'New note') {
		sendCreateNewNoteRequest(1, note);
		generateNewNote();
	} else {
		sendUpdateNoteRequest(JSON.parse(labelText), 1, note)
	}
})


pendingZone.addEventListener('drop', function(event) {
	let note = selectedNote
	sessionStorage.setItem('newNoteID', String(Number(currID) + 1))
	currID = sessionStorage.getItem('newNoteID')
	pendingZone.prepend(note)
	let labelText = note.querySelector('label').textContent
	if (labelText === 'New note') {
		 sendCreateNewNoteRequest(2, note);
		generateNewNote();
	} else {
		sendUpdateNoteRequest(JSON.parse(labelText), 2, note)
	}
})
doneZone.addEventListener('drop', function(event) {
	let note = selectedNote
	sessionStorage.setItem('newNoteID', String(Number(currID) + 1))
	currID = sessionStorage.getItem('newNoteID')
	doneZone.prepend(note)
	let labelText = note.querySelector('label').textContent
	if (labelText === 'New note') {
		sendCreateNewNoteRequest(3, note);
		generateNewNote();
	} else {
		sendUpdateNoteRequest(JSON.parse(labelText), 3, note)
	}
})
function sendCreateNewNoteRequest(typeId, note) {
	var xhr = new XMLHttpRequest();
	var url = "/createnote";

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.status === 201) {  // The server responded with a successful status
			console.log('Success:', xhr.responseText);
			note.querySelector('label').textContent = xhr.responseText
		} else {
			console.log('Error:', xhr.status, xhr.statusText);
		}
	}

	var data = {
		username: sessionStorage.getItem('notes_username'),
		type: typeId,
		text: note.querySelector('input').value
	};
	var jsonData = JSON.stringify(data)
	xhr.send(jsonData);
}

function sendUpdateNoteRequest(noteID, typeId, note) {
	var xhr = new XMLHttpRequest();
	var url = "/updatenote";

	xhr.open("PATCH", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.status === 200) {  // The server responded with a successful status
			console.log('Success:', xhr.responseText);
		} else {
			console.log('Error:', xhr.status, xhr.statusText);
		}
	}

	var data = {
		username: sessionStorage.getItem('notes_username'),
		noteID: noteID,
		type: typeId,
		text: note.querySelector('input').value
	};
	var jsonData = JSON.stringify(data)
	xhr.send(jsonData);
}

function generateNewNote() {
	let newNoteDiv = document.createElement('div')
	newNoteDiv.setAttribute('id', `note${currID}`)
	newNoteDiv.setAttribute('class', 'note')
	newNoteDiv.setAttribute('draggable', 'true')
	let newNoteLabel = document.createElement('label')
	let newNoteInput = document.createElement('input')
	newNoteDiv.appendChild(newNoteLabel)
	newNoteDiv.appendChild(newNoteInput)
	newNoteDiv.querySelector('label').textContent = 'New note'
	newNoteDiv.addEventListener('dragstart', function (event) {
		selectedNote = event.target
	})
	newNotesContainer.appendChild(newNoteDiv)
}

function generateLoadedNote(noteID, text, type) {
	let loadedNoteDiv = document.createElement('div')
	loadedNoteDiv.setAttribute('id', `note${currID}`)
	loadedNoteDiv.setAttribute('class', 'note')
	loadedNoteDiv.setAttribute('draggable', 'true')
	let loadedNoteLabel = document.createElement('label')
	let loadedNoteInput = document.createElement('input')
	loadedNoteDiv.appendChild(loadedNoteLabel)
	loadedNoteDiv.appendChild(loadedNoteInput)
	loadedNoteDiv.querySelector('label').textContent = String(noteID)
	loadedNoteDiv.querySelector('input').value = text
	loadedNoteDiv.addEventListener('dragstart', function (event) {
		selectedNote = event.target
	})
	if (type === 1) {
		generalZone.prepend(loadedNoteDiv)
	} else if (type === 2) {
		pendingZone.prepend(loadedNoteDiv)
	} else if (type === 3) {
		doneZone.prepend(loadedNoteDiv)
	}
}