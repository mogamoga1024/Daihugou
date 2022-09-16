
class GameManagerMock extends GameManager {
    static vm = {};
    static playerList = [];
    static init(playerList) {
        this.vm.isRevolution = false;
        this.playerList = playerList;
    }
}
