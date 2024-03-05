import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [originalCursos, setOriginalCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [editedCurso, setEditedCurso] = useState(null);
  const [modalMode, setModalMode] = useState('detalle');
  const [form] = Form.useForm();

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('cursos').select('*');
      if (error) {
        throw error;
      }
      setCursos(data);
      setOriginalCursos(data);
    } catch (error) {
      console.error('Error fetching cursos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (curso) => {
    setSelectedCurso(curso);
    setEditedCurso(curso);
    setModalMode('editar');
    setVisible(true);
  };

  const handleDelete = async (cursoId) => {
    try {
      const { error } = await supabase.from('cursos').delete().eq('id', cursoId);
      if (error) {
        throw error;
      }
      fetchCursos();
    } catch (error) {
      console.error('Error deleting curso:', error.message);
    }
  };

  const handleDetails = (curso) => {
    setSelectedCurso(curso);
    setEditedCurso(curso);
    setModalMode('detalle');
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('cursos').update(values).eq('id', selectedCurso.id);
      if (error) {
        throw error;
      }
      fetchCursos();
      setVisible(false);
    } catch (error) {
      console.error('Error updating curso:', error.message);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre del Curso', dataIndex: 'nombre_curso', key: 'nombre_curso' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
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
    const filteredCursos = originalCursos.filter(curso =>
      Object.values(curso).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setCursos(filteredCursos);
  };

  const handleDownloadPDF = () => {
    const table = document.getElementById('cursos-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchCursos()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
        <Input.Search placeholder="Buscar curso" onSearch={handleSearch} enterButton />
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
      </Space>
      <Table id="cursos-table" columns={columns} dataSource={cursos} loading={loading} />
      <Modal
        title={modalMode === 'editar' ? 'Editar Curso' : 'Detalles del Curso'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedCurso}
          onValuesChange={(changedValues, allValues) => setEditedCurso(allValues)}
        >
          <Form.Item
            label="Nombre del Curso"
            name="nombre_curso"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del curso' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'Por favor ingrese la descripción del curso' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cursos;
