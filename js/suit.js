
class Suit {
    static None = new Suit("none", 0);
    static Spade = new Suit("spade", 1);
    static Club = new Suit("club", 2);
    static Diamond = new Suit("diamond", 3);
    static Heart = new Suit("heart", 4);
    
    name = "";
    power = 0;
    constructor(name, power) {
        this.name = name;
        this.power = power;
    }
}
