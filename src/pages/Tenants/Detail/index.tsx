import type { Appointment, Consultation, Contract, Tenant } from '@/types';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ContactsOutlined,
  EditOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  MessageOutlined,
  PhoneOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Timeline,
} from 'antd';
import React, { useEffect, useState } from 'react';

const TenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 意向等级映射
  const intentionLevelMap = {
    high: { color: 'red', text: '高意向', bgColor: '#fff1f0' },
    medium: { color: 'orange', text: '中意向', bgColor: '#fff7e6' },
    low: { color: 'green', text: '低意向', bgColor: '#f6ffed' },
  };

  // 合同状态映射
  const contractStatusMap = {
    draft: { color: 'default', text: '草稿' },
    signed: { color: 'processing', text: '已签署' },
    active: { color: 'success', text: '生效中' },
    expired: { color: 'warning', text: '已到期' },
    terminated: { color: 'error', text: '已终止' },
  };

  // 模拟数据
  const mockTenant: Tenant = {
    id: id || '1',
    name: '张小明',
    phone: '138****1234',
    budget: 4500,
    preferredHouseType: '2室1厅',
    preferredLocation: '朝阳区',
    intentionLevel: 'high',
    createTime: '2024-01-15T10:30:00Z',
    updateTime: '2024-01-18T14:20:00Z',
  };

  const mockConsultations: Consultation[] = [
    {
      id: '1',
      tenantId: id || '1',
      tenantName: '张小明',
      content: '询问朝阳区2室1厅房源，预算4500左右，希望近期看房',
      contactType: 'phone',
      followUpTime: '2024-01-18T14:20:00Z',
      nextFollowUp: '2024-01-22T10:00:00Z',
      status: 'processing',
      createTime: '2024-01-18T14:20:00Z',
    },
    {
      id: '2',
      tenantId: id || '1',
      tenantName: '张小明',
      content: '对朝阳区某小区房源感兴趣，询问具体位置和配套设施',
      contactType: 'wechat',
      followUpTime: '2024-01-16T09:30:00Z',
      status: 'completed',
      createTime: '2024-01-16T09:30:00Z',
    },
  ];

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      tenantId: id || '1',
      tenantName: '张小明',
      tenantPhone: '138****1234',
      houseId: 'h1',
      houseAddress: '朝阳区某小区3号楼2单元801室',
      appointmentTime: '2024-01-20T14:00:00Z',
      status: 'confirmed',
      notes: '客户希望下午看房，请提前联系',
      createTime: '2024-01-18T16:20:00Z',
    },
  ];

  // 模拟合同数据
  const mockContracts: Contract[] = [
    {
      id: '1',
      houseId: 'h1',
      houseAddress: '朝阳区建国门外大街1号',
      tenantId: id || '1',
      tenantName: '张小明',
      rent: 4500,
      deposit: 9000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      paymentMethod: 'monthly',
      status: 'active',
      signDate: '2023-12-15T10:00:00.000Z',
      contractFile: '',
      createTime: '2023-12-15T10:00:00.000Z',
      updateTime: '2023-12-15T10:00:00.000Z',
    },
  ];

  // 获取客户详情数据
  const fetchTenantDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
      setTenant(mockTenant);
      setConsultations(mockConsultations);
      setAppointments(mockAppointments);
      setContracts(mockContracts);
    } catch (error) {
      message.error('获取客户详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantDetail();
  }, [id]);

  const handleEdit = () => {
    if (!tenant) return;
    form.setFieldsValue(tenant);
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      setTenant({ ...tenant!, ...values });
      message.success('更新成功');
      setEditModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const makeCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\*/g, '')}`);
    message.info(`正在拨打 ${phone}`);
  };

  const sendMessage = (name: string) => {
    message.info(`发送消息给 ${name}`);
  };

  if (!tenant) {
    return <div>加载中...</div>;
  }

  return (
    <PageContainer
      header={{
        title: (
          <Space>
            <Avatar
              size={48}
              icon={<UserOutlined />}
              style={{
                backgroundColor: intentionLevelMap[tenant.intentionLevel].color,
              }}
            />
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{tenant.name}</div>
              <div style={{ fontSize: 14, color: '#666' }}>客户详情</div>
            </div>
          </Space>
        ),
        breadcrumb: {},
        extra: [
          <Button
            key="call"
            icon={<PhoneOutlined />}
            onClick={() => makeCall(tenant.phone)}
            style={{ color: '#52c41a' }}
          >
            拨打电话
          </Button>,
          <Button
            key="message"
            icon={<MessageOutlined />}
            onClick={() => sendMessage(tenant.name)}
            style={{ color: '#1890ff' }}
          >
            发送消息
          </Button>,
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
          >
            返回
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            编辑信息
          </Button>,
        ],
      }}
      loading={loading}
    >
      <Row gutter={24}>
        <Col span={16}>
          {/* 基本信息 */}
          <Card
            title={
              <Space>
                <ContactsOutlined style={{ color: '#1890ff' }} />
                基本信息
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="客户姓名">
                <Space>
                  {tenant.name}
                  <Tag
                    color={intentionLevelMap[tenant.intentionLevel].color}
                    style={{
                      background:
                        intentionLevelMap[tenant.intentionLevel].bgColor,
                      border: `1px solid ${
                        intentionLevelMap[tenant.intentionLevel].color
                      }`,
                    }}
                  >
                    <StarOutlined />{' '}
                    {intentionLevelMap[tenant.intentionLevel].text}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  {tenant.phone}
                  <Button
                    type="link"
                    size="small"
                    icon={<PhoneOutlined />}
                    onClick={() => makeCall(tenant.phone)}
                  />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="租房预算">
                <span
                  style={{ color: '#fa541c', fontSize: 16, fontWeight: 600 }}
                >
                  ¥{tenant.budget.toLocaleString()}/月
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="偏好户型">
                <Tag color="blue">{tenant.preferredHouseType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="偏好位置">
                <Tag color="geekblue">{tenant.preferredLocation}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(tenant.createTime).toLocaleString('zh-CN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 合同记录 */}
          <Card
            title={
              <Space>
                <FileProtectOutlined style={{ color: '#fa541c' }} />
                合同记录
              </Space>
            }
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() =>
                  history.push(`/contracts/create?tenantId=${tenant.id}`)
                }
              >
                新建合同
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <Card
                  key={contract.id}
                  size="small"
                  style={{ marginBottom: 16 }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Row justify="space-between" align="middle">
                    <Col span={16}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 4,
                        }}
                      >
                        {contract.houseAddress}
                      </div>
                      <Space size={16}>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          租金:{' '}
                          <span
                            style={{ color: '#fa541c', fontWeight: 'bold' }}
                          >
                            ¥{contract.rent.toLocaleString()}/月
                          </span>
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          押金: ¥{contract.deposit.toLocaleString()}
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          期限: {contract.startDate} ~ {contract.endDate}
                        </div>
                      </Space>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Space direction="vertical" size={4}>
                        <Tag color={contractStatusMap[contract.status].color}>
                          {contractStatusMap[contract.status].text}
                        </Tag>
                        <Button
                          type="link"
                          size="small"
                          onClick={() =>
                            history.push(`/contracts/detail/${contract.id}`)
                          }
                        >
                          查看详情
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: 32 }}>
                暂无合同记录
              </div>
            )}
          </Card>

          {/* 咨询记录 */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                咨询记录
              </Space>
            }
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() =>
                  history.push(`/tenants/consultation?customerId=${tenant.id}`)
                }
              >
                查看全部
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <Timeline>
              {consultations.map((consultation) => (
                <Timeline.Item
                  key={consultation.id}
                  color={consultation.status === 'completed' ? 'green' : 'blue'}
                >
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}
                    >
                      <Badge
                        status={
                          consultation.contactType === 'phone'
                            ? 'processing'
                            : 'default'
                        }
                        text={
                          consultation.contactType === 'phone'
                            ? '电话咨询'
                            : '微信咨询'
                        }
                      />
                      <Tag
                        color={
                          consultation.status === 'completed'
                            ? 'green'
                            : 'orange'
                        }
                        style={{ marginLeft: 8 }}
                      >
                        {consultation.status === 'completed'
                          ? '已完成'
                          : '跟进中'}
                      </Tag>
                    </div>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      {consultation.content}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {new Date(consultation.followUpTime).toLocaleString(
                        'zh-CN',
                      )}
                      {consultation.nextFollowUp && (
                        <span style={{ marginLeft: 16, color: '#fa541c' }}>
                          下次跟进:{' '}
                          {new Date(consultation.nextFollowUp).toLocaleString(
                            'zh-CN',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {/* 预约记录 */}
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: '#722ed1' }} />
                预约记录
              </Space>
            }
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() =>
                  history.push(`/tenants/appointments?customerId=${tenant.id}`)
                }
              >
                查看全部
              </Button>
            }
          >
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                size="small"
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: 16 }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <div
                      style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}
                    >
                      {appointment.houseAddress}
                    </div>
                    <div style={{ color: '#666', fontSize: 12 }}>
                      预约时间:{' '}
                      {new Date(appointment.appointmentTime).toLocaleString(
                        'zh-CN',
                      )}
                    </div>
                    {appointment.notes && (
                      <div
                        style={{ color: '#999', fontSize: 12, marginTop: 4 }}
                      >
                        备注: {appointment.notes}
                      </div>
                    )}
                  </Col>
                  <Col>
                    <Tag
                      color={
                        appointment.status === 'confirmed' ? 'green' : 'orange'
                      }
                    >
                      {appointment.status === 'confirmed' ? '已确认' : '待确认'}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            ))}
          </Card>
        </Col>

        <Col span={8}>
          {/* 统计信息 */}
          <Card title="客户统计" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="咨询次数"
                  value={consultations.length}
                  valueStyle={{ color: '#3f8600' }}
                  suffix="次"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="预约次数"
                  value={appointments.length}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="次"
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="合同数量"
                  value={contracts.length}
                  valueStyle={{ color: '#fa541c' }}
                  suffix="份"
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="月度租金"
                  value={contracts.reduce((sum, c) => sum + c.rent, 0)}
                  valueStyle={{ color: '#1890ff' }}
                  prefix="¥"
                />
              </Col>
            </Row>
          </Card>

          {/* 快捷操作 */}
          <Card title="快捷操作" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                icon={<FileTextOutlined />}
                onClick={() =>
                  history.push(
                    `/tenants/consultation?customerId=${tenant.id}&action=add`,
                  )
                }
              >
                添加咨询记录
              </Button>
              <Button
                block
                icon={<CalendarOutlined />}
                onClick={() =>
                  history.push(
                    `/tenants/appointments?customerId=${tenant.id}&action=add`,
                  )
                }
              >
                创建预约
              </Button>
              <Button
                block
                icon={<FileProtectOutlined />}
                onClick={() =>
                  history.push(`/contracts/create?tenantId=${tenant.id}`)
                }
                type="primary"
              >
                创建合同
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑客户信息"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="客户姓名"
                name="name"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="租房预算"
                name="budget"
                rules={[{ required: true, message: '请输入租房预算' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="意向等级"
                name="intentionLevel"
                rules={[{ required: true, message: '请选择意向等级' }]}
              >
                <Select>
                  <Select.Option value="high">高意向</Select.Option>
                  <Select.Option value="medium">中意向</Select.Option>
                  <Select.Option value="low">低意向</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="偏好户型"
                name="preferredHouseType"
                rules={[{ required: true, message: '请选择偏好户型' }]}
              >
                <Select>
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
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TenantDetail;
