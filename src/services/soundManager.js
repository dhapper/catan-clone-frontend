import diceRollSound from "../assets/sounds/diceroll.mp3";
import pickupDiceSound from "../assets/sounds/dicepickup1.mp3";
import placeSound from "../assets/sounds/piecemove1.mp3";
import cardSound from "../assets/sounds/paperflip.mp3";
import startSound from "../assets/sounds/start.wav";
import achievementSound from "../assets/sounds/achievement.wav";
import buttonSound from "../assets/sounds/button.mp3";
import openSound from "../assets/sounds/open.mp3";
import closeSound from "../assets/sounds/close.mp3";

const sounds = {
    diceRoll: new Audio(diceRollSound),
    pickupDice: new Audio(pickupDiceSound),
    place: new Audio(placeSound),
    card: new Audio(cardSound),
    start: new Audio(startSound),
    achievement: new Audio(achievementSound),
    button: new Audio(buttonSound),
    open: new Audio(openSound),
    close: new Audio(closeSound)
};

export function playSound(soundName) {

    const sound = sounds[soundName];

    if (!sound) {
        return;
    }

    sound.currentTime = 0;
    sound.play();
}