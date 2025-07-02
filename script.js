let notes = [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const saved = localStorage.getItem("notes");
  if (saved) {
    notes = JSON.parse(saved);
  }
}

function renderNotes() {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  // Render each note
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.draggable = true;

    const textarea = document.createElement("textarea");
    textarea.value = note.content;
    textarea.oninput = () => {
      note.content = textarea.value;
      saveNotes();
    };

    div.ondblclick = () => {
      if (confirm("Delete this note?")) {
        notes = notes.filter((n) => n.id !== note.id);
        saveNotes();
        renderNotes();
      }
    };

    div.appendChild(textarea);
    container.prepend(div);
  });

  // Add the big '+' card at end
  const addCard = document.createElement("div");
  addCard.className = "note add-note";
  addCard.textContent = "+";
  addCard.onclick = () => {
    const newNote = {
      id: Date.now(),
      content: "",
    };
    notes.unshift(newNote);
    saveNotes();
    renderNotes();
  };
  container.appendChild(addCard);
}

// Initialize app
loadNotes();
renderNotes();