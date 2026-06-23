import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { TeamOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import styles from './UserDashboard.module.scss';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  tongSoNguoiDung: {
    defaultMessage: 'Tổng Số Người Dùng'
  },
  nguoi: {
    defaultMessage: 'người'
  },
  dangLamViec: {
    defaultMessage: 'Đang Làm Việc'
  },
  daNghiViec: {
    defaultMessage: 'Đã Nghỉ Việc'
  }
});


const UserStatCards = ({ total, active, inactive }) => {
  const intl = useIntl();
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.total}`} bordered={false}>
          <Statistic 
            title={intl.formatMessage(messages.tongSoNguoiDung)} 
            value={total} 
            prefix={<TeamOutlined />} 
            suffix={intl.formatMessage(messages.nguoi)} 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.active}`} bordered={false}>
          <Statistic 
            title={intl.formatMessage(messages.dangLamViec)} 
            value={active} 
            prefix={<UserAddOutlined />} 
            suffix={intl.formatMessage(messages.nguoi)} 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.inactive}`} bordered={false}>
          <Statistic 
            title={intl.formatMessage(messages.daNghiViec)} 
            value={inactive} 
            prefix={<UserDeleteOutlined />} 
            suffix={intl.formatMessage(messages.nguoi)} 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStatCards;
