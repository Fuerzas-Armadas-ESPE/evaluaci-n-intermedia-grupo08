import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [originalDocentes, setOriginalDocentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [editedDocente, setEditedDocente] = useState(null);
  const [modalMode, setModalMode] = useState('detalle');
  const [form] = Form.useForm();

  const fetchDocentes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('docentes').select('*');
      if (error) {
        throw error;
      }
      setDocentes(data);
      setOriginalDocentes(data);
    } catch (error) {
      console.error('Error fetching docentes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (docente) => {
    setSelectedDocente(docente);
    setEditedDocente(docente);
    setModalMode('editar');
    setVisible(true);
  };

  const handleDelete = async (docenteId) => {
    try {
      const { error } = await supabase.from('docentes').delete().eq('id', docenteId);
      if (error) {
        throw error;
      }
      fetchDocentes();
    } catch (error) {
      console.error('Error deleting docente:', error.message);
    }
  };

  const handleDetails = (docente) => {
    setSelectedDocente(docente);
    setEditedDocente(docente);
    setModalMode('detalle');
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('docentes').update(values).eq('id', selectedDocente.id);
      if (error) {
        throw error;
      }
      fetchDocentes();
      setVisible(false);
    } catch (error) {
      console.error('Error updating docente:', error.message);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Correo Electrónico', dataIndex: 'correo_electronico', key: 'correo_electronico' },
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
    const filteredDocentes = originalDocentes.filter(docente =>
      Object.values(docente).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setDocentes(filteredDocentes);
  };

  const handleDownloadPDF = () => {
    const table = document.getElementById('docentes-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchDocentes()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
        <Input.Search placeholder="Buscar docente" onSearch={handleSearch} enterButton />
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
      </Space>
      <Table id="docentes-table" columns={columns} dataSource={docentes} loading={loading} />
      <Modal
        title={modalMode === 'editar' ? 'Editar Docente' : 'Detalles del Docente'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedDocente}
          onValuesChange={(changedValues, allValues) => setEditedDocente(allValues)}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del docente' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo Electrónico"
            name="correo_electronico"
            rules={[{ required: true, message: 'Por favor ingrese el correo electrónico del docente' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Docentes;
