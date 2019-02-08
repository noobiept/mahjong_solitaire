import * as Game from "./game.js";
import * as Message from "./message.js";

export interface MapInformationArgs {
    playerNumber: number;
    addTimerScore: () => void;
}

export default class MapInformation {
    private args: MapInformationArgs;
    private tilesLeft: HTMLSpanElement;
    private pairsLeft: HTMLSpanElement;
    private score: HTMLSpanElement;
    private container: HTMLDivElement;
    private timesUpdateWasCalled: number;
    private interval: number | undefined;

    constructor(args: MapInformationArgs) {
        // add the html elements to the game menu
        var player = document.createElement("div");
        var tilesLeft = document.createElement("div");
        var pairsLeft = document.createElement("div");
        var score = document.createElement("div");
        var container = document.createElement("div");

        player.innerText = "Player " + args.playerNumber;
        tilesLeft.innerText = "Tiles Left: ";
        pairsLeft.innerText = "Pairs Left: ";
        score.innerText = "Score: ";

        var tilesLeftValue = document.createElement("span");
        var pairsLeftValue = document.createElement("span");
        var scoreValue = document.createElement("span");

        tilesLeft.appendChild(tilesLeftValue);
        pairsLeft.appendChild(pairsLeftValue);
        score.appendChild(scoreValue);

        container.className = "GameMenu-infoContainer";
        player.className = "MapInformation-playerNumber";
        tilesLeft.className = "MapInformation-tilesLeft";
        pairsLeft.className = "MapInformation-pairsLeft";
        score.className = "MapInformation-timer";

        container.appendChild(player);
        container.appendChild(tilesLeft);
        container.appendChild(pairsLeft);
        container.appendChild(score);

        var mainContainer = document.getElementById("GameMenu-MapInformation")!;

        mainContainer.appendChild(container);

        this.tilesLeft = tilesLeftValue;
        this.pairsLeft = pairsLeftValue;
        this.score = scoreValue;
        this.container = container;
        this.timesUpdateWasCalled = 0;
        this.args = args;

        this.updateScore(0);
    }

    startTimer() {
        this.interval = window.setInterval(() => {
            this.args.addTimerScore();
        }, 1000);
    }

    stopTimer() {
        window.clearInterval(this.interval);
        this.interval = undefined;
    }

    resetTimesUpdateWasCalled() {
        this.timesUpdateWasCalled = 0;
    }

    updateScore(score: number) {
        this.score.innerText = score.toString();
    }

    updateTilesLeft(tilesLeft: number) {
        this.tilesLeft.innerText = tilesLeft.toString();
    }

    updatePairsLeft(pairsLeft: number) {
        this.pairsLeft.innerText = pairsLeft.toString();
    }

    update(tilesLeft: number, pairsLeft: number) {
        this.updateTilesLeft(tilesLeft);

        if (tilesLeft <= 0) {
            Game.finished();
        } else {
            this.updatePairsLeft(pairsLeft);

            if (pairsLeft <= 0) {
                this.timesUpdateWasCalled++;

                // we're in an endless recursion, due to not being possible to get a valid map with pairs left (after .shuffle() is called)
                // end the game
                if (this.timesUpdateWasCalled > 1) {
                    Game.quit("No More Possible Plays");
                    return;
                }

                Game.getActiveMap().shuffle(false);
                Message.show("No More Pairs Left (shuffling)", 1000);
                Game.updateInformation();
            }
        }
    }

    clear() {
        this.stopTimer();

        var mainContainer = document.getElementById("GameMenu-MapInformation")!;
        mainContainer.removeChild(this.container);
    }
}
