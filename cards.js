const MAJOR_ARCANA_FILES = [
  "00-TheFool.png",
  "01-TheMagician.png",
  "02-TheHighPriestess.png",
  "03-TheEmpress.png",
  "04-TheEmperor.png",
  "05-TheHierophant.png",
  "06-TheLovers.png",
  "07-TheChariot.png",
  "08-Strength.png",
  "09-TheHermit.png",
  "10-WheelOfFortune.png",
  "11-Justice.png",
  "12-TheHangedMan.png",
  "13-Death.png",
  "14-Temperance.png",
  "15-TheDevil.png",
  "16-TheTower.png",
  "17-TheStar.png",
  "18-TheMoon.png",
  "19-TheSun.png",
  "20-Judgement.png",
  "21-TheWorld.png",
];

const MINOR_SUITS = ["Cups", "Pentacles", "Swords", "Wands"];

const majorArcana = MAJOR_ARCANA_FILES.map((file) => ({ file, isMajor: true }));

const minorArcana = MINOR_SUITS.flatMap((suit) =>
  Array.from({ length: 14 }, (_, i) => ({
    file: `${suit}${String(i + 1).padStart(2, "0")}.png`,
    isMajor: false,
    suit,
  }))
);

const allCards = [...majorArcana, ...minorArcana];

function cardLabel(card) {
  const name = card.file.replace(/\.png$/, "").replace(/^\d+-/, "");
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2");
}
