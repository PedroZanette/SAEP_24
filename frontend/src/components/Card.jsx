import React, { useState } from 'react';

function Card({ livro, buscarLivros }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({ ...livro });
  

  const alterarStatus = async (novaStatus) => {
      await atualizarLivro(novaStatus);
    }

  const atualizarLivro = async (novaStatus = null) => {
    const body = { ...livro, status: novaStatus };
    await fetch(`http://localhost:3000/livros/${livro.codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    buscarLivros();
  };


  const editarLivro = async () => {
    await fetch(`http://localhost:3000/livros/${livro.codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCar)
    });
    buscarLivros();
    setIsEditing(false);
  };

  const deletarLivro = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja deletar este livro?");
    if (confirmed) {
      await fetch(`http://localhost:3000/livros/${livro.codigo}`, { method: 'DELETE' });
      buscarLivros();
    }
  };

  return (
    <div className="card">
      <h3>{livro.titulo}</h3>
      <p>Autor: {livro.autor}</p>
      <p>Ano: {livro.ano}</p>
      <p>Editora: {livro.editora}</p>
      <p>Status: {livro.status}</p>
      {livro.status === 'a_fazer' && (
        <>
          <button onClick={() => alterarStatus('em_andamento')}>Em andamento</button>
          <button onClick={() => alterarStatus('concluido')}>Conclído</button>
        </>
      )}
      {livro.status === 'em_andamento' && (
        <>
        <button onClick={() => alterarStatus('a_fazer')}>A fazer</button>
        <button onClick={() => alterarStatus('concluido')}>Conclído</button>
      </>
      )}
      {livro.status === 'concluido' && (
        <>
        <button onClick={() => alterarStatus('a_fazer')}>A fazer</button>
        <button onClick={() => alterarStatus('em_andamento')}>Em andamento</button>
      </>
      )}
      {isEditing && (
        <div>
          <input
            value={editedCar.titulo}
            onChange={(e) => setEditedCar({ ...editedCar, titulo: e.target.value })}
          />
          <input
            value={editedCar.autor}
            onChange={(e) => setEditedCar({ ...editedCar, autor: e.target.value })}
          />
          <input
            type="number"
            value={editedCar.ano}
            onChange={(e) => setEditedCar({ ...editedCar, ano: parseInt(e.target.value) })}
          />
          <input
            value={editedCar.editora}
            onChange={(e) => setEditedCar({ ...editedCar, editora: e.target.value })}
          />
          <button onClick={editarLivro}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}
      {!isEditing && (
        <>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <button onClick={deletarLivro}>Deletar</button>
        </>
      )}
    </div>
  );
}

export default Card;


