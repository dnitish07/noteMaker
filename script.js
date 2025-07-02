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

  notes.forEach(function (note) {
    const div = document.createElement("div");
    div.className = "note";
    div.draggable = true;

    const textarea = document.createElement("textarea");
    textarea.value = note.content;
    textarea.oninput = function() {
      note.content = textarea.value;
      saveNotes();
    };

    div.ondblclick = function() {
      if (confirm("Delete this note?")) {
        notes = notes.filter(function(n) {
          return n.id !== note.id;
        });
        saveNotes();
        renderNotes();
      }
    };

    div.appendChild(textarea);
    container.prepend(div);
  });

  const addCard = document.createElement("div");
  addCard.className = "note add-note";
  addCard.textContent = "+";
  addCard.onclick = function() {
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

loadNotes();
renderNotes();