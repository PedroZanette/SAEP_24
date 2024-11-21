import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [isAddingTarefa, setIsAddingTarefa] = useState(false);
  const [isAddingUsuario, setIsAddingUsuario] = useState(false);
  const [novoTarefa, setNovoTarefa] = useState({
    descricao: '',
    nome_setor: '',
    data_cadastro: 0,
    prioridade: '',
  });
  const [novoUsuario, setNovoUsuario] = useState({
    id_usuario: '',
    nome: '',
    email: ''
  });

  const filtroTarefasPorStatus = (status) => tarefas.filter(tarefa => tarefa.status === status);

  function adicionarTarefa() {
    setIsAddingTarefa(true);
  }
  function adicionarUsuario() {
    setIsAddingUsuario(true);
  }

  const salvarTarefa = async () => {
    try {
      await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoTarefa, status: 'a_fazer' }),
      });
      setIsAddingTarefa(false);
      setNovoTarefa({ descricao: '', nome_setor: '', data_cadastro: 0, prioridade: '' });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const salvarUsuario = async () => {
    try {
      await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });
      setIsAddingUsuario(false);
      setNovoUsuario({ id_usuario: '', nome: '', email: ''});
      buscarUsuario();
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

  const buscarUsuario = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuario');
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error('Erro ao buscar usuario:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
    buscarUsuario();
  }, []);

  return (
    <div>
      <header>
        <h1>Aluga Tarefas</h1>
        <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
        <button onClick={adicionarUsuario}>Adicionar Usuario</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>A fazer</h2>
          {filtroTarefasPorStatus('a_fazer').map(tarefa => (
            <Card key={tarefa.codigo} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Em andamento</h2>
          {filtroTarefasPorStatus('em_andamento').map(tarefa => (
            <Card key={tarefa.codigo} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Concluído</h2>
          {filtroTarefasPorStatus('concluido').map(tarefa => (
            <Card key={tarefa.codigo} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
      </div>
      {isAddingTarefa && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Tarefa</h2>
            <input
              placeholder="Descrição"
              value={novoTarefa.descricao}
              onChange={(e) => setNovoTarefa({ ...novoTarefa, descricao: e.target.value })}
            />
            <input
              placeholder="Nome setor"
              value={novoTarefa.nome_setor}
              onChange={(e) => setNovoTarefa({ ...novoTarefa, nome_setor: e.target.value })}
            />
            <input
              type="number"
              placeholder="Data cadastro"
              value={novoTarefa.data_cadastro}
              onChange={(e) => setNovoTarefa({ ...novoTarefa, data_cadastro: parseInt(e.target.value) })}
            />
            <input
              placeholder="Prioridade"
              value={novoTarefa.prioridade}
              onChange={(e) => setNovoTarefa({ ...novoTarefa, prioridade: e.target.value })}
            />
            <button onClick={salvarTarefa}>Salvar</button>
            <button onClick={() => setIsAddingTarefa(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {isAddingUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Usuario</h2>
            <input
              placeholder="Id do usuário"
              value={novoUsuario.id_usuario}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, id_usuario: e.target.value })}
            />
            <input
              placeholder="Nome Completo"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoUsuario.email}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
            />
           
            <button onClick={salvarUsuario}>Salvar</button>
            <button onClick={() => setIsAddingUsuario(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

