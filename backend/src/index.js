const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'local', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'tarefasKanban', // Nome da sua database
    password: '12345', // Substitua pela sua senha
    port: 5432, // Porta padrão do PostgreSQL
});

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota para buscar todos os tarefas
app.get('/tarefas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarefas');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

// Rota para buscar um livro por ID
app.get('/tarefas/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarefas WHERE codigo = $1', [codigo]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar livro' });
    }
});

// Rota para adicionar um livro
app.post('/tarefas', async (req, res) => {
    const { descricao, nome_setor, data_cadastro, prioridade, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tarefas (descricao, nome_setor, data_cadastro, prioridade, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [descricao, nome_setor, data_cadastro, prioridade, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar livro' });
    }
});

app.put('/tarefas/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { descricao, nome_setor, data_cadastro, prioridade, status, id_usuario, data_retirada, data_prevista_entrega } = req.body;
    try {
      // Atualizar o livro
      const updateResult = await pool.query(
        'UPDATE tarefas SET descricao = $1, nome_setor = $2, data_cadastro = $3, prioridade = $4, status = $5 WHERE codigo = $6 RETURNING *',
        [descricao, nome_setor, data_cadastro, prioridade, status, codigo]
      );
  
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
  
      // Criar aluguel se status for "alugado"
      if (status === 'emprestado') {
        await pool.query(
            'INSERT INTO emprestimos (codigo_livro, id_usuario, data_retirada, data_prevista_entrega) VALUES ($1, $2, $3, $4)',
            [codigo, id_usuario, data_retirada, data_prevista_entrega]
        );
      }

      res.json(updateResult.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  });

// Rota para deletar um livro
app.delete('/tarefas/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('DELETE FROM tarefas WHERE codigo = $1 RETURNING *', [codigo]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.json({ message: 'Carro deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar livro' });
    }
});

// Rota para adicionar um cliente
app.post('/usuario', async (req, res) => {
    const { id_usuario, nome, email, telefone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuario (id_usuario, nome, data_nascimento, email, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_usuario, nome, data_nascimento, email, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
});

// Rota para buscar todos os usuario
app.get('/usuario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuario' });
    }
});


app.listen(3000, () => {
    console.log('Servcodigoor rodando na porta 3000');
});
