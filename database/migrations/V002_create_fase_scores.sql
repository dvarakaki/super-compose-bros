CREATE TABLE IF NOT EXISTS fase_scores (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fase         SMALLINT NOT NULL,
    score        SMALLINT NOT NULL,
    total        SMALLINT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_fase UNIQUE (user_id, fase)
);