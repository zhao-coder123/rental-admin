import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
  StarOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Steps,
  Upload,
} from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

const AddTenant: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const steps = [
    {
      title: '基本信息',
      icon: <UserOutlined />,
      description: '填写客户基本信息',
    },
    {
      title: '需求信息',
      icon: <HomeOutlined />,
      description: '填写租房需求',
    },
    {
      title: '完成',
      icon: <CheckCircleOutlined />,
      description: '确认并创建客户',
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      message.success('客户创建成功！');
      setTimeout(() => {
        history.push('/tenants/list');
      }, 1500);
    } catch (error) {
      message.error('创建失败');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch(() => {
        message.error('请完善当前步骤的信息');
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                基本信息
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={avatarUrl}
                    style={{ marginBottom: 16 }}
                  />
                  <div>
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      onChange={handleAvatarChange}
                    >
                      <Button icon={<UploadOutlined />}>上传头像</Button>
                    </Upload>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="客户姓名"
                  name="name"
                  rules={[
                    { required: true, message: '请输入客户姓名' },
                    { min: 2, message: '姓名至少2个字符' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入客户真实姓名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="联系电话"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: '请输入正确的手机号码',
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="请输入11位手机号码"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case 1:
        return (
          <Card
            title={
              <Space>
                <HomeOutlined style={{ color: '#52c41a' }} />
                租房需求
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="租房预算"
                  name="budget"
                  rules={[
                    { required: true, message: '请输入租房预算' },
                    { type: 'number', min: 500, message: '预算不能少于500元' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    prefix={<DollarOutlined />}
                    formatter={(value) =>
                      `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    placeholder="请输入月租预算"
                    addonAfter="元/月"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="意向等级"
                  name="intentionLevel"
                  rules={[{ required: true, message: '请选择意向等级' }]}
                >
                  <Select size="large" placeholder="请选择客户意向等级">
                    <Select.Option value="high">
                      <Space>
                        <StarOutlined style={{ color: '#ff4d4f' }} />
                        高意向 - 急需租房
                      </Space>
                    </Select.Option>
                    <Select.Option value="medium">
                      <Space>
                        <StarOutlined style={{ color: '#fa8c16' }} />
                        中意向 - 有租房计划
                      </Space>
                    </Select.Option>
                    <Select.Option value="low">
                      <Space>
                        <StarOutlined style={{ color: '#52c41a' }} />
                        低意向 - 了解阶段
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="偏好户型"
                  name="preferredHouseType"
                  rules={[{ required: true, message: '请选择偏好户型' }]}
                >
                  <Select size="large" placeholder="请选择户型">
                    <Select.Option value="1室1厅">1室1厅</Select.Option>
                    <Select.Option value="2室1厅">2室1厅</Select.Option>
                    <Select.Option value="2室2厅">2室2厅</Select.Option>
                    <Select.Option value="3室1厅">3室1厅</Select.Option>
                    <Select.Option value="3室2厅">3室2厅</Select.Option>
                    <Select.Option value="4室2厅">4室2厅</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="偏好位置"
                  name="preferredLocation"
                  rules={[{ required: true, message: '请输入偏好位置' }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    size="large"
                    placeholder="如：朝阳区、海淀区等"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="备注信息" name="notes">
              <TextArea
                rows={4}
                placeholder="客户的特殊需求、偏好、工作地点等其他信息..."
                style={{ fontSize: 14 }}
              />
            </Form.Item>
          </Card>
        );

      case 2:
        return (
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                确认信息
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={avatarUrl}
                style={{ marginBottom: 16 }}
              />
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {form.getFieldValue('name')}
              </div>
              <div style={{ color: '#666', marginBottom: 24 }}>
                {form.getFieldValue('phone')}
              </div>

              <Row gutter={24}>
                <Col span={12}>
                  <div
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bae7ff',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        color: '#1890ff',
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      租房预算
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#fa541c',
                      }}
                    >
                      ¥{form.getFieldValue('budget')?.toLocaleString()}/月
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      background: '#f6ffed',
                      border: '1px solid #b7eb8f',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        color: '#52c41a',
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      意向等级
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>
                      {form.getFieldValue('intentionLevel') === 'high' &&
                        '高意向'}
                      {form.getFieldValue('intentionLevel') === 'medium' &&
                        '中意向'}
                      {form.getFieldValue('intentionLevel') === 'low' &&
                        '低意向'}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      偏好户型
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>
                      {form.getFieldValue('preferredHouseType')}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      偏好位置
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>
                      {form.getFieldValue('preferredLocation')}
                    </div>
                  </div>
                </Col>
              </Row>

              {form.getFieldValue('notes') && (
                <div style={{ marginTop: 24, textAlign: 'left' }}>
                  <div style={{ color: '#666', marginBottom: 8 }}>备注信息</div>
                  <div
                    style={{
                      background: '#fafafa',
                      padding: 12,
                      borderRadius: 6,
                      lineHeight: 1.6,
                      border: '1px solid #d9d9d9',
                    }}
                  >
                    {form.getFieldValue('notes')}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    return (
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Space size="large">
          {currentStep > 0 && (
            <Button size="large" onClick={prevStep}>
              上一步
            </Button>
          )}

          {currentStep < steps.length - 1 && (
            <Button type="primary" size="large" onClick={nextStep}>
              下一步
            </Button>
          )}

          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={() => form.submit()}
              style={{ minWidth: 120 }}
            >
              {loading ? '创建中...' : '创建客户'}
            </Button>
          )}
        </Space>
      </div>
    );
  };

  return (
    <PageContainer
      header={{
        title: '添加客户',
        subTitle: '创建新的客户信息档案',
        breadcrumb: {},
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
          >
            返回
          </Button>,
        ],
      }}
      style={{ background: '#f5f7fa' }}
    >
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 32 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          {renderStepContent()}
          {renderStepButtons()}
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddTenant;
