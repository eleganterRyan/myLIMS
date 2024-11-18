import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, message, 
  Space, Tag, Descriptions, Transfer, InputNumber 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import type { ResearchGroup, Laboratory } from '../../types/research';
import { getUsersByRole } from '../../services/userService';
import { getLaboratories } from '../../services/laboratoryService';
import { 
  createResearchGroup, 
  getResearchGroups, 
  updateResearchGroup, 
  deleteResearchGroup 
} from '../../services/researchGroupService';

const { TextArea } = Input;
const { Option } = Select;

const ResearchGroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<ResearchGroup[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ResearchGroup | null>(null);
  const [users, setUsers] = useState<any[]>([]); // 用户列表
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]); // 实验室列表
  const [selectedLabs, setSelectedLabs] = useState<number[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadGroups();
    loadResearchers();
    loadLaboratories();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await getResearchGroups();
      setGroups(data);
    } catch (error) {
      message.error('加载课题组列表失败');
    }
  };

  const loadResearchers = async () => {
    try {
      const researchers = await getUsersByRole('researcher');
      setUsers(researchers);
    } catch (error) {
      message.error('加载研究员列表失败');
    }
  };

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(data);
    } catch (error) {
      message.error('加载实验室列表失败');
    }
  };

  const columns = [
    {
      title: '课题组名称',
      dataIndex: 'name',
    },
    {
      title: '负责人',
      dataIndex: ['leader', 'name'],
    },
    {
      title: '科研方向',
      dataIndex: 'direction',
    },
    {
      title: '成员数量',
      dataIndex: 'members',
      render: (members: any[]) => members.length,
    },
    {
      title: '实验室数量',
      dataIndex: 'laboratories',
      render: (labs: Laboratory[]) => labs.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResearchGroup) => (
        <Space>
          <Button 
            type="link" 
            icon={<TeamOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
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

  const handleViewDetails = (group: ResearchGroup) => {
    Modal.info({
      title: '课题组详情',
      width: 800,
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="课题组名称">{group.name}</Descriptions.Item>
          <Descriptions.Item label="负责人">{group.leader.name}</Descriptions.Item>
          <Descriptions.Item label="科研方向">{group.direction}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={group.status === 'active' ? 'green' : 'red'}>
              {group.status === 'active' ? '活跃' : '非活跃'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="成员" span={2}>
            {group.members.map(member => member.name).join(', ')}
          </Descriptions.Item>
          <Descriptions.Item label="实验室" span={2}>
            {group.laboratories.map(lab => (
              <div key={lab.id}>
                <p>房间：{lab.name} ({lab.roomId})</p>
                <p>安全等级：{lab.safetyLevel}</p>
                <p>安全分类：{lab.safetyCategory}</p>
                <p>主要危险源：{lab.hazardSources.join(', ')}</p>
                <p>安全设施：{lab.safetyFacilities.join(', ')}</p>
              </div>
            ))}
          </Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        name: values.name,
        leaderId: values.leaderId,
        direction: values.direction,
        memberIds: values.memberIds,
        laboratoryIds: values.laboratoryIds,
        status: values.status
      };

      if (editingGroup) {
        await updateResearchGroup(editingGroup.id, formData);
        message.success('更新课题组成功');
      } else {
        await createResearchGroup(formData);
        message.success('创建课题组成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingGroup(null);
      loadGroups();  // 重新加载课题组列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (group: ResearchGroup) => {
    setEditingGroup(group);
    form.setFieldsValue(group);
    setIsModalVisible(true);
  };

  const handleDelete = (group: ResearchGroup) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除课题组 ${group.name} 吗？`,
      onOk: async () => {
        try {
          await deleteResearchGroup(group.id);
          message.success('删除课题组成功');
          loadGroups();  // 重新加载课题组列表
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
            setEditingGroup(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          添加课题组
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={groups}
        rowKey="id"
      />

      <Modal
        title={editingGroup ? '编辑课题组' : '添加课题组'}
        open={isModalVisible}
        width={800}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingGroup(null);
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
            name="name"
            label="课题组名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="leaderId"
            label="负责人"
            rules={[{ required: true }]}
          >
            <Select>
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="direction"
            label="科研方向"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="memberIds"
            label="课题组成员"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="laboratoryIds"
            label="实验室"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              {laboratories.map(lab => (
                <Option key={lab.id} value={lab.id}>
                  {lab.name} - {lab.roomId} (安全等级: {lab.safetyLevel})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResearchGroupManagement; 