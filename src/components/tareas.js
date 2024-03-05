import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const TemasCurso = () => {
  const [temasCurso, setTemasCurso] = useState([]);
  const [originalTemasCurso, setOriginalTemasCurso] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedTemaCurso, setSelectedTemaCurso] = useState(null);
  const [editedTemaCurso, setEditedTemaCurso] = useState(null);
  const [modalMode, setModalMode] = useState('detalle');
  const [cursos, setCursos] = useState([]);
  const [cursoMap, setCursoMap] = useState({});
  const [form] = Form.useForm();

  const fetchTemasCurso = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('temas_curso')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      setTemasCurso(data);
      setOriginalTemasCurso(data);
    } catch (error) {
      console.error('Error fetching temas de curso:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const { data, error } = await supabase.from('cursos').select('*');
      if (error) {
        throw error;
      }
      setCursos(data);
      const cursoIdMap = {};
      data.forEach(curso => {
        cursoIdMap[curso.id] = curso.nombre_curso;
      });
      setCursoMap(cursoIdMap);
    } catch (error) {
      console.error('Error fetching cursos:', error.message);
    }
  };

  const handleEdit = (temaCurso) => {
    setSelectedTemaCurso(temaCurso);
    setEditedTemaCurso(temaCurso);
    setModalMode('editar');
    setVisible(true);
  };

  const handleDelete = async (temaCursoId) => {
    try {
      const { error } = await supabase.from('temas_curso').delete().eq('id', temaCursoId);
      if (error) {
        throw error;
      }
      fetchTemasCurso();
    } catch (error) {
      console.error('Error deleting tema de curso:', error.message);
    }
  };

  const handleDetails = (temaCurso) => {
    setSelectedTemaCurso(temaCurso);
    setEditedTemaCurso(temaCurso);
    setModalMode('detalle');
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('temas_curso').update(values).eq('id', selectedTemaCurso.id);
      if (error) {
        throw error;
      }
      fetchTemasCurso();
      setVisible(false);
    } catch (error) {
      console.error('Error updating tema de curso:', error.message);
    }
  };

  useEffect(() => {
    fetchTemasCurso();
    fetchCursos();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre del Curso', dataIndex: 'id_curso', key: 'id_curso', render: (id_curso) => cursoMap[id_curso] },
    { title: 'Título', dataIndex: 'titulo', key: 'titulo' },
    { title: 'Objetivo', dataIndex: 'objetivo', key: 'objetivo' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Editar</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Eliminar</Button>
          <Button icon={<InfoCircleOutlined />} onClick={() => handleDetails(record)}>Detalles</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    const filteredTemasCurso = originalTemasCurso.filter(temaCurso =>
      Object.values(temaCurso).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setTemasCurso(filteredTemasCurso);
  };

  const handleDownloadPDF = () => {
    const table = document.getElementById('temas-curso-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchTemasCurso()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
        <Input.Search placeholder="Buscar tema de curso" onSearch={handleSearch} enterButton />
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
      </Space>
      <Table id="temas-curso-table" columns={columns} dataSource={temasCurso} loading={loading} />
      <Modal
        title={modalMode === 'editar' ? 'Editar Tema de Curso' : 'Detalles del Tema de Curso'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedTemaCurso}
          onValuesChange={(changedValues, allValues) => setEditedTemaCurso(allValues)}
        >
          <Form.Item
            label="Nombre del Curso"
            name="id_curso"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del curso' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Título"
            name="titulo"
            rules={[{ required: true, message: 'Por favor ingrese el título del tema' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Objetivo"
            name="objetivo"
            rules={[{ required: true, message: 'Por favor ingrese el objetivo del tema' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemasCurso;
