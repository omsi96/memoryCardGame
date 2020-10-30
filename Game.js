class Card {
  constructor(type, number, id) {
    this.type = type;
    this.number = number;
    this.id = id;
    this.open = false;
  }
  imageName = () =>
    this.open
      ? `assets/Cards/${this.type}-${this.number}.png`
      : `assets/Cards/cardBack.png`;

  cardMatch = (card) => card.type == this.type && card.number == this.number;
}

function initCards() {
  let types = ["Cloves", "Diamond", "Heart", "Spade"];
  let numbers = ["K", "A"];
  let cards = [];
  let counter = 0;
  [1, 2].forEach((_) => {
    types.forEach((type) =>
      numbers.forEach((number) =>
        cards.push(new Card(type, number, `card${counter++}`))
      )
    );
  });

  console.log(cards);
  return cards;
}

function createComponent(c, b, i) {
  if (i) {
    return `<div  id='${i}' class=${c}>${b()} </div> `;
  } else {
    return `<div class=${c}>${b()}</div>`;
  }
}

function createCard(card) {
  return createComponent(
    "card",
    () => {
      return `<img src='${card.imageName()}' /> `;
    },
    card.id
  );
}

function openCard(id, open = true) {
  // Adding triggers
  $(document).ready(function () {
    let card = findCard(id);
    card.open = open;
    $(`#${id}`).html(`<img src=${card.imageName()} />`);
  });
}

function findCard(id) {
  return cards.find((card) => card.id == id);
}
function clickCard(id) {
  let card = findCard(id);
  if (!currentSelectedCard) {
    currentSelectedCard = card;
    openCard(id);
  } else {
    // should close first if not matching!
    if (card.cardMatch(currentSelectedCard)) {
      // They match!
      openCard(id);
      currentSelectedCard = undefined;
    } else {
      openCard(id);
      setTimeout(() => {
        // They don't match! close the previous one
        openCard(id, false);
        openCard(currentSelectedCard.id, false);
        currentSelectedCard = undefined;
      }, 2000);
    }
  }
  if (checkWin()) {
    clearInterval(interval);
    alert("YOU WIN!!!");
  } else {
    console.log(checkWin());
  }
  return card;
}

function checkWin() {
  return cards.reduce((acc, val) => acc && val.open, true);
}

let cards = initCards();
let currentSelectedCard = undefined;
function initialize() {
  cards.shuffle();

  let cardsComponents = cards.map((card, index) => createCard(card));
  console.log(cardsComponents);
  let quarters = [];
  while (cardsComponents.slice(4).length > 0) {
    quarters.push(cardsComponents.slice(0, 4));
    cardsComponents = cardsComponents.slice(4);
  }
  quarters.push([cardsComponents]);

  quarters = quarters.map((row) => createComponent("row", () => row));
  console.log("******", quarters);
  $("#container").html(quarters.join("").replaceAll(",", ""));

  $(".card").click(function () {
    let id = $(this).attr("id");
    clickCard(id);
  });
}
let seconds = 0;
let interval = setInterval(counter, 1000);
function counter() {
  seconds++;
  $("#counter").html(
    `${Math.floor(seconds / 60)}:${
      seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60
    }`
  );
}

initialize();
