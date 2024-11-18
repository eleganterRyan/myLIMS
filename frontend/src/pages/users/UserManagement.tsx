import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { User } from '../../types/auth';
import { getUsers } from '../../services/userService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const data = await getUsers();
      console.log('Loaded users:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Invalid users data:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Load users error:', error);
      message.error('加载用户列表失败');
      setUsers([]);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colorMap = {
          admin: 'red',
          staff: 'blue',
          researcher: 'green'
        };
        return (
          <Tag color={colorMap[role as keyof typeof colorMap]}>
            {role === 'admin' ? '管理员' : role === 'staff' ? '工作人员' : '研究员'}
          </Tag>
        );
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // TODO: 调用更新用户API
        message.success('更新用户成功');
      } else {
        // TODO: 调用创建用户API
        message.success('创建用户成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      // TODO: 重新加载用户列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.name} 吗？`,
      onOk: async () => {
        try {
          // TODO: 调用删除用户API
          message.success('删除用户成功');
          // TODO: 重新加载用户列表
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          添加用户
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="staff">工作人员</Select.Option>
              <Select.Option value="researcher">研究员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 