import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select,
  message 
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { SafetyTask } from '../../types/safety';
import { createSafetyTask, getSafetyTasks } from '../../services/safetyService';
import { getUsersByRole } from '../../services/userService';

const { TextArea } = Input;

const SafetyInspection: React.FC = () => {
  const [tasks, setTasks] = useState<SafetyTask[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inspectors, setInspectors] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTasks();
    loadInspectors();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getSafetyTasks();
      setTasks(data);
    } catch (error) {
      message.error('加载任务列表失败');
    }
  };

  const loadInspectors = async () => {
    try {
      console.log('Loading inspectors...');
      const staffUsers = await getUsersByRole('staff');
      console.log('Loaded inspectors:', staffUsers);
      setInspectors(staffUsers);
    } catch (error) {
      console.error('Failed to load inspectors:', error);
      message.error('加载检查人列表失败');
    }
  };

  const columns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '检查人',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: '待执行',
          in_progress: '进行中',
          completed: '已完成'
        };
        return statusMap[status as keyof typeof statusMap];
      }
    },
    {
      title: '计划时间',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SafetyTask) => (
        <Space>
          <Button type="link" onClick={() => handleStartInspection(record)}>
            开始检查
          </Button>
          <Button type="link" onClick={() => handleViewReport(record)}>
            查看报告
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateTask = async (values: any) => {
    try {
      const formData = {
        title: values.title,
        description: values.description,
        inspector: values.inspector,
        scheduledAt: values.scheduledAt.toISOString()
      };

      await createSafetyTask(formData);
      message.success('创建任务成功');
      setIsModalVisible(false);
      form.resetFields();
      loadTasks();
    } catch (error: any) {
      console.error('Create task error:', error);
      message.error(error.response?.data?.message || '创建任务失败');
    }
  };

  const handleStartInspection = (task: SafetyTask) => {
    // TODO: 实现开始检查逻辑
  };

  const handleViewReport = (task: SafetyTask) => {
    // TODO: 实现查看报告逻辑
  };

  return (
    <div>
      <Card
        title="安全巡检"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            创建检查任务
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={tasks}
          rowKey="id"
        />
      </Card>

      <Modal
        title="创建安全检查任务"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="任务描述"
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="inspector"
            label="检查人"
            rules={[{ required: true, message: '请选择检查人' }]}
          >
            <Select>
              {inspectors.map(inspector => (
                <Select.Option 
                  key={inspector.id} 
                  value={inspector.username}
                >
                  {inspector.name} ({inspector.username})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="scheduledAt"
            label="计划检查时间"
            rules={[{ required: true, message: '请选择计划检查时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SafetyInspection; 