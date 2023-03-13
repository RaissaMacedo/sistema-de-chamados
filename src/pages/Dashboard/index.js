import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
} from '@firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';

import './dashboard.css';
const listRef = collection(db, 'chamados');
export default function Dashboard() {
  // const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy('created', 'desc'), limit(5));
      setChamados([]); //zerando antes de chamar os novos itens para ñ duplicar
      const querySnapshot = await getDocs(q); // percorre os itens
      await updateState(querySnapshot);

      setLoading(false);
    }
    loadChamados();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/mm/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // pegando o ultimo item
      setChamados((chamados) => [...chamados, ...lista]); // mantendo o que já tem e colocando a mais na lista
      setLastDocs(lastDoc); // qual ultimo item que esta sendo renderizado
    } else {
      setIsEmpty(true);
    }
    setLoadingMore(false);
  }
  async function handleMore() {
    setLoadingMore(true);

    const q = query(
      listRef,
      orderBy('created', 'desc'),
      startAfter(lastDocs),
      limit(5),
    );
    const querySnapshot = await getDocs(q); // fazendo a requisição
    await updateState(querySnapshot);
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }
  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>
        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link className="new" to="/new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link className="new" to="/new">
                <FiPlus color="#FFF" size={25} />
                Abrir novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Clientes</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Cadastrando em</th>
                    <th scope="col">Status</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.status === 'Aberto' ? '#5cb85c' : '#999',
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: '#3583f6' }}
                            onClick={() => toggleModal(item)}
                          >
                            <FiSearch color="#fff" size={17} />
                          </button>
                          <Link
                            to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: '#f6a935' }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && (
                <button className="btn-more" onClick={handleMore}>
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
      </div>
      {showPostModal && (
        <Modal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
    </div>
  );
}
