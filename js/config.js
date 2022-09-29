
class Config {
    #useJoker = true;
    get useJoker() {
        return this.#useJoker;
    }

    static default = new Config(false);

    constructor(useJoker) {
        this.#useJoker = useJoker;
    }
}
