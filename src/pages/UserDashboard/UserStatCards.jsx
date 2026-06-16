import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { TeamOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import styles from './UserDashboard.module.scss';

const UserStatCards = ({ total, active, inactive }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.total}`} bordered={false}>
          <Statistic 
            title="Tổng Số Người Dùng" 
            value={total} 
            prefix={<TeamOutlined />} 
            suffix="người" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.active}`} bordered={false}>
          <Statistic 
            title="Đang Làm Việc" 
            value={active} 
            prefix={<UserAddOutlined />} 
            suffix="người" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.inactive}`} bordered={false}>
          <Statistic 
            title="Đã Nghỉ Việc" 
            value={inactive} 
            prefix={<UserDeleteOutlined />} 
            suffix="người" 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStatCards;
