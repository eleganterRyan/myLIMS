import React, { useState } from 'react';
import { Button, Card, Form, Input, message, Tabs, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { login, setToken, setUser } from '../services/authService';
import { LoginForm } from '../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const auth = useAuth();
  const [loginType, setLoginType] = useState<'oidc' | 'password'>('oidc');

  const handlePasswordLogin = async (values: LoginForm) => {
    try {
      setLoading(true);
      const response = await login(values);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        message.success('登录成功！');
        navigate('/');
      } else {
        message.error('登录响应格式错误');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(
        error.response?.data?.message || 
        error.message || 
        '登录失败，请重试！'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOidcLogin = () => {
    auth.signinRedirect();
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    message.error('OIDC认证错误: ' + auth.error.message);
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="实验室信息管理系统" style={{ width: 400 }}>
        <Tabs
          activeKey={loginType}
          onChange={(key) => setLoginType(key as 'oidc' | 'password')}
          items={[
            {
              key: 'oidc',
              label: '统一身份认证',
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Button 
                    type="primary" 
                    icon={<LoginOutlined />} 
                    onClick={handleOidcLogin}
                    block
                    size="large"
                  >
                    统一身份认证登录
                  </Button>
                </div>
              )
            },
            {
              key: 'password',
              label: '账号密码登录',
              children: (
                <Form
                  form={form}
                  onFinish={handlePasswordLogin}
                  layout="vertical"
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="用户名" 
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="密码"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block 
                      size="large"
                      loading={loading}
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Login; 