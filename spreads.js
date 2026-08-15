// Each position is placed inside its spread's board as a percentage of the
// board's own width/height:
//   left: x%; top: y%; width: slotWidth%; aspect-ratio: 300 / 527;
//   transform: translate(-50%, -50%) rotate(rotation deg);
// so slotHeight% (relative to board height) works out to
//   slotWidth% * (527 / 300) * (board width / board height)
// Keep that in mind when adding new spreads so cards don't overlap.

const SPREADS = [
  {
    id: "one-card",
    name: "One Card",
    board: { aspect: "300/527", maxWidth: 260, slotWidth: 90 },
    positions: [{ id: "card", x: 50, y: 50, rotation: 0 }],
  },
  {
    id: "two-card",
    name: "Two Card",
    board: { aspect: "6/5", maxWidth: 360, slotWidth: 40 },
    positions: [
      { id: "card-1", x: 27, y: 50, rotation: 0 },
      { id: "card-2", x: 73, y: 50, rotation: 0 },
    ],
  },
  {
    id: "three-card",
    name: "Three Card",
    board: { aspect: "8/5", maxWidth: 520, slotWidth: 30 },
    positions: [
      { id: "card-1", x: 15, y: 50, rotation: 0 },
      { id: "card-2", x: 50, y: 50, rotation: 0 },
      { id: "card-3", x: 85, y: 50, rotation: 0 },
    ],
  },
  {
    id: "hexagram",
    name: "Hexagram",
    board: { aspect: "1/1", maxWidth: 520, slotWidth: 17 },
    positions: [
      { id: "card-1", x: 50, y: 18, rotation: 0 },
      { id: "card-2", x: 78, y: 34, rotation: 0 },
      { id: "card-3", x: 78, y: 66, rotation: 0 },
      { id: "card-4", x: 50, y: 82, rotation: 0 },
      { id: "card-5", x: 22, y: 66, rotation: 0 },
      { id: "card-6", x: 22, y: 34, rotation: 0 },
      { id: "card-7", x: 50, y: 50, rotation: 0, z: 2 },
    ],
  },
  {
    id: "horseshoe",
    name: "Horseshoe",
    board: { aspect: "1/1", maxWidth: 600, slotWidth: 14 },
    positions: [
      { id: "card-1", x: 7, y: 85, rotation: 0 },
      { id: "card-2", x: 17, y: 58, rotation: 0 },
      { id: "card-3", x: 33, y: 32, rotation: 0 },
      { id: "card-4", x: 50, y: 20, rotation: 0 },
      { id: "card-5", x: 67, y: 32, rotation: 0 },
      { id: "card-6", x: 83, y: 58, rotation: 0 },
      { id: "card-7", x: 93, y: 85, rotation: 0 },
    ],
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    board: { aspect: "7/9", maxWidth: 600, slotWidth: 16 },
    positions: [
      { id: "card-1", x: 39, y: 50, rotation: 0 },
      { id: "card-2", x: 39, y: 50, rotation: -90, z: 2 },
      { id: "card-3", x: 39, y: 74, rotation: 0 },
      { id: "card-4", x: 39, y: 26, rotation: 0 },
      { id: "card-5", x: 12, y: 50, rotation: 0 },
      { id: "card-6", x: 66, y: 50, rotation: 0 },
      { id: "card-7", x: 89, y: 86, rotation: 0 },
      { id: "card-8", x: 89, y: 62, rotation: 0 },
      { id: "card-9", x: 89, y: 38, rotation: 0 },
      { id: "card-10", x: 89, y: 14, rotation: 0 },
    ],
  },
];
