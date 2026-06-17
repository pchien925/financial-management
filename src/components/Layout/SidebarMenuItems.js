import { DollarOutlined, DashboardOutlined, TeamOutlined, PieChartOutlined } from "@ant-design/icons";
import { Children } from "react";

const SidebarMenuItems = [
    {
        key: 'submenu-finance',
        icon: <DollarOutlined />,
        label: 'Quản lý chi tiêu cá nhân',
        children: [
            {
                key: '/dashboard/finance',
                label: 'Thống kê chi tiêu'
            },
            {
                key: '/transactions',
                label: 'Chi tiêu'
            },
        ],
    },
    {
        key: 'submenu-users',
        icon: <TeamOutlined />,
        label: 'Quản lý người dùng',
        children: [
            {
                key: '/dashboard/user',
                label: 'Thống kê người dùng'
            },
            {
                key: '/users',
                label: 'Người dùng'
            },
        ]
    },
    {
        key: 'submenu-tasks',
        icon: <TeamOutlined />,
        label: 'Quản lý công việc',
        children : [
            {
                key: '/tasks',
                label: 'Công việc'
            },
            {
                key:'/taskboard',
                label: 'Bảng công việc'
            }
        ]
    }
]

export default SidebarMenuItems

