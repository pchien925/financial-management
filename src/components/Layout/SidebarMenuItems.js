import { defineMessages } from 'react-intl';
import { DollarOutlined, DashboardOutlined, TeamOutlined, PieChartOutlined } from "@ant-design/icons";

const messages = defineMessages({
  quanLyChiTieuCaNhan: {
    defaultMessage: 'Quản lý chi tiêu cá nhân'
  },
  thongKeChiTieu: {
    defaultMessage: 'Thống kê chi tiêu'
  },
  chiTieu: {
    defaultMessage: 'Chi tiêu'
  },
  quanLyNguoiDung: {
    defaultMessage: 'Quản lý người dùng'
  },
  thongKeNguoiDung: {
    defaultMessage: 'Thống kê người dùng'
  },
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  quanLyCongViec: {
    defaultMessage: 'Quản lý công việc'
  },
  congViec: {
    defaultMessage: 'Công việc'
  },
  bangCongViec: {
    defaultMessage: 'Bảng công việc'
  }
});


export const getSidebarMenuItems = (intl) => [
    {
        key: 'submenu-finance',
        icon: <DollarOutlined />,
        label: intl.formatMessage(messages.quanLyChiTieuCaNhan),
        children: [
            {
                key: '/dashboard/finance',
                label: intl.formatMessage(messages.thongKeChiTieu)
            },
            {
                key: '/transactions',
                label: intl.formatMessage(messages.chiTieu)
            },
        ],
    },
    {
        key: 'submenu-users',
        icon: <TeamOutlined />,
        label: intl.formatMessage(messages.quanLyNguoiDung),
        children: [
            {
                key: '/dashboard/user',
                label: intl.formatMessage(messages.thongKeNguoiDung)
            },
            {
                key: '/users',
                label: intl.formatMessage(messages.nguoiDung)
            },
        ]
    },
    {
        key: 'submenu-tasks',
        icon: <TeamOutlined />,
        label: intl.formatMessage(messages.quanLyCongViec),
        children : [
            {
                key: '/tasks',
                label: intl.formatMessage(messages.congViec)
            },
            {
                key:'/taskboard',
                label: intl.formatMessage(messages.bangCongViec)
            }
        ]
    }
];
