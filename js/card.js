
class Card {
    suit = Suit.None;
    numberName = 0;
    power = 0;
    imagePath = "";
    name = "";

    constructor(suit, numberName, name, power, imagePath) {
        this.suit = suit;
        this.numberName = numberName;
        this.power = power;
        this.name = name;
        this.imagePath = imagePath;
    }
}
