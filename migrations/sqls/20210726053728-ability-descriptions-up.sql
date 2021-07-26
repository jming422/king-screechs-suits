ALTER TABLE abilities ADD COLUMN description TEXT;

UPDATE abilities SET description = 'Draw 2 basic cards' WHERE ability_id = 1;
UPDATE abilities SET description = 'Randomly select a color card from the hand of the player of your choice' WHERE ability_id = 2;
UPDATE abilities SET description = 'Take 1 color card or 3 basic cards from the respective discard pile' WHERE ability_id = 3;
UPDATE abilities SET description = 'All players except you must discard a color card' WHERE ability_id = 4;
UPDATE abilities SET description = 'Activate Effect: As long as this card is in hand, you can hold 1 card above max' WHERE ability_id = 5;
UPDATE abilities SET description = 'Choose 1 player — that player must give you a color card of their choosing. They get dysentery' WHERE ability_id = 6;
UPDATE abilities SET description = 'Take 1 color card or 3 basic cards from the respective discard pile' WHERE ability_id = 7;

ALTER TABLE abilities ALTER COLUMN description SET NOT NULL;

ALTER TABLE games ALTER COLUMN state SET DEFAULT '{"buffs": {"players": {}}, "zones": {"pot": [], "draw": {"basic": [], "color": []}, "discard": {"basic": [], "color": []}, "players": {}}, "turnOrder": [], "playerStates": {}}'::jsonb;
