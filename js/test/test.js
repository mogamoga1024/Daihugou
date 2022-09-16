
let cpu = null;

module("CPUのAIのテスト", {
    setup() {
        cpu = new Cpu("CPU");
    }
});

// memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

test("カードの分割 single", function() {
    cpu.cardList = CardFactory.createCardList("s3, c4, d5, h6");

    cpu._cardDivision();

    strictEqual(cpu._singleHandList.length, 4);
    strictEqual(Common.cardListToString(cpu._singleHandList[0]), "s3");
    strictEqual(Common.cardListToString(cpu._singleHandList[1]), "c4");
    strictEqual(Common.cardListToString(cpu._singleHandList[2]), "d5");
    strictEqual(Common.cardListToString(cpu._singleHandList[3]), "h6");
    strictEqual(cpu._multiHandList.length, 0);
    strictEqual(cpu._stairsHandList.length, 0);
});

test("カードの分割 single", function() {
    cpu.cardList = CardFactory.createCardList("s3, s4");;

    cpu._cardDivision();

    strictEqual(cpu._singleHandList.length, 2);
    strictEqual(Common.cardListToString(cpu._singleHandList[0]), "s3");
    strictEqual(Common.cardListToString(cpu._singleHandList[1]), "s4");
    strictEqual(cpu._multiHandList.length, 0);
    strictEqual(cpu._stairsHandList.length, 0);
});

test("カードの分割 multi", function() {
    cpu.cardList = CardFactory.createCardList("s4, c4, sJ, dJ, hJ");

    cpu._cardDivision();

    strictEqual(cpu._singleHandList.length, 0);
    strictEqual(cpu._multiHandList.length, 2);
    strictEqual(Common.cardListToString(cpu._multiHandList[0]), "s4, c4");
    strictEqual(Common.cardListToString(cpu._multiHandList[1]), "sJ, dJ, hJ");
    strictEqual(cpu._stairsHandList.length, 0);
});

test("カードの分割 stairs", function() {
    cpu.cardList = CardFactory.createCardList("s4, s5, s6, dJ, dQ, dK, d1");

    cpu._cardDivision();

    strictEqual(cpu._singleHandList.length, 0);
    strictEqual(cpu._multiHandList.length, 0);
    strictEqual(cpu._stairsHandList.length, 2);
    strictEqual(Common.cardListToString(cpu._stairsHandList[0]), "s4, s5, s6");
    strictEqual(Common.cardListToString(cpu._stairsHandList[1]), "dJ, dQ, dK, d1");
});

// memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

test("カードの分割 複合", function() {
    cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, c6, d6, h6, d7, d8, sJ, cJ, h2");

    cpu._cardDivision();

    strictEqual(cpu._singleHandList.length, 3);
    strictEqual(Common.cardListToString(cpu._singleHandList[0]), "d7");
    strictEqual(Common.cardListToString(cpu._singleHandList[1]), "d8");
    strictEqual(Common.cardListToString(cpu._singleHandList[2]), "h2");
    strictEqual(cpu._multiHandList.length, 2);
    strictEqual(Common.cardListToString(cpu._multiHandList[0]), "s6, c6, d6, h6");
    strictEqual(Common.cardListToString(cpu._multiHandList[1]), "sJ, cJ");
    strictEqual(cpu._stairsHandList.length, 1);
    strictEqual(Common.cardListToString(cpu._stairsHandList[0]), "s3, s4, s5");
});

test("最強のカードの強さ", function() {
    cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, s7, s8, s9, sT, sJ, sQ, sK, s1, s2, Joker1, Joker2");
    const joker1Power = CardFactory.createCard("Joker1").power;

    cpu.cardList.filter(c => c.name === "Joker1").forEach(c => c.isDead = true);

    strictEqual(cpu._strongestCardPower, joker1Power);
});

test("最強のカードの強さ", function() {
    cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, s7, s8, s9, sT, sJ, sQ, sK, s1, s2, Joker1, Joker2");
    const s2Power = CardFactory.createCard("s2").power;

    cpu.cardList.filter(c => c.name === "Joker1" || c.name === "Joker2").forEach(c => c.isDead = true);

    strictEqual(cpu._strongestCardPower, s2Power);
});
