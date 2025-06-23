import {
  Appointment,
  createAppointment,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from '@/services/appointments';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Timeline,
  Tooltip,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Search } = Input;
const { TextArea } = Input;

const AppointmentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const action = searchParams.get('action');

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [activeTab, setActiveTab] = useState('list');

  // 状态映射
  const statusMap = {
    pending: { color: 'orange', text: '待确认', bgColor: '#fff7e6' },
    confirmed: { color: 'blue', text: '已确认', bgColor: '#e6f7ff' },
    completed: { color: 'green', text: '已完成', bgColor: '#f6ffed' },
    cancelled: { color: 'red', text: '已取消', bgColor: '#fff1f0' },
  };

  // 获取预约数据
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (customerId) {
        params.tenantId = customerId;
      }
      const response = await getAppointments(params);

      if (response.success) {
        setAppointments(response.data.list || response.data);
      } else {
        message.error(response.message || '获取预约记录失败');
      }
    } catch (error) {
      console.error('获取预约记录失败:', error);
      message.error('获取预约记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // 如果有action=add参数，自动打开添加弹窗
    if (action === 'add') {
      setAddModalVisible(true);
    }
  }, []);

  const handleAdd = async (values: any) => {
    setLoading(true);
    try {
      // 数据验证
      if (
        !values.tenantName ||
        !values.houseAddress ||
        !values.appointmentTime
      ) {
        message.error('请填写必要信息');
        return;
      }

      const appointmentData = {
        tenantId: customerId || values.tenantId || '',
        tenantName: values.tenantName,
        tenantPhone: values.tenantPhone || '未提供',
        houseId: values.houseId || '',
        houseAddress: values.houseAddress,
        appointmentTime:
          values.appointmentTime?.toISOString() || new Date().toISOString(),
        notes: values.notes || '',
      };

      const response = await createAppointment(appointmentData);

      if (response.success) {
        message.success('创建预约成功');
        setAddModalVisible(false);
        form.resetFields();
        fetchAppointments(); // 重新获取列表
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error) {
      console.error('创建预约失败:', error);
      message.error('创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Appointment) => {
    setSelectedAppointment(record);
    form.setFieldsValue({
      ...record,
      appointmentTime: record.appointmentTime
        ? dayjs(record.appointmentTime)
        : undefined,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedAppointment) return;

    setLoading(true);
    try {
      const updateData = {
        tenantName: values.tenantName,
        tenantPhone: values.tenantPhone,
        houseAddress: values.houseAddress,
        appointmentTime: values.appointmentTime?.toISOString(),
        notes: values.notes,
      };

      const response = await updateAppointment(
        selectedAppointment.id,
        updateData,
      );

      if (response.success) {
        message.success('更新成功');
        setEditModalVisible(false);
        setSelectedAppointment(null);
        form.resetFields();
        fetchAppointments(); // 重新获取列表
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error) {
      console.error('更新预约失败:', error);
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Appointment['status'],
  ) => {
    setLoading(true);
    try {
      const response = await updateAppointmentStatus(id, status);

      if (response.success) {
        message.success('状态更新成功');
        fetchAppointments(); // 重新获取列表
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

  const handleViewDetail = (record: Appointment) => {
    setSelectedAppointment(record);
    setDetailModalVisible(true);
  };

  // 过滤数据
  const filteredAppointments = appointments.filter((item) => {
    const matchKeyword =
      !searchKeyword ||
      item.tenantName.includes(searchKeyword) ||
      item.houseAddress.includes(searchKeyword);
    const matchStatus = !statusFilter || item.status === statusFilter;

    return matchKeyword && matchStatus;
  });

  // 获取日历数据
  const getCalendarData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(
      (apt) => dayjs(apt.appointmentTime).format('YYYY-MM-DD') === dateStr,
    );

    return dayAppointments;
  };

  const dateCellRender = (value: Dayjs) => {
    const appointments = getCalendarData(value);
    if (appointments.length === 0) return null;

    return (
      <div style={{ fontSize: 12 }}>
        {appointments.slice(0, 2).map((apt) => (
          <div
            key={apt.id}
            style={{
              background: statusMap[apt.status].bgColor,
              border: `1px solid ${statusMap[apt.status].color}`,
              borderRadius: 3,
              padding: '1px 4px',
              marginBottom: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: statusMap[apt.status].color, fontSize: 10 }}>
              {dayjs(apt.appointmentTime).format('HH:mm')} {apt.tenantName}
            </span>
          </div>
        ))}
        {appointments.length > 2 && (
          <div style={{ color: '#999', fontSize: 10 }}>
            +{appointments.length - 2} 更多
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: '客户信息',
      key: 'tenant',
      width: 150,
      render: (record: Appointment) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>
              {record.tenantName}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.tenantPhone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '房源信息',
      key: 'house',
      render: (record: Appointment) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            <HomeOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {record.houseAddress}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            房源ID: {record.houseId}
          </div>
        </div>
      ),
    },
    {
      title: '预约时间',
      key: 'appointmentTime',
      width: 160,
      render: (record: Appointment) => {
        const appointmentDate = new Date(record.appointmentTime);
        const now = new Date();
        const isPast = appointmentDate < now;

        return (
          <div>
            <div
              style={{
                fontWeight: 500,
                color: isPast ? '#999' : '#1890ff',
                marginBottom: 4,
              }}
            >
              <CalendarOutlined style={{ marginRight: 4 }} />
              {appointmentDate.toLocaleDateString('zh-CN')}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {appointmentDate.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (record: Appointment) => {
        const status = statusMap[record.status];
        return (
          <Badge
            status={
              record.status === 'completed'
                ? 'success'
                : record.status === 'confirmed'
                ? 'processing'
                : record.status === 'cancelled'
                ? 'error'
                : 'warning'
            }
            text={<span style={{ color: status.color }}>{status.text}</span>}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (record: Appointment) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ color: '#722ed1' }}
            />
          </Tooltip>

          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>

          {record.status === 'pending' && (
            <Tooltip title="确认预约">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'confirmed')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}

          {record.status === 'confirmed' && (
            <Tooltip title="标记完成">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'completed')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}

          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Tooltip title="取消预约">
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'cancelled')}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}

          <Tooltip title="查看客户详情">
            <Button
              type="text"
              onClick={() => history.push(`/tenants/detail/${record.tenantId}`)}
              style={{ color: '#13c2c2' }}
            >
              客户
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: customerId ? '客户预约记录' : '预约看房',
        subTitle: customerId
          ? '管理指定客户的预约记录'
          : '管理所有客户的看房预约',
        breadcrumb: {},
      }}
    >
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="搜索客户姓名或房源地址"
              allowClear
              style={{ width: 200 }}
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
                { label: '待确认', value: 'pending' },
                { label: '已确认', value: 'confirmed' },
                { label: '已完成', value: 'completed' },
                { label: '已取消', value: 'cancelled' },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              创建预约
            </Button>
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'list',
              label: '列表视图',
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredAppointments}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: filteredAppointments.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
                  }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
            {
              key: 'calendar',
              label: '日历视图',
              children: (
                <div>
                  <Calendar
                    mode="month"
                    value={selectedDate}
                    onSelect={setSelectedDate}
                    dateCellRender={dateCellRender}
                    headerRender={({ value, onChange }) => (
                      <div style={{ padding: 8 }}>
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space>
                              <Button
                                onClick={() =>
                                  onChange(value.subtract(1, 'month'))
                                }
                              >
                                上个月
                              </Button>
                              <span style={{ fontSize: 16, fontWeight: 500 }}>
                                {value.format('YYYY年MM月')}
                              </span>
                              <Button
                                onClick={() => onChange(value.add(1, 'month'))}
                              >
                                下个月
                              </Button>
                            </Space>
                          </Col>
                          <Col>
                            <Button
                              type="primary"
                              onClick={() => onChange(dayjs())}
                            >
                              今天
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  />

                  {/* 选中日期的预约详情 */}
                  <Card
                    title={`${selectedDate.format('YYYY年MM月DD日')} 的预约`}
                    style={{ marginTop: 16 }}
                  >
                    {getCalendarData(selectedDate).length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          color: '#999',
                          padding: 40,
                        }}
                      >
                        该日期暂无预约
                      </div>
                    ) : (
                      <Timeline>
                        {getCalendarData(selectedDate)
                          .sort(
                            (a, b) =>
                              new Date(a.appointmentTime).getTime() -
                              new Date(b.appointmentTime).getTime(),
                          )
                          .map((apt) => (
                            <Timeline.Item
                              key={apt.id}
                              color={statusMap[apt.status].color}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                  }}
                                >
                                  {dayjs(apt.appointmentTime).format('HH:mm')} -{' '}
                                  {apt.tenantName}
                                </div>
                                <div style={{ color: '#666', marginBottom: 4 }}>
                                  <HomeOutlined style={{ marginRight: 4 }} />
                                  {apt.houseAddress}
                                </div>
                                <div style={{ marginBottom: 4 }}>
                                  <Badge
                                    status={
                                      apt.status === 'completed'
                                        ? 'success'
                                        : apt.status === 'confirmed'
                                        ? 'processing'
                                        : apt.status === 'cancelled'
                                        ? 'error'
                                        : 'warning'
                                    }
                                    text={statusMap[apt.status].text}
                                  />
                                </div>
                                {apt.notes && (
                                  <div style={{ fontSize: 12, color: '#999' }}>
                                    备注: {apt.notes}
                                  </div>
                                )}
                              </div>
                            </Timeline.Item>
                          ))}
                      </Timeline>
                    )}
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 创建预约弹窗 */}
      <Modal
        title="创建预约"
        open={addModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            appointmentTime: dayjs().add(1, 'day').hour(14).minute(0),
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
                    label="客户电话"
                    name="tenantPhone"
                    rules={[{ required: true, message: '请输入客户电话' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={12}>
              <Form.Item
                label="房源ID"
                name="houseId"
                rules={[{ required: true, message: '请输入房源ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="预约时间"
                name="appointmentTime"
                rules={[{ required: true, message: '请选择预约时间' }]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf('day')
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="房源地址"
            name="houseAddress"
            rules={[{ required: true, message: '请输入房源地址' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="备注" name="notes">
            <TextArea rows={3} placeholder="预约相关备注信息..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑预约弹窗 */}
      <Modal
        title="编辑预约"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedAppointment(null);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
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
                label="客户电话"
                name="tenantPhone"
                rules={[{ required: true, message: '请输入客户电话' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="房源ID"
                name="houseId"
                rules={[{ required: true, message: '请输入房源ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="预约时间"
                name="appointmentTime"
                rules={[{ required: true, message: '请选择预约时间' }]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="房源地址"
            name="houseAddress"
            rules={[{ required: true, message: '请输入房源地址' }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="预约状态"
                name="status"
                rules={[{ required: true, message: '请选择预约状态' }]}
              >
                <Select>
                  <Select.Option value="pending">待确认</Select.Option>
                  <Select.Option value="confirmed">已确认</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                  <Select.Option value="cancelled">已取消</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="备注" name="notes">
            <TextArea rows={3} placeholder="预约相关备注信息..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 预约详情弹窗 */}
      <Modal
        title="预约详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedAppointment(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          selectedAppointment && (
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                setDetailModalVisible(false);
                handleEdit(selectedAppointment);
              }}
            >
              编辑
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedAppointment && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <strong>客户信息</strong>
                </div>
                <div style={{ fontSize: 16, marginBottom: 4 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {selectedAppointment.tenantName}
                </div>
                <div style={{ color: '#666' }}>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {selectedAppointment.tenantPhone}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <strong>预约状态</strong>
                </div>
                <Badge
                  status={
                    selectedAppointment.status === 'completed'
                      ? 'success'
                      : selectedAppointment.status === 'confirmed'
                      ? 'processing'
                      : selectedAppointment.status === 'cancelled'
                      ? 'error'
                      : 'warning'
                  }
                  text={
                    <span
                      style={{
                        color: statusMap[selectedAppointment.status].color,
                        fontSize: 16,
                      }}
                    >
                      {statusMap[selectedAppointment.status].text}
                    </span>
                  }
                />
              </Col>
            </Row>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>房源信息</strong>
              </div>
              <div style={{ fontSize: 16, marginBottom: 4 }}>
                <HomeOutlined style={{ marginRight: 8 }} />
                {selectedAppointment.houseAddress}
              </div>
              <div style={{ color: '#666' }}>
                房源ID: {selectedAppointment.houseId}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>预约时间</strong>
              </div>
              <div style={{ fontSize: 16 }}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                {new Date(selectedAppointment.appointmentTime).toLocaleString(
                  'zh-CN',
                )}
              </div>
            </div>

            {selectedAppointment.notes && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>备注信息</strong>
                </div>
                <div
                  style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 6,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedAppointment.notes}
                </div>
              </div>
            )}

            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>创建信息</strong>
              </div>
              <div style={{ color: '#666', fontSize: 12 }}>
                创建时间:{' '}
                {new Date(selectedAppointment.createTime).toLocaleString(
                  'zh-CN',
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AppointmentsPage;
