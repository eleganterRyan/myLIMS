import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  Select, message, Space, Tag, Descriptions 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyCertificateOutlined, QrcodeOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import type { Laboratory } from '../../types/research';
import { 
  createLaboratory, 
  getLaboratories, 
  updateLaboratory, 
  deleteLaboratory 
} from '../../services/laboratoryService';

const { TextArea } = Input;
const { Option } = Select;

const LaboratoryManagement: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLab, setEditingLab] = useState<Laboratory | null>(null);
  const [form] = Form.useForm();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);

  const columns = [
    {
      title: '房间名称',
      dataIndex: 'name',
    },
    {
      title: '房间ID',
      dataIndex: 'roomId',
    },
    {
      title: '安全分级',
      dataIndex: 'safetyLevel',
      render: (level: number) => (
        <Tag color={level > 3 ? 'red' : level > 2 ? 'orange' : 'green'}>
          {level} 级
        </Tag>
      ),
    },
    {
      title: '安全分类',
      dataIndex: 'safetyCategory',
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          '化学': 'orange',
          '生物': 'green',
          '物理': 'blue',
          '综合': 'purple'
        };
        return <Tag color={colorMap[category]}>{category}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Laboratory) => (
        <Space>
          <Button 
            type="link" 
            icon={<SafetyCertificateOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            icon={<QrcodeOutlined />}
            onClick={() => showQrCode(record)}
          >
            查看二维码
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

  const handleViewDetails = (lab: Laboratory) => {
    Modal.info({
      title: '实验室详情',
      width: 800,
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="房间名称">{lab.name}</Descriptions.Item>
          <Descriptions.Item label="房间ID">{lab.roomId}</Descriptions.Item>
          <Descriptions.Item label="安全分级">
            <Tag color={lab.safetyLevel > 3 ? 'red' : lab.safetyLevel > 2 ? 'orange' : 'green'}>
              {lab.safetyLevel} 级
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="安全分类">
            <Tag>{lab.safetyCategory}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="主要危险源" span={2}>
            {lab.hazardSources.map((source, index) => (
              <Tag key={index} color="red">{source}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="安全防护设施" span={2}>
            {lab.safetyFacilities.map((facility, index) => (
              <Tag key={index} color="blue">{facility}</Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  useEffect(() => {
    loadLaboratories();
  }, []);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(data);
    } catch (error) {
      message.error('加载实验室列表失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        hazardSources: values.hazardSources.split('\n').filter(Boolean),
        safetyFacilities: values.safetyFacilities.split('\n').filter(Boolean),
      };

      if (editingLab) {
        await updateLaboratory(editingLab.id, formData);
        message.success('更新实验室成功');
      } else {
        await createLaboratory(formData);
        message.success('创建实验室成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingLab(null);
      loadLaboratories();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (lab: Laboratory) => {
    setEditingLab(lab);
    form.setFieldsValue({
      ...lab,
      hazardSources: lab.hazardSources.join('\n'),
      safetyFacilities: lab.safetyFacilities.join('\n')
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (lab: Laboratory) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除实验室 ${lab.name} 吗？`,
      onOk: async () => {
        try {
          await deleteLaboratory(lab.id);
          message.success('删除实验室成功');
          loadLaboratories();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const generateLabInfoUrl = (lab: Laboratory) => {
    const baseUrl = 'https://43db-211-80-83-3.ngrok-free.app';
    const labInfo = encodeURIComponent(JSON.stringify({
      实验室名称: lab.name,
      房间编号: lab.roomId,
      安全等级: `${lab.safetyLevel}级`,
      安全分类: lab.safetyCategory,
      主要危险源: lab.hazardSources,
      安全防护设施: lab.safetyFacilities
    }));
    return `${baseUrl}/lab-info/${labInfo}`;
  };

  const showQrCode = (lab: Laboratory) => {
    setSelectedLab(lab);
    setQrCodeVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingLab(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          添加实验室
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={laboratories}
        rowKey="id"
      />

      <Modal
        title={editingLab ? '编辑实验室' : '添加实验室'}
        open={isModalVisible}
        width={800}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingLab(null);
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
            label="房间名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roomId"
            label="房间ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="safetyLevel"
            label="安全分级"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={5} />
          </Form.Item>
          <Form.Item
            name="safetyCategory"
            label="安全分类"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="化学">化学</Option>
              <Option value="生物">生物</Option>
              <Option value="物理">物理</Option>
              <Option value="综合">综合</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="hazardSources"
            label="主要危险源（每行一项）"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="safetyFacilities"
            label="安全防护设施（每行一项）"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="实验室二维码"
        open={qrCodeVisible}
        onCancel={() => setQrCodeVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrCodeVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedLab && (
          <div style={{ textAlign: 'center' }}>
            <h3>{selectedLab.name}</h3>
            <div style={{ margin: '20px 0' }}>
              <QRCodeSVG
                value={generateLabInfoUrl(selectedLab)}
                size={256}
                level="H"
                includeMargin
              />
            </div>
            <p>扫描二维码查看实验室详细信息</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LaboratoryManagement; 