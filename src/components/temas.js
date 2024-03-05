import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, Checkbox, Select } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [originalTareas, setOriginalTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [editedTarea, setEditedTarea] = useState(null);
  const [modalMode, setModalMode] = useState('detalle');
  const [temasCurso, setTemasCurso] = useState([]);
  const [temaCursoMap, setTemaCursoMap] = useState({});
  const [form] = Form.useForm();
  const { Option } = Select;

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tareas').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setTareas(data);
      setOriginalTareas(data);
    } catch (error) {
      console.error('Error fetching tareas:', error.message);
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

  const handleEdit = (tarea) => {
    setSelectedTarea(tarea);
    setEditedTarea(tarea);
    setModalMode('editar');
    setVisible(true);
  };

  const handleDelete = async (tareaId) => {
    try {
      const { error } = await supabase.from('tareas').delete().eq('id', tareaId);
      if (error) {
        throw error;
      }
      fetchTareas();
    } catch (error) {
      console.error('Error deleting tarea:', error.message);
    }
  };

  const handleDetails = (tarea) => {
    setSelectedTarea(tarea);
    setEditedTarea(tarea);
    setModalMode('detalle');
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('tareas').update(values).eq('id', selectedTarea.id);
      if (error) {
        throw error;
      }
      fetchTareas();
      setVisible(false);
    } catch (error) {
      console.error('Error updating tarea:', error.message);
    }
  };

  useEffect(() => {
    fetchTareas();
    fetchTemasCurso();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tema del Curso', dataIndex: 'id_tema_curso', key: 'id_tema_curso', render: (id_tema_curso) => temaCursoMap[id_tema_curso] },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Clase Impartida', dataIndex: 'clase_impartida', key: 'clase_impartida', render: (clase_impartida) => clase_impartida ? 'Sí' : 'No' },
    { title: 'Actividad Pendiente', dataIndex: 'actividad_pendiente', key: 'actividad_pendiente', render: (actividad_pendiente) => actividad_pendiente ? 'Sí' : 'No' },
    { title: 'Observaciones', dataIndex: 'observaciones', key: 'observaciones' },
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
    const filteredTareas = originalTareas.filter(tarea =>
      Object.values(tarea).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setTareas(filteredTareas);
  };

  const handleDownloadPDF = () => {
    const table = document.getElementById('tareas-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchTareas()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
        <Input.Search placeholder="Buscar tarea" onSearch={handleSearch} enterButton />
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
      </Space>
      <Table id="tareas-table" columns={columns} dataSource={tareas} loading={loading} />
      <Modal
        title={modalMode === 'editar' ? 'Editar Tarea' : 'Detalles de la Tarea'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedTarea}
          onValuesChange={(changedValues, allValues) => setEditedTarea(allValues)}
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
            rules={[{ required: true, message: 'Por favor ingrese la descripción de la tarea' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Clase Impartida"
            name="clase_impartida"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Actividad Pendiente"
            name="actividad_pendiente"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Observaciones"
            name="observaciones"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tareas;
