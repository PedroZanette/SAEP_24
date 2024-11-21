const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'local', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'biblioteca', // Nome da sua database
    password: '12345', // Substitua pela sua senha
    port: 5432, // Porta padrão do PostgreSQL
});

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota para buscar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM livros');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});

// Rota para buscar um livro por ID
app.get('/livros/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM livros WHERE codigo = $1', [codigo]);
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
app.post('/livros', async (req, res) => {
    const { titulo, autor, ano, editora, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO livros (titulo, autor, ano, editora, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [titulo, autor, ano, editora, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar livro' });
    }
});

app.put('/livros/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { titulo, autor, ano, editora, status, matricula, data_retirada, data_prevista_entrega } = req.body;
    try {
      // Atualizar o livro
      const updateResult = await pool.query(
        'UPDATE livros SET titulo = $1, autor = $2, ano = $3, editora = $4, status = $5 WHERE codigo = $6 RETURNING *',
        [titulo, autor, ano, editora, status, codigo]
      );
  
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
  
      // Criar aluguel se status for "alugado"
      if (status === 'emprestado') {
        await pool.query(
            'INSERT INTO emprestimos (codigo_livro, matricula, data_retirada, data_prevista_entrega) VALUES ($1, $2, $3, $4)',
            [codigo, matricula, data_retirada, data_prevista_entrega]
        );
      }

      res.json(updateResult.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  });


// Atualizar um livro e registrar aluguel se status for "alugado"
// app.put('/livros/:codigo', async (req, res) => {
//     const { codigo } = req.params;
//     const { titulo, autor, ano, editora, status, matricula_cliente, data_retirada, data_prevista_entrega } = req.body;

//     try {
//         // Atualizar o livro
//         const updateResult = await pool.query(
//             'UPDATE livros SET titulo = $1, autor = $2, ano = $3, editora = $4, status = $5 WHERE codigo = $6 RETURNING *',
//             [titulo, autor, ano, editora, status, codigo]
//         );

//         if (updateResult.rows.length === 0) {
//             return res.status(404).json({ error: 'Carro não encontrado' });
//         }

//         // Criar aluguel se status for "alugado"
//         if (status === 'alugado') {
//             if (!matricula_cliente || !data_retirada || !data_prevista_entrega) {
//                 return res.status(400).json({ error: 'Informações do aluguel incompletas' });
//             }

//             await pool.query(
//                 'INSERT INTO alugueis (codigo_livro, matricula_cliente, data_retirada, data_prevista_entrega) VALUES ($1, $2, $3, $4)',
//                 [codigo, matricula_cliente, data_retirada, data_prevista_entrega]
//             );
//         }

//         res.json(updateResult.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Erro ao atualizar livro e registrar aluguel' });
//     }
// });



// Rota para atualizar um livro
// app.put('/livros/:codigo', async (req, res) => {
//     const { codigo } = req.params;
//     const { titulo, autor, ano, editora, status } = req.body;
//     try {
//         const result = await pool.query(
//             'UPDATE livros SET titulo = $1, autor = $2, ano = $3, editora = $4, status = $5 WHERE codigo = $6 RETURNING *',
//             [titulo, autor, ano, editora, status, codigo]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Carro não encontrado' });
//         }
//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Erro ao atualizar livro' });
//     }
// });

// Rota para deletar um livro
app.delete('/livros/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('DELETE FROM livros WHERE codigo = $1 RETURNING *', [codigo]);
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
app.post('/estudantes', async (req, res) => {
    const { matricula, nome_completo, data_nascimento, email, telefone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO estudantes (matricula, nome_completo, data_nascimento, email, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [matricula, nome_completo, data_nascimento, email, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
});

// Rota para buscar todos os estudantes
app.get('/estudantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudantes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar estudantes' });
    }
});


app.listen(3000, () => {
    console.log('Servcodigoor rodando na porta 3000');
});
