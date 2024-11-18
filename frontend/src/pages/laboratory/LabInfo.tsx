import React from 'react';
import { Card, Descriptions, Tag } from 'antd';
import { useParams } from 'react-router-dom';

const LabInfo: React.FC = () => {
  const { info } = useParams();
  const labInfo = info ? JSON.parse(decodeURIComponent(info)) : null;

  if (!labInfo) {
    return <div>未找到实验室信息</div>;
  }

  return (
    <div style={{ padding: '16px', maxWidth: '100%' }}>
      <Card title={labInfo.实验室名称} style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="房间编号">{labInfo.房间编号}</Descriptions.Item>
          <Descriptions.Item label="安全等级">
            <Tag color={
              labInfo.安全等级.replace('级', '') > 3 ? 'red' : 
              labInfo.安全等级.replace('级', '') > 2 ? 'orange' : 
              'green'
            }>
              {labInfo.安全等级}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="安全分类">
            <Tag>{labInfo.安全分类}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="主要危险源">
            {labInfo.主要危险源.map((source: string, index: number) => (
              <Tag key={index} color="red" style={{ margin: '2px' }}>{source}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="安全防护设施">
            {labInfo.安全防护设施.map((facility: string, index: number) => (
              <Tag key={index} color="blue" style={{ margin: '2px' }}>{facility}</Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default LabInfo; 