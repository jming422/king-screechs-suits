INSERT INTO decks (deck_id, name) VALUES (1, 'Base Game');
INSERT INTO decks (deck_id, name) VALUES (2, 'Expansion 1');
SELECT SETVAL('decks_deck_id_seq', 2);

INSERT INTO cards (card_id, name, types)
VALUES
  (1, 'King Screech', ARRAY['animal','charm']),
  (2, 'Rainforest Cafe', ARRAY['nature','magic']),
  (3, 'Enchanted Forest', ARRAY['nature','magic']),
  (4, 'Dolly', ARRAY['charm']);
SELECT SETVAL('cards_card_id_seq', 4);

UPDATE cards
SET in_search_of = card_id + CASE WHEN MOD(card_id, 2) = 0 THEN -1 ELSE 1 END;

INSERT INTO abilities (ability_id, name, cost, effect)
VALUES
  (1, 'Hee Hoo Peanut', '{"animal":1}'::jsonb, '{"type":"takeCards","count":2,"target":"basicDraw"}'::jsonb),
  (2, 'Totalitarian Dictator', '{"charm":3}'::jsonb, '{"type":"takeCards","count":1,"target":"player","random":true}'::jsonb),
  (3, 'Gift Shop', '{"magic":2}'::jsonb, '{"type":"choose","count":1,"choices":[{"type":"takeCards","count":1,"cardType":"color","target":"colorDiscard"},{"type":"takeCards","count":3,"cardType":"basic","target":"basicDiscard"}]}'::jsonb),
  (4, 'Birthday Party', '{"nature":3}'::jsonb, '{"type":"putCards","count":1,"cardType":"color","from":"otherPlayers","target":"colorDiscard"}'::jsonb),
  (5, 'Rooted', '{"nature":1}'::jsonb, '{"type":"applyBuff","buff":{"alter":"maxHandSize","by":1,"while":{"cardInHand": 3}}}'),
  (6, 'Poison Ivy', '{"nature":2,"magic":1}'::jsonb, '{"type":"putCards","count":1,"cardType":"color","from":"player","target":"ownHand"}'::jsonb),
  (7, 'Nostalgia', '{"charm":1}'::jsonb, '{"type":"choose","count":1,"choices":[{"type":"takeCard","count":3,"cardType":"basic","target":"basicDiscard"},{"type":"takeCard","count":1,"cardType":"color","target":"colorDiscard"}]}');
SELECT SETVAL('abilities_ability_id_seq', 7);

INSERT INTO card_abilities (card_id, ability_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (2, 4),
  (3, 5),
  (3, 6),
  (4, 7);


INSERT INTO deck_cards (deck_id, card_id)
SELECT 1, card_id FROM cards;
