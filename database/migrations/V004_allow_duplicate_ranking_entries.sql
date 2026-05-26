-- Permite que o mesmo jogador entre no ranking mais de uma vez na mesma sala.
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS uq_username_room;
