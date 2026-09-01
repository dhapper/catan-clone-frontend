export const GAME_PHASES = Object.freeze({
    LOBBY: "lobby",
    SETUP: "setup",
    GAMEPLAY: "gameplay"
});

export const SETUP_SUBPHASES = Object.freeze({
    ROLL_FOR_TURN_ORDER: "roll_for_turn_order",
    PLACING_SETTLEMENT: "placing_settlement",
    PLACING_ROAD: "placing_road"
});

export const GAMEPLAY_SUBPHASES = Object.freeze({
    PRODUCTION: "production",
    ACTION: "action",
    DISCARDING: "discarding",
    ROBBER_PLACEMENT: "robber_placement"
});

export const STRUCTURES = Object.freeze({
    ROAD: "road",
    SETTLEMENT: "settlement",
    CITY: "city"
});

export const SPECIAL_VICTORY_POINTS = Object.freeze({
    LARGEST_ARMY: "largest_army",
    LONGEST_ROAD: "longest_road"
});