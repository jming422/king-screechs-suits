/* eslint-disable no-unused-vars */

const types = [{ animal: '♣', nature: '♠', charm: '♥', magic: '♦' }];

const example = {
  id: 1,
  name: 'King Screech',
  types: new Set(['nature', 'magic', 'charm', 'animal']),
  iso: 2,
  abilities: [
    {
      name: 'Hee Hoo Peanut',
      cost: { animal: 1 },
      effect: `some effect DSL I haven't invented yet`,
    },
  ],
};

// Abilities
// The ability 'Draw 2 basic cards, then discard 1 color card' can be represented as:
const abilityExample = [
  { type: 'takeCards', count: 2, target: 'basicDraw' },
  { type: 'putCards', count: 1, cardType: 'color', target: 'colorDiscard' },
];
// All possible options:
const allAbilityOptions = {
  type: [
    'applyBuff', // must target one or more Players
    'takeCards', // must target one Zone
    'putCards', // must target one Zone
    'viewCards', // must target one Zone
    'showCards', // must be from one Zone and must target one or more Players
    'block', // no targets
    'endTurn', // no targets
    'choose', // must target one or more Abilities
  ],
  count: 1, // optional
  buff: {}, // required for applyBuff, not valid for other types
  target: 'zone or player', // optional
  from: 'zone or player', // required for showCards, optional otherwise
  cardType: 'color or basic', // optional, only valid for *Cards abilities
  random: false, // optional
  choices: [{ type: 'more actions here' }], // required for choose, not valid for other types
};
