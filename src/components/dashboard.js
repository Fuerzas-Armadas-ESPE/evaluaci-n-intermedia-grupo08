import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'transparent', padding: '20px', textAlign: 'center' }}>
        <img src="espe.png" alt="Logo" style={{ maxWidth: '500px', maxHeight: '500px' }} />
      </Header>
      <Content style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={1}>SISTEMA DOCENTE</Title>
        <Title level={2}>PRUEBA INTERMEDIA</Title><br/>
        <p style={{ fontSize: '20px' }}>NOMBRE: ADRIAN SIMBAÑA</p>
        <p style={{ fontSize: '20px' }}>NRC: 14386</p>
        <p style={{ fontSize: '20px' }}>FECHA: 05/03/2024</p>
      </Content>
    </Layout>
  );
}

export default DashboardPage;
