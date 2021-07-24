ALTER TABLE games RENAME COLUMN game_id TO id;
ALTER TABLE games DROP COLUMN state;

DROP TABLE players;
DROP TABLE decks;
DROP TABLE cards;
DROP TABLE abilities;
DROP TABLE game_players;
DROP TABLE game_decks;
DROP TABLE deck_cards;
DROP TABLE card_abilities;
