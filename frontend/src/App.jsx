import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [livros, setLivros] = useState([]);
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
    matricula: '',
    nome_completo: '',
    data_nascimento: '',
    email: '',
    telefone: '',
  });

  const filtroLivrosPorStatus = (status) => livros.filter(livro => livro.status === status);

  function adicionarLivro() {
    setIsAddingLivro(true);
  }
  function adicionarEstudante() {
    setIsAddingEstudante(true);
  }

  const salvarLivro = async () => {
    try {
      await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoLivro, status: 'a_fazer' }),
      });
      setIsAddingLivro(false);
      setNovoLivro({ titulo: '', autor: '', ano: 0, editora: '' });
      buscarLivros();
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
      setNovoEstudante({ cpf: '', nome_completo: '', data_nascimento: '', email: '', telefone: '' });
      buscarEstudantes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const buscarLivros = async () => {
    try {
      const response = await fetch('http://localhost:3000/livros');
      const data = await response.json();
      setLivros(data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
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
    buscarLivros();
    buscarEstudantes();
  }, []);

  return (
    <div>
      <header>
        <h1>Aluga Livros</h1>
        <button onClick={adicionarLivro}>Adicionar Livro</button>
        <button onClick={adicionarEstudante}>Adicionar Estudante</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>A fazer</h2>
          {filtroLivrosPorStatus('a_fazer').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarLivros={buscarLivros} estudantes={estudantes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Em andamento</h2>
          {filtroLivrosPorStatus('em_andamento').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarLivros={buscarLivros} estudantes={estudantes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Concluído</h2>
          {filtroLivrosPorStatus('concluido').map(livro => (
            <Card key={livro.codigo} livro={livro} buscarLivros={buscarLivros} estudantes={estudantes} />
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
              value={novoEstudante.nome_completo}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, nome_completo: e.target.value })}
            />
            <input
              type="date"
              placeholder="Data de Nascimento"
              value={novoEstudante.data_nascimento}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, data_nascimento: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoEstudante.email}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
            />
            <input
              placeholder="Telefone"
              value={novoEstudante.telefone}
              onChange={(e) => setNovoEstudante({ ...novoEstudante, telefone: e.target.value })}
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


// import React, { useEffect, useState } from 'react';
// import LivroCard from './components/LivroCard';

// function App() {
//     const [livros, setLivros] = useState([]);
//     const [estudantes, setEstudantes] = useState([]);
//     const [isAddingLivro, setIsAddingLivro] = useState(false);
//     const [isAddingEstudante, setIsAddingEstudante] = useState(false);

//     const [novoLivro, setNovoLivro] = useState({
//         titulo: '',
//         autor: '',
//         ano: 0,
//         editora: '',
//     });

//     const [novoEstudante, setNovoEstudante] = useState({
//         cpf: '',
//         nome_completo: '',
//         data_nascimento: '',
//         email: '',
//         telefone: '',
//     });

//     const filtroLivrosPorStatus = (status) => livros.filter(livro => livro.status === status);

//     function adicionarLivro() {
//         setIsAddingLivro(true);
//     }

//     function adicionarEstudante() {
//         setIsAddingEstudante(true);
//     }

//     const salvarLivro = async () => {
//         try {
//             await fetch('http://localhost:3000/livros', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ...novoLivro, status: 'a_fazer' }),
//             });
//             setIsAddingLivro(false);
//             setNovoLivro({ titulo: '', autor: '', ano: 0, editora: '' });
//             buscarLivros();
//         } catch (error) {
//             console.error('Erro ao salvar livro:', error);
//         }
//     };

//     const salvarEstudante = async () => {
//         try {
//             await fetch('http://localhost:3000/estudantes', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(novoEstudante),
//             });
//             setIsAddingEstudante(false);
//             setNovoEstudante({ cpf: '', nome_completo: '', data_nascimento: '', email: '', telefone: '' });
//             buscarEstudantes();
//         } catch (error) {
//             console.error('Erro ao salvar cliente:', error);
//         }
//     };

//     const buscarLivros = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/livros');
//             const data = await response.json();
//             setLivros(data);
//         } catch (error) {
//             console.error('Erro ao buscar livros:', error);
//         }
//     };

//     const buscarEstudantes = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/estudantes');
//             const data = await response.json();
//             setEstudantes(data);
//         } catch (error) {
//             console.error('Erro ao buscar estudantes:', error);
//         }
//     };

//     useEffect(() => {
//         buscarLivros();
//         buscarEstudantes();
//     }, []);

//     return (
//         <div className="App">
//             <header>
//                 <h1>Controle de Frota</h1>
//                 <div>
//                     <button onClick={adicionarLivro}>Novo Livro</button>
//                     <button onClick={adicionarEstudante}>Novo Estudante</button>
//                 </div>
//             </header>

//             <div className="dashboard">
//                 <div className="coluna-dashboard">
//                     <h2>Uso</h2>
//                     {filtroLivrosPorStatus('a_fazer').map(livro => (
//                         <LivroCard key={livro.codigo} livro={livro} buscarLivros={buscarLivros} />
//                     ))}
//                 </div>
//                 <div className="coluna-dashboard">
//                     <h2>Alugados</h2>
//                     {filtroLivrosPorStatus('em_andamento').map(livro => (
//                         <LivroCard key={livro.codigo} livro={livro} buscarLivros={buscarLivros} />
//                     ))}
//                 </div>
//                 <div className="coluna-dashboard">
//                     <h2>Manutenção</h2>
//                     {filtroLivrosPorStatus(' conclucodigoo').map(livro => (
//                         <LivroCard key={livro.codigo} livro={livro} buscarLivros={buscarLivros} />
//                     ))}
//                 </div>
//             </div>

//             {isAddingLivro && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <h3>Cadastrar Novo Livro</h3>
//                         <label>
//                             Titulo:
//                             <input
//                                 type="text"
//                                 value={novoLivro.titulo}
//                                 onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Autor:
//                             <input
//                                 type="text"
//                                 value={novoLivro.autor}
//                                 onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             KM:
//                             <input
//                                 type="number"
//                                 value={novoLivro.ano}
//                                 onChange={(e) => setNovoLivro({ ...novoLivro, ano: Number(e.target.value) })}
//                             />
//                         </label>
//                         <label>
//                             Editora:
//                             <input
//                                 type="text"
//                                 value={novoLivro.editora}
//                                 onChange={(e) => setNovoLivro({ ...novoLivro, editora: e.target.value })}
//                             />
//                         </label>
//                         <div className="modal-buttons">
//                             <button onClick={salvarLivro}>Salvar</button>
//                             <button onClick={() => setIsAddingLivro(false)}>Cancelar</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {isAddingEstudante && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <h3>Cadastrar Novo Estudante</h3>
//                         <label>
//                             CPF:
//                             <input
//                                 type="text"
//                                 value={novoEstudante.cpf}
//                                 onChange={(e) => setNovoEstudante({ ...novoEstudante, cpf: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Nome Completo:
//                             <input
//                                 type="text"
//                                 value={novoEstudante.nome_completo}
//                                 onChange={(e) => setNovoEstudante({ ...novoEstudante, nome_completo: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Data de Nascimento:
//                             <input
//                                 type="date"
//                                 value={novoEstudante.data_nascimento}
//                                 onChange={(e) => setNovoEstudante({ ...novoEstudante, data_nascimento: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             E-mail:
//                             <input
//                                 type="email"
//                                 value={novoEstudante.email}
//                                 onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Telefone:
//                             <input
//                                 type="text"
//                                 value={novoEstudante.telefone}
//                                 onChange={(e) => setNovoEstudante({ ...novoEstudante, telefone: e.target.value })}
//                             />
//                         </label>
//                         <div className="modal-buttons">
//                             <button onClick={salvarEstudante}>Salvar</button>
//                             <button onClick={() => setIsAddingEstudante(false)}>Cancelar</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;

