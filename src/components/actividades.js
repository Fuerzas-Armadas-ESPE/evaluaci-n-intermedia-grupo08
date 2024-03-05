import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const [originalActividades, setOriginalActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [editedActividad, setEditedActividad] = useState(null);
  const [modalMode, setModalMode] = useState('detalle');
  const [temasCurso, setTemasCurso] = useState([]);
  const [temaCursoMap, setTemaCursoMap] = useState({});
  const [form] = Form.useForm();
  const { Option } = Select;

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('actividades').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setActividades(data);
      setOriginalActividades(data);
    } catch (error) {
      console.error('Error fetching actividades:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemasCurso = async () => {
    try {
      const { data, error } = await supabase.from('temas_curso').select('*');
      if (error) {
        throw error;
      }
      setTemasCurso(data);
      const temaCursoIdMap = {};
      data.forEach(tema => {
        temaCursoIdMap[tema.id] = tema.titulo;
      });
      setTemaCursoMap(temaCursoIdMap);
    } catch (error) {
      console.error('Error fetching temas de curso:', error.message);
    }
  };

  const handleEdit = (actividad) => {
    setSelectedActividad(actividad);
    setEditedActividad(actividad);
    setModalMode('editar');
    setVisible(true);
  };

  const handleDelete = async (actividadId) => {
    try {
      const { error } = await supabase.from('actividades').delete().eq('id', actividadId);
      if (error) {
        throw error;
      }
      fetchActividades();
    } catch (error) {
      console.error('Error deleting actividad:', error.message);
    }
  };

  const handleDetails = (actividad) => {
    setSelectedActividad(actividad);
    setEditedActividad(actividad);
    setModalMode('detalle');
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('actividades').update(values).eq('id', selectedActividad.id);
      if (error) {
        throw error;
      }
      fetchActividades();
      setVisible(false);
    } catch (error) {
      console.error('Error updating actividad:', error.message);
    }
  };

  useEffect(() => {
    fetchActividades();
    fetchTemasCurso();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tema del Curso', dataIndex: 'id_tema_curso', key: 'id_tema_curso', render: (id_tema_curso) => temaCursoMap[id_tema_curso] },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Estado', dataIndex: 'estado', key: 'estado' },
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
    const filteredActividades = originalActividades.filter(actividad =>
      Object.values(actividad).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setActividades(filteredActividades);
  };

  const handleDownloadPDF = () => {
    const table = document.getElementById('actividades-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchActividades()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
        <Input.Search placeholder="Buscar actividad" onSearch={handleSearch} enterButton />
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
      </Space>
      <Table id="actividades-table" columns={columns} dataSource={actividades} loading={loading} />
      <Modal
        title={modalMode === 'editar' ? 'Editar Actividad' : 'Detalles de la Actividad'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedActividad}
          onValuesChange={(changedValues, allValues) => setEditedActividad(allValues)}
        >
          <Form.Item
            label="Tema del Curso"
            name="id_tema_curso"
            rules={[{ required: true, message: 'Por favor seleccione el tema del curso' }]}
          >
            <Select>
              {temasCurso.map(tema => (
                <Option key={tema.id} value={tema.id}>{tema.titulo}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'Por favor ingrese la descripción de la actividad' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Estado"
            name="estado"
            rules={[{ required: true, message: 'Por favor seleccione el estado de la actividad' }]}
          >
            <Select>
              <Option value="Realizadas">Realizadas</Option>
              <Option value="Pendientes">Pendientes</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Actividades;
