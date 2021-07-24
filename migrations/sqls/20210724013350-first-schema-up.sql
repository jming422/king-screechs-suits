ALTER TABLE games RENAME COLUMN id TO game_id;
ALTER TABLE games ADD COLUMN state JSONB;

CREATE TABLE players (
  player_id serial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE decks (
  deck_id serial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE cards (
  card_id serial PRIMARY KEY,
  name text NOT NULL,
  types text[] NOT NULL DEFAULT ARRAY[]::text[],
  in_search_of integer REFERENCES cards (card_id) ON DELETE SET NULL
);

CREATE TABLE abilities (
  ability_id serial PRIMARY KEY,
  name text NOT NULL,
  cost jsonb,
  effect jsonb
);

CREATE TABLE game_players (
  game_id integer REFERENCES games (game_id) ON DELETE CASCADE,
  player_id integer REFERENCES players (player_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, player_id)
);

CREATE TABLE game_decks (
  game_id integer REFERENCES games (game_id) ON DELETE CASCADE,
  deck_id integer REFERENCES decks (deck_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, deck_id)
);

CREATE TABLE deck_cards (
  deck_id integer REFERENCES decks (deck_id) ON DELETE CASCADE,
  card_id integer REFERENCES cards (card_id) ON DELETE CASCADE,
  PRIMARY KEY (deck_id, card_id)
);

CREATE TABLE card_abilities (
  card_id integer REFERENCES cards (card_id) ON DELETE CASCADE,
  ability_id integer REFERENCES abilities (ability_id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, ability_id)
);
