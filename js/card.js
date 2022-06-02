
class Card {
    suit = Suit.None;
    numberName = 0;
    power = 0;
    imagePath = "";
    name = "";
    isSelected = false;

    _canSelect = true;
    get canSelect() {
        return this._canSelect;
    }
    set canSelect(val) {
        this._canSelect = val;
        if (val) {
            this.imagePath = this.imagePath.replace("_disabled.png", ".png");
        }
        else {
            this.imagePath = this.imagePath.replace(".png", "_disabled.png");
        }
    }

    constructor(suit, numberName, name, power, imagePath) {
        this.suit = suit;
        this.numberName = numberName;
        this.power = power;
        this.name = name;
        this.imagePath = imagePath;
    }
}
