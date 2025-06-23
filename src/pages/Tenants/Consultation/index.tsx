import {
  createConsultation,
  getConsultations,
  updateConsultation,
} from '@/services/consultations';
import type { Consultation } from '@/types';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Search } = Input;
const { TextArea } = Input;

const ConsultationPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get('customerId');
  const action = searchParams.get('action');

  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [contactTypeFilter, setContactTypeFilter] = useState<string>('');

  // 状态映射
  const statusMap = {
    pending: { color: 'orange', text: '待跟进', icon: <ClockCircleOutlined /> },
    processing: {
      color: 'blue',
      text: '跟进中',
      icon: <ExclamationCircleOutlined />,
    },
    completed: {
      color: 'green',
      text: '已完成',
      icon: <CheckCircleOutlined />,
    },
  };

  // 联系方式映射
  const contactTypeMap = {
    phone: { color: 'blue', text: '电话', icon: <PhoneOutlined /> },
    wechat: { color: 'green', text: '微信', icon: <MessageOutlined /> },
    visit: { color: 'purple', text: '到访', icon: <UserOutlined /> },
  };

  // 获取咨询数据
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (customerId) {
        params.tenantId = customerId;
      }
      const response = await getConsultations(params);

      if (response.success) {
        setConsultations(response.data.list || response.data);
      } else {
        message.error(response.message || '获取咨询记录失败');
      }
    } catch (error) {
      console.error('获取咨询记录失败:', error);
      message.error('获取咨询记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    // 如果有action=add参数，自动打开添加弹窗
    if (action === 'add') {
      setAddModalVisible(true);
    }
  }, []);

  const handleAdd = async (values: any) => {
    setLoading(true);
    try {
      const consultationData = {
        tenantId: customerId || values.tenantId || '',
        tenantName: values.tenantName || '新客户',
        content: values.content,
        contactType: values.contactType,
        followUpTime:
          values.followUpTime?.toISOString() || new Date().toISOString(),
        nextFollowUp: values.nextFollowUp?.toISOString(),
      };

      const response = await createConsultation(consultationData);

      if (response.success) {
        message.success('添加咨询记录成功');
        setAddModalVisible(false);
        form.resetFields();
        fetchConsultations(); // 重新获取列表
      } else {
        message.error(response.message || '添加失败');
      }
    } catch (error) {
      console.error('添加咨询记录失败:', error);
      message.error('添加失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Consultation) => {
    setSelectedConsultation(record);
    form.setFieldsValue({
      ...record,
      followUpTime: record.followUpTime
        ? dayjs(record.followUpTime)
        : undefined,
      nextFollowUp: record.nextFollowUp
        ? dayjs(record.nextFollowUp)
        : undefined,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedConsultation) return;

    setLoading(true);
    try {
      const updateData = {
        content: values.content,
        contactType: values.contactType,
        followUpTime: values.followUpTime?.toISOString(),
        nextFollowUp: values.nextFollowUp?.toISOString(),
        status: values.status,
      };

      const response = await updateConsultation(
        selectedConsultation.id,
        updateData,
      );

      if (response.success) {
        message.success('更新成功');
        setEditModalVisible(false);
        setSelectedConsultation(null);
        form.resetFields();
        fetchConsultations(); // 重新获取列表
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error) {
      console.error('更新咨询记录失败:', error);
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Consultation['status'],
  ) => {
    setLoading(true);
    try {
      const response = await updateConsultation(id, { status });

      if (response.success) {
        message.success('状态更新成功');
        fetchConsultations(); // 重新获取列表
      } else {
        message.error(response.message || '状态更新失败');
      }
    } catch (error) {
      console.error('状态更新失败:', error);
      message.error('状态更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filteredConsultations = consultations.filter((item) => {
    const matchKeyword =
      !searchKeyword ||
      item.tenantName.includes(searchKeyword) ||
      item.content.includes(searchKeyword);
    const matchStatus = !statusFilter || item.status === statusFilter;
    const matchContactType =
      !contactTypeFilter || item.contactType === contactTypeFilter;

    return matchKeyword && matchStatus && matchContactType;
  });

  const columns = [
    {
      title: '客户信息',
      key: 'tenant',
      width: 150,
      render: (record: Consultation) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>
              {record.tenantName}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {contactTypeMap[record.contactType].icon}
              <span style={{ marginLeft: 4 }}>
                {contactTypeMap[record.contactType].text}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '咨询内容',
      key: 'content',
      render: (record: Consultation) => (
        <div>
          <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
            {record.content.length > 100
              ? `${record.content.substring(0, 100)}...`
              : record.content}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            跟进时间: {new Date(record.followUpTime).toLocaleString('zh-CN')}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (record: Consultation) => {
        const status = statusMap[record.status];
        return (
          <Badge
            status={
              record.status === 'completed'
                ? 'success'
                : record.status === 'processing'
                ? 'processing'
                : 'warning'
            }
            text={
              <span style={{ color: status.color }}>
                {status.icon}
                <span style={{ marginLeft: 4 }}>{status.text}</span>
              </span>
            }
          />
        );
      },
    },
    {
      title: '下次跟进',
      key: 'nextFollowUp',
      width: 150,
      render: (record: Consultation) => {
        if (!record.nextFollowUp) return '-';

        const nextDate = new Date(record.nextFollowUp);
        const now = new Date();
        const isOverdue = nextDate < now;

        return (
          <div style={{ color: isOverdue ? '#ff4d4f' : '#666' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {nextDate.toLocaleString('zh-CN')}
            {isOverdue && (
              <div style={{ fontSize: 12, color: '#ff4d4f' }}>已逾期</div>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: Consultation) => (
        <Space size={4}>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>

          {record.status !== 'completed' && (
            <Tooltip title="标记为已完成">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'completed')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}

          <Tooltip title="查看客户详情">
            <Button
              type="text"
              onClick={() => history.push(`/tenants/detail/${record.tenantId}`)}
              style={{ color: '#722ed1' }}
            >
              详情
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: customerId ? '客户咨询记录' : '咨询跟进',
        subTitle: customerId
          ? '管理指定客户的咨询记录'
          : '管理所有客户的咨询跟进记录',
        breadcrumb: {},
      }}
    >
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            咨询记录
          </Space>
        }
        extra={
          <Space>
            <Search
              placeholder="搜索客户姓名或咨询内容"
              allowClear
              style={{ width: 220 }}
              prefix={<SearchOutlined />}
              onSearch={setSearchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: '待跟进', value: 'pending' },
                { label: '跟进中', value: 'processing' },
                { label: '已完成', value: 'completed' },
              ]}
            />
            <Select
              placeholder="联系方式"
              allowClear
              style={{ width: 120 }}
              value={contactTypeFilter}
              onChange={setContactTypeFilter}
              options={[
                { label: '电话', value: 'phone' },
                { label: '微信', value: 'wechat' },
                { label: '到访', value: 'visit' },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              添加咨询记录
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredConsultations}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredConsultations.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 添加咨询记录弹窗 */}
      <Modal
        title="添加咨询记录"
        open={addModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            followUpTime: dayjs(),
            status: 'pending',
            contactType: 'phone',
          }}
        >
          <Row gutter={16}>
            {!customerId && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="客户姓名"
                    name="tenantName"
                    rules={[{ required: true, message: '请输入客户姓名' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="客户ID"
                    name="tenantId"
                    rules={[{ required: true, message: '请输入客户ID' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={12}>
              <Form.Item
                label="联系方式"
                name="contactType"
                rules={[{ required: true, message: '请选择联系方式' }]}
              >
                <Select>
                  <Select.Option value="phone">电话</Select.Option>
                  <Select.Option value="wechat">微信</Select.Option>
                  <Select.Option value="visit">到访</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="跟进状态"
                name="status"
                rules={[{ required: true, message: '请选择跟进状态' }]}
              >
                <Select>
                  <Select.Option value="pending">待跟进</Select.Option>
                  <Select.Option value="processing">跟进中</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="咨询内容"
            name="content"
            rules={[{ required: true, message: '请输入咨询内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述客户的咨询内容、需求等信息..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="跟进时间"
                name="followUpTime"
                rules={[{ required: true, message: '请选择跟进时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下次跟进时间" name="nextFollowUp">
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑咨询记录弹窗 */}
      <Modal
        title="编辑咨询记录"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedConsultation(null);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="联系方式"
                name="contactType"
                rules={[{ required: true, message: '请选择联系方式' }]}
              >
                <Select>
                  <Select.Option value="phone">电话</Select.Option>
                  <Select.Option value="wechat">微信</Select.Option>
                  <Select.Option value="visit">到访</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="跟进状态"
                name="status"
                rules={[{ required: true, message: '请选择跟进状态' }]}
              >
                <Select>
                  <Select.Option value="pending">待跟进</Select.Option>
                  <Select.Option value="processing">跟进中</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="咨询内容"
            name="content"
            rules={[{ required: true, message: '请输入咨询内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述客户的咨询内容、需求等信息..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="跟进时间"
                name="followUpTime"
                rules={[{ required: true, message: '请选择跟进时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下次跟进时间" name="nextFollowUp">
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ConsultationPage;
