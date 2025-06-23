import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Descriptions, Image, Space, Tag } from 'antd';
import React from 'react';

const HouseDetail: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '房源详情',
        breadcrumb: {},
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
          >
            返回
          </Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />}>
            编辑
          </Button>,
        ],
      }}
    >
      <Card title="房源信息">
        <Descriptions column={2}>
          <Descriptions.Item label="房源地址">
            北京市朝阳区三里屯SOHO
          </Descriptions.Item>
          <Descriptions.Item label="户型">2室1厅</Descriptions.Item>
          <Descriptions.Item label="面积">88㎡</Descriptions.Item>
          <Descriptions.Item label="租金">¥4500/月</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color="green">待租</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            2024-01-10 09:00:00
          </Descriptions.Item>
          <Descriptions.Item label="基础设施" span={2}>
            <Space wrap>
              <Tag>空调</Tag>
              <Tag>洗衣机</Tag>
              <Tag>冰箱</Tag>
              <Tag>WiFi</Tag>
              <Tag>停车位</Tag>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="房源描述" span={2}>
            精装修两居室，位于三里屯核心区域，交通便利，周边配套齐全。
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="房源图片" style={{ marginTop: 16 }}>
        <Space wrap>
          <Image
            width={200}
            height={150}
            src="/placeholder.jpg"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default HouseDetail;
