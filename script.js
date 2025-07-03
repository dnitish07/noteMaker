let notes = [];

function saveNotesToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromStorage() {
  let saved = localStorage.getItem("notes");
  if (saved) {
    notes = JSON.parse(saved);
  }
}

function createNote(content = "", pinned = false, color = "#ffffff") {
  return {
    id: Date.now(),
    content,
    pinned,
    color
  };
}

function deleteNoteById(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotesToStorage();
  renderNotes();
}

function togglePin(note) {
  note.pinned = !note.pinned;
  saveNotesToStorage();
  renderNotes();
}

function changeNoteColor(note, color, div) {
  note.color = color;
  div.style.backgroundColor = color + "40";
  saveNotesToStorage();
}

function updateNoteContent(note, newContent) {
  note.content = newContent;
  saveNotesToStorage();
}

function renderNotes() {
  let container = document.getElementById("notes-container");
  container.innerHTML = "";

  let searchValue = document.getElementById("search-input")?.value.toLowerCase() || "";

  notes
    .filter(note => note.content.toLowerCase().includes(searchValue))
    .sort((a, b) => b.pinned - a.pinned)
    .forEach(note => {
      let div = document.createElement("div");
      div.className = "note";
      div.draggable = true;
      div.dataset.id = note.id;

      let pin = document.createElement("div");
      pin.innerHTML = note.pinned
        ? '<img src="https://cdn1.iconfinder.com/data/icons/material-design-icons-light/24/pin-off-512.png" class="pin" style="height: 20px; width: 20px;" />'
        : '<img src="https://cdn4.iconfinder.com/data/icons/common-ui-bold/96/09_Pushpin-512.png" class="unpin" style="height: 20px; width: 20px;" />';
      pin.style.position = "absolute";
      pin.style.top = "8px";
      pin.style.right = "10px";
      pin.style.cursor = "pointer";
      pin.onclick = function (e) {
        e.stopPropagation();
        togglePin(note);
      };

      let textarea = document.createElement("textarea");
      textarea.value = note.content;
      textarea.oninput = () => updateNoteContent(note, textarea.value);

      div.ondblclick = () => {
        if (confirm("Delete this note?")) {
          deleteNoteById(note.id);
        }
      };

      let colorOptions = ["#ffadad", "#ffd6a5", "#caffbf"];
      let colorContainer = document.createElement("div");
      colorContainer.className = "color-options";

      colorOptions.forEach(color => {
        let colorBtn = document.createElement("button");
        Object.assign(colorBtn.style, {
          backgroundColor: color,
          border: "none",
          width: "20px",
          height: "20px",
          margin: "2px",
          borderRadius: "50%",
          cursor: "pointer"
        });
        colorBtn.onclick = () => changeNoteColor(note, color, div);
        colorContainer.appendChild(colorBtn);
      });

      if (note.color) {
        div.style.backgroundColor = note.color + "40";
      }

      div.appendChild(colorContainer);
      div.appendChild(pin);
      div.appendChild(textarea);
      container.appendChild(div);
    });

  let addCard = document.createElement("div");
  addCard.className = "note add-note";
  addCard.textContent = "+";
  addCard.onclick = () => {
    notes.unshift(createNote());
    saveNotesToStorage();
    renderNotes();
  };
  container.appendChild(addCard);
}

function setupThemeToggle() {
  let toggleBtn = document.getElementById("toggle-theme");
  toggleBtn.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

function setupDragAndDrop() {
  document.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("note")) {
      e.dataTransfer.setData("text/plain", e.target.dataset.id);
    }
  });

  document.getElementById("notes-container").addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  document.getElementById("notes-container").addEventListener("drop", function (e) {
    e.preventDefault();
    let id = e.dataTransfer.getData("text/plain");
    let fromIndex = notes.findIndex(n => n.id == id);
    let toNote = e.target.closest(".note");
    let toIndex = [...document.querySelectorAll(".note")].indexOf(toNote);

    if (fromIndex > -1 && toIndex > -1) {
      let [moved] = notes.splice(fromIndex, 1);
      notes.splice(toIndex, 0, moved);
      saveNotesToStorage();
      renderNotes();
    }
  });
}

document.getElementById("search-input").addEventListener("input", renderNotes);
loadNotesFromStorage();
setupThemeToggle();
setupDragAndDrop();
renderNotes();