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

// seafarers

export const SEAFARERS_MAPS = {
    HEADING_FOR_NEW_SHORES: {
        id: "HEADING_FOR_NEW_SHORES",
        name: "Heading for New Shores"
    },

    THE_FOUR_ISLANDS_I: {
        id: "THE_FOUR_ISLANDS_I",
        name: "The Four Islands I"
    },

    THE_FOUR_ISLANDS_II: {
        id: "THE_FOUR_ISLANDS_II",
        name: "The Four Islands II"
    },
    
    THE_SIX_ISLANDS: {
        id: "THE_SIX_ISLANDS",
        name: "The Six Islands"
    },

    GOO_LAGOON: {
        id: "GOO_LAGOON",
        name: "Goo Lagoon",
    }
};