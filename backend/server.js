require('dotenv').config();

const path = require('path');
const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// Serve o frontend (raiz do projeto, um nível acima de /backend)
app.use(express.static(path.join(__dirname, '..')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/login
// Recebe { username, room }, faz upsert e retorna o user
app.post('/api/login', async (req, res) => {
  const { username, room } = req.body;

  if (
    !username ||
    typeof username !== 'string' ||
    username.trim().length === 0
  ) {
    return res.status(400).json({ error: 'Username inválido' });
  }

  if (
    !room ||
    typeof room !== 'string' ||
    room.trim().length === 0
  ) {
    return res.status(400).json({ error: 'Código da sala inválido' });
  }

  const name = username.trim().toLowerCase();
  const roomCode = room.trim().toLowerCase();

  try {
    const result = await pool.query(
      `INSERT INTO users (username, room)
       VALUES ($1, $2)
       ON CONFLICT (username, room)
       DO UPDATE SET username = EXCLUDED.username
       RETURNING id, username, score, room, is_admin`,
      [name, roomCode]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// GET /api/ranking?room=<código>
// Retorna ranking dos usuários da sala especificada, ordenados por score
app.get('/api/ranking', async (req, res) => {
  const { room } = req.query;

  if (!room || typeof room !== 'string' || room.trim().length === 0) {
    return res.status(400).json({ error: 'Parâmetro room é obrigatório' });
  }

  const roomCode = room.trim().toLowerCase();

  try {
    const result = await pool.query(
      `SELECT username, score
       FROM users
       WHERE room = $1
       ORDER BY score DESC`,
      [roomCode]
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
