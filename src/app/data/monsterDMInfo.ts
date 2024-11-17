import {MonsterComponents} from './monsterComponents';

export const monsterDMInfo: MonsterComponents = {
    Abberation: [

    ],
    Beast: [

    ],
    Celestial: [
        { dc: 25, creatureComponent: ['soul'] },
    ],
    Construct: [
        { dc: 25, creatureComponent: ['lifespark'] },
    ],
    Dragon: [
        { dc: 25, creatureComponent: ['breath sac'] },
    ],
    Elementals: [
        { dc: 15, creatureComponent: ['volatile mote of air', 'volatile mote of earth', 'volatile mote of fire', 'volatile mote of water'] },
        { dc: 25, creatureComponent: ['core of air', 'core of earth', 'core of fire', 'core of water'] },
    ],
    Fey: [
        { dc: 25, creatureComponent: ['psyche'] },
    ],
    Fiend: [
        { dc: 25, creatureComponent: ['soul'] },
    ],
    Giant: [
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>'] },
    ],
    Undead: [
        { dc: 20, creatureComponent: ['undying heart<sup>E+</sup>'] },
    ],
};
