export interface MonsterComponentEntry {
    dc: number;
    creatureComponent: string[];
}

export interface MonsterComponents {
    [key: string]: MonsterComponentEntry[];
}

export interface MonsterComponent {
    dc: number;
    type: string;
    component: string;
    id: string;
    active: boolean;
}

export const monsterComponents: MonsterComponents = {
    Aberration: [
        { dc: 5, creatureComponent: ['antenna', 'eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>', 'egg<sup>E</sup>', 'fat<sup>E+</sup>', 'pouch of claws', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart<sup>E</sup>', 'phial of mucus', 'liver<sup>E</sup>', 'stinger', 'tentacle'] },
        { dc: 20, creatureComponent: ['brain<sup>E+</sup>', 'chitin', 'hide', 'main eye'] },
    ],
    Beast: [
        { dc: 5, creatureComponent: ['antenna<sup>E+</sup>', 'eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['antler', 'beak', 'bone<sup>E+</sup>', 'egg<sup>E</sup>', 'fat<sup>E+</sup>', 'fin', 'horn', 'pincer', 'pouch of claws', 'pouch of teeth', 'talon', 'tusk'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'liver<sup>E+</sup>', 'poison gland', 'pouch of feathers', 'pouch of scales', 'stinger', 'tentacle'] },
        { dc: 20, creatureComponent: ['chitin', 'pelt'] },
    ],
    Celestial: [
        { dc: 5, creatureComponent: ['eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>', 'pouch of dust<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E</sup>', 'fat<sup>E+</sup>', 'horn', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'liver<sup>E</sup>', 'pouch of feathers', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['brain<sup>E</sup>', 'skin'] },
        { dc: 25, creatureComponent: ['soul'] },
    ],
    Construct: [
        { dc: 5, creatureComponent: ['phial of blood<sup>E+</sup>', 'phial of oil<sup>E+</sup>', 'phial of sap<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['flesh<sup>E+</sup>', 'metal plating', 'stone'] },
        { dc: 15, creatureComponent: ['bone<sup>E+</sup>', 'heart<sup>E</sup>', 'liver<sup>E</sup>', 'gears'] },
        { dc: 20, creatureComponent: ['brain<sup>E+</sup>', 'instructions'] },
        { dc: 25, creatureComponent: ['lifespark'] },
    ],
    Dragon: [
        { dc: 5, creatureComponent: ['eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>', 'egg<sup>E</sup>', 'fat<sup>E+</sup>', 'pouch of claws', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['horn', 'liver<sup>E</sup>', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['heart<sup>E+</sup>'] },
        { dc: 25, creatureComponent: ['breath sac'] },
    ],
    Elemental: [
        { dc: 5, creatureComponent: ['eye<sup>E+</sup>', 'primordial dust<sup>E</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>'] },
        { dc: 15, creatureComponent: ['volatile mote of air', 'volatile mote of earth', 'volatile mote of fire', 'volatile mote of water'] },
        { dc: 25, creatureComponent: ['core of air', 'core of earth', 'core of fire', 'core of water'] },
    ],
    Fey: [
        { dc: 5, creatureComponent: ['antenna<sup>E+</sup>', 'eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['antler', 'beak', 'bone<sup>E+</sup>', 'egg<sup>E</sup>', 'horn', 'pouch of claws', 'pouch of teeth', 'talon', 'tusk'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'fat<sup>E+</sup>', 'liver<sup>E+</sup>', 'poison gland', 'pouch of feathers', 'pouch of scales', 'tentacle', 'tongue'] },
        { dc: 20, creatureComponent: ['brain<sup>E</sup>', 'skin', 'pelt'] },
        { dc: 25, creatureComponent: ['psyche'] },
    ],
    Fiend: [
        { dc: 5, creatureComponent: ['eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>', 'pouch of dust<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>', 'horn', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'fat<sup>E+</sup>', 'liver<sup>E</sup>', 'poison gland', 'pouch of feathers', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['brain<sup>E</sup>', 'skin'] },
        { dc: 25, creatureComponent: ['soul'] },
    ],
    Giant: [
        { dc: 5, creatureComponent: ['flesh<sup>E</sup>', 'nail', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>', 'fat<sup>E+</sup>', 'tooth'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'liver<sup>E+</sup>'] },
        { dc: 20, creatureComponent: ['skin'] },
    ],
    Humanoid: [
        { dc: 5, creatureComponent: ['eye', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['bone<sup>E+</sup>', 'egg<sup>E</sup>', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'liver<sup>E+</sup>', 'pouch of feathers', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['brain<sup>E+</sup>', 'skin'] },
    ],
    Monstrosity: [
        { dc: 5, creatureComponent: ['antenna<sup>E+</sup>', 'eye<sup>E+</sup>', 'flesh<sup>E</sup>', 'phial of blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['antler', 'beak', 'bone<sup>E+</sup>', 'egg<sup>E</sup>', 'fat<sup>E+</sup>', 'fin', 'horn', 'pincer', 'pouch of claws', 'pouch of teeth', 'talon', 'tusk'] },
        { dc: 15, creatureComponent: ['heart<sup>E+</sup>', 'liver<sup>E+</sup>', 'poison gland', 'pouch of feathers', 'pouch of scales', 'stinger', 'tentacle'] },
        { dc: 20, creatureComponent: ['chitin', 'pelt'] },
    ],
    Ooze: [
        { dc: 5, creatureComponent: ['phial of acid<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['phial of mucus<sup>E+</sup>'] },
        { dc: 15, creatureComponent: ['vesicle<sup>E+</sup>'] },
        { dc: 20, creatureComponent: ['membrane'] },
    ],
    Plant: [
        { dc: 5, creatureComponent: ['phial of sap<sup>E+</sup>', 'tuber<sup>E</sup>'] },
        { dc: 10, creatureComponent: ['bundle of roots<sup>E+</sup>', 'phial of wax<sup>E+</sup>', 'pouch of hyphae<sup>E+</sup>'] },
        { dc: 15, creatureComponent: ['poison gland<sup>E+</sup>', 'pouch of pollen<sup>E+</sup>', 'pouch of spores<sup>E+</sup>'] },
        { dc: 20, creatureComponent: ['bark<sup>E+</sup>', 'fungal membrane<sup>E+</sup>'] },
    ],
    Undead: [
        { dc: 5, creatureComponent: ['eye<sup>E+</sup>', 'bone<sup>E+</sup>', 'phial of congealed blood<sup>E+</sup>'] },
        { dc: 10, creatureComponent: ['marrow', 'pouch of teeth', 'rancid fat<sup>E</sup>'] },
        { dc: 15, creatureComponent: ['ethereal ichor<sup>E+</sup>', 'undying flesh<sup>E+</sup>'] },
        { dc: 20, creatureComponent: ['undying heart<sup>E+</sup>'] },
    ]
};

function flattenMonsterData(type: keyof MonsterComponents): MonsterComponent[] {
    return (
        monsterComponents[type]?.flatMap((entry) =>
            entry.creatureComponent.map((component) => ({
                dc: entry.dc,
                type: type.toString(),
                component: component,
                id: `${type}-${entry.dc}-${component}`, // Unique ID based on type, DC, and part
                active: false,
            }))
        ) || []
    );
}
