import { DollarOutlined, DashboardOutlined, TeamOutlined, PieChartOutlined } from "@ant-design/icons";

const SidebarMenuItems = [
    {
        key: '/dashboard/finance',
        icon: <DashboardOutlined />,
        label: 'Thống kê chi tiêu'
    },
    {
        key: '/dashboard/user',
        icon: <PieChartOutlined />,
        label: 'Thống kê người dùng'
    },
    {
        key: '/transactions',
        icon: <DollarOutlined />,
        label: 'Quản lý chi tiêu cá nhân'
    },
    {
        key: '/users',
        icon: <TeamOutlined />,
        label: 'Quản lý người dùng'
    }
]

export default SidebarMenuItems

