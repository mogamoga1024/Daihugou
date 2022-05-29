
class Suit {
    static None = new Suit(0);
    static Spade = new Suit(1);
    static Club = new Suit(2);
    static Diamond = new Suit(3);
    static Heart = new Suit(4);
    
    power = 0;
    constructor(power) {
        this.power = power;
    }
}
