const spreadSelect = document.getElementById("spread-select");
const spreadBoard = document.getElementById("spread-board");
const reversedToggle = document.getElementById("reversed-toggle");
const randomizeBtn = document.getElementById("randomize-btn");
const clearBtn = document.getElementById("clear-btn");
const pickerModal = document.getElementById("picker-modal");
const pickerGrid = document.getElementById("picker-grid");
const pickerClose = document.getElementById("picker-close");
const statusRegion = document.getElementById("status-region");
const modeSwitch = document.querySelector(".mode-switch");
const cardViewer = document.getElementById("card-viewer");
const viewerImage = document.getElementById("viewer-image");
const viewerClose = document.getElementById("viewer-close");

const state = {
  spreadId: SPREADS[0].id,
  mode: "edit", // "edit" | "preview"
  allowReversed: true,
  assignments: {}, // positionId -> { file, reversed }
  activePositionId: null,
  triggerEl: null,
};

const PICKER_SECTIONS = [
  { title: "Major Arcana", cards: majorArcana },
  ...MINOR_SUITS.map((suit) => ({
    title: suit,
    cards: minorArcana.filter((card) => card.suit === suit),
  })),
];

function currentSpread() {
  return SPREADS.find((spread) => spread.id === state.spreadId);
}

function announce(message) {
  statusRegion.textContent = message;
}

function renderSpreadOptions() {
  for (const spread of SPREADS) {
    const option = document.createElement("option");
    option.value = spread.id;
    option.textContent = spread.name;
    spreadSelect.appendChild(option);
  }
  spreadSelect.value = state.spreadId;
}

function buildSlot(position, board, index) {
  const slot = document.createElement("div");
  slot.className = "spread-slot";
  slot.dataset.positionId = position.id;
  slot.style.setProperty("--x", `${position.x}%`);
  slot.style.setProperty("--y", `${position.y}%`);
  slot.style.setProperty("--slot-w", `${board.slotWidth}%`);
  slot.style.setProperty("--rot", `${position.rotation || 0}deg`);
  slot.style.setProperty("--z", `${position.z || 1}`);

  const face = document.createElement("button");
  face.type = "button";
  face.className = "slot-face";
  face.dataset.action = "change";

  const img = document.createElement("img");
  img.className = "card-image";
  img.src = "images/CardBacks.png";
  img.alt = "";
  face.appendChild(img);
  slot.appendChild(face);

  const controls = document.createElement("div");
  controls.className = "slot-controls";

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "slot-btn";
  clearButton.dataset.action = "clear";
  clearButton.setAttribute("aria-label", `Clear card ${index}`);
  clearButton.textContent = "×";
  clearButton.hidden = true;
  controls.appendChild(clearButton);

  const reverseButton = document.createElement("button");
  reverseButton.type = "button";
  reverseButton.className = "slot-btn";
  reverseButton.dataset.action = "reverse";
  reverseButton.setAttribute("aria-label", `Toggle reversed for card ${index}`);
  reverseButton.textContent = "↻";
  reverseButton.hidden = true;
  controls.appendChild(reverseButton);

  slot.appendChild(controls);

  return slot;
}

function renderBoard() {
  const spread = currentSpread();
  state.assignments = {};
  spreadBoard.style.setProperty("--board-aspect", spread.board.aspect);
  spreadBoard.style.setProperty("--board-max-width", `${spread.board.maxWidth}px`);
  spreadBoard.innerHTML = "";
  spread.positions.forEach((position, i) => {
    spreadBoard.appendChild(buildSlot(position, spread.board, i + 1));
  });
  for (const position of spread.positions) {
    renderSlot(position.id);
  }
}

function renderSlot(positionId) {
  const spread = currentSpread();
  const index = spread.positions.findIndex((p) => p.id === positionId) + 1;
  const slot = spreadBoard.querySelector(`.spread-slot[data-position-id="${positionId}"]`);
  if (!slot || index === 0) return;

  const assignment = state.assignments[positionId];
  const face = slot.querySelector(".slot-face");
  const img = slot.querySelector(".card-image");
  const clearButton = slot.querySelector('[data-action="clear"]');
  const reverseButton = slot.querySelector('[data-action="reverse"]');

  const editable = state.mode === "edit";

  if (assignment) {
    const label = cardLabel({ file: assignment.file });
    const orientation = assignment.reversed ? "reversed" : "upright";
    slot.classList.add("filled");
    img.src = `images/${assignment.file}`;
    img.alt = label;
    img.classList.toggle("reversed", assignment.reversed);
    face.setAttribute(
      "aria-label",
      `Card ${index}: ${label}, ${orientation}. Press to ${editable ? "change" : "enlarge"}.`
    );
    clearButton.hidden = !editable;
    reverseButton.hidden = !editable || !state.allowReversed;
  } else {
    slot.classList.remove("filled");
    img.src = "images/CardBacks.png";
    img.alt = "";
    img.classList.remove("reversed");
    face.setAttribute(
      "aria-label",
      editable
        ? `Card ${index}: empty. Choose a card.`
        : `Card ${index}: empty. Press to enlarge.`
    );
    clearButton.hidden = true;
    reverseButton.hidden = true;
  }
}

function renderAllSlots() {
  for (const position of currentSpread().positions) {
    renderSlot(position.id);
  }
}

function setMode(mode) {
  state.mode = mode;
  document.body.classList.toggle("mode-preview", mode === "preview");
  for (const button of modeSwitch.querySelectorAll(".mode-btn")) {
    button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
  }
  renderAllSlots();
  announce(mode === "preview" ? "Preview mode." : "Edit mode.");
}

function usedFiles(excludePositionId) {
  const used = new Set();
  for (const [positionId, assignment] of Object.entries(state.assignments)) {
    if (positionId === excludePositionId) continue;
    used.add(assignment.file);
  }
  return used;
}

function buildThumb(card, positionId, used, currentFile) {
  const label = cardLabel(card);

  const thumb = document.createElement("button");
  thumb.type = "button";
  thumb.className = "card-thumb";
  thumb.setAttribute("aria-label", label);
  thumb.disabled = used.has(card.file);
  thumb.classList.toggle("current", card.file === currentFile);
  thumb.addEventListener("click", () => {
    state.assignments[positionId] = { file: card.file, reversed: false };
    closePicker();
    renderSlot(positionId);
  });

  const img = document.createElement("img");
  img.className = "card-image";
  img.src = `images/${card.file}`;
  img.alt = label;
  img.loading = "lazy";

  thumb.appendChild(img);
  return thumb;
}

function openPicker(positionId) {
  state.activePositionId = positionId;
  state.triggerEl = document.activeElement;

  const used = usedFiles(positionId);
  const currentFile = state.assignments[positionId]?.file;

  pickerGrid.innerHTML = "";
  for (const section of PICKER_SECTIONS) {
    const sectionEl = document.createElement("section");
    sectionEl.className = "card-section";

    const heading = document.createElement("h3");
    heading.className = "card-section-title";
    heading.textContent = section.title;
    sectionEl.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "card-grid";
    for (const card of section.cards) {
      grid.appendChild(buildThumb(card, positionId, used, currentFile));
    }
    sectionEl.appendChild(grid);

    pickerGrid.appendChild(sectionEl);
  }

  pickerModal.hidden = false;
  pickerClose.focus();
}

function closePicker() {
  pickerModal.hidden = true;
  state.activePositionId = null;
  if (state.triggerEl) {
    state.triggerEl.focus();
    state.triggerEl = null;
  }
}

function openViewer(positionId) {
  const assignment = state.assignments[positionId];
  state.triggerEl = document.activeElement;

  viewerImage.src = assignment ? `images/${assignment.file}` : "images/CardBacks.png";
  viewerImage.alt = assignment ? cardLabel({ file: assignment.file }) : "";
  viewerImage.classList.remove("reversed");

  cardViewer.hidden = false;
  viewerClose.focus();
}

function closeViewer() {
  cardViewer.hidden = true;
  if (state.triggerEl) {
    state.triggerEl.focus();
    state.triggerEl = null;
  }
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomize() {
  const spread = currentSpread();
  const shuffled = shuffle(allCards);
  spread.positions.forEach((position, i) => {
    const card = shuffled[i];
    const reversed = state.allowReversed && Math.random() < 0.5;
    state.assignments[position.id] = { file: card.file, reversed };
  });
  renderAllSlots();
  announce(`Filled ${spread.positions.length} card${spread.positions.length === 1 ? "" : "s"} at random.`);
}

function clearAll() {
  state.assignments = {};
  renderAllSlots();
  announce("All positions cleared.");
}

modeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest(".mode-btn");
  if (!button || button.dataset.mode === state.mode) return;
  setMode(button.dataset.mode);
});

spreadSelect.addEventListener("change", () => {
  state.spreadId = spreadSelect.value;
  renderBoard();
});

reversedToggle.addEventListener("change", () => {
  state.allowReversed = reversedToggle.checked;
  if (!state.allowReversed) {
    for (const assignment of Object.values(state.assignments)) {
      assignment.reversed = false;
    }
  }
  renderAllSlots();
});

randomizeBtn.addEventListener("click", randomize);
clearBtn.addEventListener("click", clearAll);

spreadBoard.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const slot = actionEl.closest(".spread-slot");
  if (!slot) return;

  const positionId = slot.dataset.positionId;
  const action = actionEl.dataset.action;

  if (state.mode === "preview") {
    if (action === "change") {
      openViewer(positionId);
    }
    return;
  }

  if (action === "change") {
    openPicker(positionId);
  } else if (action === "clear") {
    delete state.assignments[positionId];
    renderSlot(positionId);
  } else if (action === "reverse") {
    const assignment = state.assignments[positionId];
    if (assignment) {
      assignment.reversed = !assignment.reversed;
      renderSlot(positionId);
    }
  }
});

pickerClose.addEventListener("click", closePicker);

pickerModal.addEventListener("click", (event) => {
  if (event.target === pickerModal) {
    closePicker();
  }
});

cardViewer.addEventListener("click", closeViewer);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!pickerModal.hidden) {
    closePicker();
  } else if (!cardViewer.hidden) {
    closeViewer();
  }
});

renderSpreadOptions();
renderBoard();
