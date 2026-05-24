require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/login
// Recebe { username }, faz upsert e retorna o user
app.post('/api/login', async (req, res) => {
  const { username } = req.body;

  if (
    !username ||
    typeof username !== 'string' ||
    username.trim().length === 0
  ) {
    return res.status(400).json({ error: 'Username inválido' });
  }

  const name = username.trim().toLowerCase();

  try {
    const result = await pool.query(
      `INSERT INTO users (username)
       VALUES ($1)
       ON CONFLICT (username)
       DO UPDATE SET username = EXCLUDED.username
       RETURNING id, username, score, is_admin`,
      [name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// GET /api/ranking
// Retorna ranking dos usuários por score
app.get('/api/ranking', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, score
       FROM users
       ORDER BY score DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro no ranking:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// POST /api/score
// Atualiza score do usuário
app.post('/api/score', async (req, res) => {
  const { user_id, score } = req.body;

  if (!user_id || score === undefined) {
    return res
      .status(400)
      .json({ error: 'user_id e score são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET score = score + $1
       WHERE id = $2
       RETURNING id, username, score`,
      [score, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar score:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});