
class RuleConfig {
    #useJoker = true;
    get useJoker() {
        return this.#useJoker;
    }

    static default = new RuleConfig(false);

    constructor(useJoker) {
        this.#useJoker = useJoker;
    }
}

const EnvConfig = {
    currentSpeed: 500,
    normalSpeed: 1000,
    highSpeed: 500,
    superHighSpeed: 100
};
