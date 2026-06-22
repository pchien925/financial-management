import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, AccountBookOutlined } from '@ant-design/icons';
import styles from './Dashboard.module.scss';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  tongThuNhap: {
    defaultMessage: 'Tổng Thu Nhập'
  },
  tongChiTieu: {
    defaultMessage: 'Tổng Chi Tiêu'
  },
  soDu: {
    defaultMessage: 'Số Dư'
  }
});


const DashBoardCard = ({ income, expense, balance }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.income}`} bordered={false}>
          <Statistic 
            title={<FormattedMessage {...messages.tongThuNhap}  />} 
            value={income} 
            prefix={<ArrowUpOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.expense}`} bordered={false}>
          <Statistic 
            title={<FormattedMessage {...messages.tongChiTieu}  />} 
            value={expense} 
            prefix={<ArrowDownOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.balance}`} bordered={false}>
          <Statistic 
            title={<FormattedMessage {...messages.soDu}  />} 
            value={balance} 
            prefix={<AccountBookOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashBoardCard;