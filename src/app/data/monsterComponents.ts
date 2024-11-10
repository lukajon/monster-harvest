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
    Beast: [
        { dc: 5, creatureComponent: ['antenna', 'eye', 'flesh', 'phial of blood'] },
        { dc: 10, creatureComponent: ['antler', 'beak', 'bone', 'egg', 'fat', 'fin', 'horn', 'pincer', 'pouch of claws', 'pouch of teeth', 'talon', 'tusk'] },
        { dc: 15, creatureComponent: ['heart', 'liver', 'poison gland', 'pouch of feathers', 'pouch of scales', 'stinger', 'tentacle'] },
        { dc: 20, creatureComponent: ['chitin', 'pelt'] },
    ],
    Celestial: [
        { dc: 5, creatureComponent: ['eye', 'flesh', 'phial of blood', 'pouch of dust'] },
        { dc: 10, creatureComponent: ['bone', 'horn', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart', 'fat', 'liver', 'poison gland', 'pouch of feathers', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['brain', 'skin'] },
        { dc: 25, creatureComponent: ['soul'] },
    ],
    Fiend: [
        { dc: 5, creatureComponent: ['eye', 'flesh', 'phial of blood', 'pouch of dust'] },
        { dc: 10, creatureComponent: ['bone', 'horn', 'pouch of teeth'] },
        { dc: 15, creatureComponent: ['heart', 'fat', 'liver', 'poison gland', 'pouch of feathers', 'pouch of scales'] },
        { dc: 20, creatureComponent: ['brain', 'skin'] },
        { dc: 25, creatureComponent: ['soul'] },
    ],
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
