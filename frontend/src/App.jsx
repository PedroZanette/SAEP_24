import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [estudantes, setEstudantes] = useState([]);
  const [isAddingLivro, setIsAddingLivro] = useState(false);
  const [isAddingEstudante, setIsAddingEstudante] = useState(false);
  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autor: '',
    ano: 0,
    editora: '',
  });
  const [novoEstudante, setNovoEstudante] = useState({
    id_usuario: '',
    nome: '',
    email: ''
  });

  const filtroTarefasPorStatus = (status) => tarefas.filter(livro => livro.status === status);

  function adicionarLivro() {
    setIsAddingLivro(true);
  }
  function adicionarEstudante() {
    setIsAddingEstudante(true);
  }

  const salvarLivro = async () => {
    try {
      await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoLivro, status: 'a_fazer' }),
      });
      setIsAddingLivro(false);
      setNovoLivro({ titulo: '', autor: '', ano: 0, editora: '' });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    }
  };

  const salvarEstudante = async () => {
    try {
      await fetch('http://localhost:3000/estudantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEstudante),
      });
      setIsAddingEstudante(false);
      setNovoEstudante({ cpf: '', nome: '', email: ''});
      buscarEstudantes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const buscarEstudantes = async () => {
    try {
      const response = await fetch('http://localhost:3000/estudantes');
      const data = await response.json();
      setEstudantes(data);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
    buscarEstudantes();
  }, []);

  return (
    <div>
      <header>
        <h1>Aluga Tarefas</h1>
        <button onClick={adicionarLivro}>Adicionar Livro</button>
        <button onClick={adicionarEstudante}>Adicionar Estudante</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>A fazer</h2>
          {filtroTarefasPorStatus('a_fazer').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarTarefas={buscarTarefas} estudantes={estudantes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Em andamento</h2>
          {filtroTarefasPorStatus('em_andamento').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarTarefas={buscarTarefas} estudantes={estudantes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Concluído</h2>
          {filtroTarefasPorStatus('concluido').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarTarefas={buscarTarefas} estudantes={estudantes} />
          ))}
        </div>
      </div>
      {isAddingLivro && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Livro</h2>
            <input
              placeholder="Titulo"
              value={novoLivro.titulo}
              onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })}
            />
            <input
              placeholder="Autor"
              value={novoLivro.autor}
              onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
            />
            <input
              type="number"
              placeholder="KM"
              value={novoLivro.ano}
              onChange={(e) => setNovoLivro({ ...novoLivro, ano: parseInt(e.target.value) })}
            />
            <input
              placeholder="Editora"
              value={novoLivro.editora}
              onChange={(e) => setNovoLivro({ ...novoLivro, editora: e.target.value })}
            />
            <button onClick={salvarLivro}>Salvar</button>
            <button onClick={() => setIsAddingLivro(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {isAddingEstudante && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Estudante</h2>
            <input
              placeholder="CPF"
              value={novoEstudante.cpf}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, cpf: e.target.value })}
            />
            <input
              placeholder="Nome Completo"
              value={novoEstudante.nome}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, nome: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoEstudante.email}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
            />
           
            <button onClick={salvarEstudante}>Salvar</button>
            <button onClick={() => setIsAddingEstudante(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

