import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, PoweroffOutlined, CheckSquareOutlined, AccountBookOutlined, BankOutlined, BookOutlined } from '@ant-design/icons';
import Docentes from './components/docentes';
import Cursos from './components/cursos';
import Tareas from './components/tareas';
import DashboardPage from './components/dashboard';
import Actividades from './components/actividades';
import Temas from './components/temas';

const { Header, Content } = Layout;

const Dashboard = () => {
  const [componenteActivo, setComponenteActivo] = useState('Inicio');
  const renderizarComponente = () => {
    switch (componenteActivo) {
      case 'Docentes':
        return <Docentes />;
      case 'Cursos':
        return <Cursos />;
      case 'Tareas':
        return <Tareas />;
      case 'Actividades':
        return <Actividades />;
      case 'Temas':
        return <Temas />;
      default:
        return <DashboardPage />;
    }
  };

  const handleMenuClick = (componente) => {
    setComponenteActivo(componente);
  };

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ backgroundColor: '#18171c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '20px 0', color: 'white' }}>Docentes</h1>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ overflowX: 'auto' }}>
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => handleMenuClick('Inicio')}>
              Inicio
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />} onClick={() => handleMenuClick('Docentes')}>
              Docentes
            </Menu.Item>
            <Menu.Item key="3" icon={<BankOutlined />} onClick={() => handleMenuClick('Cursos')}>
              Cursos
            </Menu.Item>
            <Menu.Item key="6" icon={<BookOutlined />} onClick={() => handleMenuClick('Tareas')}>
              Tareas
            </Menu.Item>
            <Menu.Item key="4" icon={<CheckSquareOutlined />} onClick={() => handleMenuClick('Actividades')}>
              Actividades
            </Menu.Item>
            <Menu.Item key="5" icon={<AccountBookOutlined />} onClick={() => handleMenuClick('Temas')}>
              Temas
            </Menu.Item>
          </Menu>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="6" icon={<PoweroffOutlined />}>
              Salir
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '24px' }}>
          {renderizarComponente()}
        </Content>
      </Layout>
    </div>
  );
};

export default Dashboard;
