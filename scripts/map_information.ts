import * as Game from "./game.js";
import * as Message from "./message.js";
import * as MainMenu from "./main_menu.js";
import Map from "./map.js";

export interface MapInformationArgs {
    map: Map;
    playerNumber: number;
}

export default class MapInformation {
    tilesLeft_ui: HTMLSpanElement;
    pairsLeft_ui: HTMLSpanElement;
    score_ui: HTMLSpanElement;
    container_ui: HTMLDivElement;
    timesUpdateWasCalled: number;
    mapObject: Map;
    interval_f: number | undefined;

    constructor(args: MapInformationArgs) {
        let playerNumber = args.playerNumber;

        // add the html elements to the game menu
        var player = document.createElement("div");
        var tilesLeft = document.createElement("div");
        var pairsLeft = document.createElement("div");
        var score = document.createElement("div");
        var container = document.createElement("div");

        player.innerText = "Player " + playerNumber;
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

        this.tilesLeft_ui = tilesLeftValue;
        this.pairsLeft_ui = pairsLeftValue;
        this.score_ui = scoreValue;
        this.container_ui = container;
        this.timesUpdateWasCalled = 0;
        this.mapObject = args.map;

        this.updateScore(0);
    }

    startTimer() {
        var _this = this;

        this.interval_f = window.setInterval(function() {
            _this.mapObject.addTimerScore();
        }, 1000);
    }

    stopTimer() {
        window.clearInterval(this.interval_f);
        this.interval_f = undefined;
    }

    updateScore(score: number) {
        this.score_ui.innerText = score.toString();
    }

    updateTilesLeft() {
        var tilesLeft = this.mapObject.all_tiles.length;
        this.tilesLeft_ui.innerText = tilesLeft.toString();

        return tilesLeft;
    }

    updatePairsLeft() {
        var pairsLeft = this.mapObject.howManySelectablePairs();
        this.pairsLeft_ui.innerText = pairsLeft.toString();

        return pairsLeft;
    }

    update() {
        if (this.updateTilesLeft() <= 0) {
            Game.finished();
        } else {
            var pairsLeft = this.updatePairsLeft();

            if (pairsLeft <= 0) {
                this.timesUpdateWasCalled++;

                // we're in an endless recursion, due to not being possible to get a valid map with pairs left (after .shuffle() is called)
                // end the game
                if (this.timesUpdateWasCalled > 1) {
                    Message.show("No More Possible Plays");
                    Game.resetStuff();

                    window.setTimeout(function() {
                        Message.hide();
                        MainMenu.open();
                    }, 2500);

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
        mainContainer.removeChild(this.container_ui);
    }
}
