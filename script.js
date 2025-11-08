function saveNote() {
  const input = document.getElementById("noteInput").value;
  if (input.trim() === "") return;

  let notes = JSON.parse(localStorage.getItem("codeNotes")) || [];
  notes.push(input);
  localStorage.setItem("codeNotes", JSON.stringify(notes));
  document.getElementById("noteInput").value = "";
  displayNotes();
}

function displayNotes() {
  const notes = JSON.parse(localStorage.getItem("codeNotes")) || [];
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.textContent = note;
    notesList.appendChild(noteDiv);
  });
}

window.onload = displayNotes;

