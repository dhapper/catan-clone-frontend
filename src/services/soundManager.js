import diceRollSound from "../assets/sounds/diceroll.mp3";
import pickupDiceSound from "../assets/sounds/dicepickup1.mp3";
import placeSound from "../assets/sounds/piecemove1.mp3";
import cardSound from "../assets/sounds/paperflip.mp3";

const sounds = {
    diceRoll: new Audio(diceRollSound),
    pickupDice: new Audio(pickupDiceSound),
    place: new Audio(placeSound),
    card: new Audio(cardSound)
};

export function playSound(soundName) {
    const sound = sounds[soundName];

    if (!sound) {
        return;
    }

    sound.currentTime = 0;
    sound.play();
}