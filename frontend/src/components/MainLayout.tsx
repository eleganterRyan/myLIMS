import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ExperimentOutlined,
  ToolOutlined,
  UserOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  BankOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useAuth } from 'react-oidc-context';
import { Button } from 'antd';
import { logout } from '../services/authService';

const { Sider, Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/experiments',
    icon: <ExperimentOutlined />,
    label: '实验管理',
  },
  {
    key: '/equipment',
    icon: <ToolOutlined />,
    label: '设备管理',
  },
  {
    key: '/schedule',
    icon: <ScheduleOutlined />,
    label: '预约管理',
  },
  {
    key: 'info-management',
    icon: <DatabaseOutlined />,
    label: '信息管理',
    children: [
      {
        key: '/users',
        icon: <UserOutlined />,
        label: '用户管理',
      },
      {
        key: '/research-groups',
        icon: <TeamOutlined />,
        label: '课题组管理',
      },
      {
        key: '/laboratories',
        icon: <BankOutlined />,
        label: '实验室管理',
      },
    ]
  },
  {
    key: '/safety',
    icon: <SafetyCertificateOutlined />,
    label: '安全检查',
    children: [
      {
        key: '/safety/inspection',
        label: '安全巡检',
      },
      {
        key: '/safety/records',
        label: '检查记录',
      },
      {
        key: '/safety/reports',
        label: '安全报告',
      }
    ]
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (auth.isAuthenticated) {
      auth.removeUser();
    } else {
      logout();
    }
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '16px' }}>实验室管理系统</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['info-management', '/safety']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Button 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          LIMS ©{new Date().getFullYear()} Created by Your Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 