-- Adiciona suporte a salas na tabela de usuários.
-- Um mesmo username pode existir em salas diferentes,
-- então o UNIQUE passa a ser (username, room).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS room VARCHAR(50) NOT NULL DEFAULT 'default';

-- Remove a constraint antiga de username único global
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_username_key;

-- Nova constraint: username único dentro de cada sala
ALTER TABLE users
  ADD CONSTRAINT uq_username_room UNIQUE (username, room);
