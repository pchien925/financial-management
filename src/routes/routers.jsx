import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import Finance from "../pages/Finance/finance";
import Dashboard from "../pages/Dashboard/Dashboard";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import User from "../pages/User/User";
import FinanceForm from "../pages/Finance/FinanceForm";
import UserForm from "../pages/User/UserForm";
import UserTransactions from "../pages/User/UserTransacitons";
import UserTransactionForm from "../pages/User/UserTransactionForm";
import Tasks from "../pages/Tasks/Tasks";
import UserTasks from "../pages/User/UserTasks";
import TaskBoard from "../pages/TaskBoard/TaskBoard";

const routers = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, 
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/finance" replace />
      },

      {
        path: 'dashboard',
        children: [
          {
            path: 'finance',
            element: <Dashboard />,
            handle: { title: 'Thống kê Tài Chính' }
          },
          {
            path: 'user',
            element: <UserDashboard />,
            handle: { title: 'Thống kê Người Dùng' }
          }
        ]
      },

      {
        path: 'transactions',
        handle: { title: 'Quản Lý Giao Dịch' },
        children: [
          {
            index: true,
            element: <Finance />
          },
          {
            path: 'add',
            element: <FinanceForm />,
            handle: { title: 'Thêm Giao Dịch' }
          },
          {
            path: 'edit/:id',
            element: <FinanceForm />,
            handle: { title: 'Chỉnh Sửa Giao Dịch' }
          }
        ]
      },

      {
        path: 'users',
        handle: { title: 'Quản lý người dùng' },
        children: [
          {
            index: true,
            element: <User />
          },
          {
            path: 'add',
            element: <UserForm />,
            handle: { title: 'Thêm người dùng' }
          },
          {
            path: 'edit/:id',
            element: <UserForm />,
            handle: { title: 'Chỉnh sửa người dùng' }
          },

          {
            path: ':id/details',
            handle: { title: 'Chi Tiêu Người Dùng' },
            children: [
              {
                index: true,
                element: <UserTransactions />
              },
              {
                path: 'add',
                element: <UserTransactionForm />,
                handle: { title: 'Thêm chi tiêu' }
              },
              {
                path: 'edit/:transactionId',
                element: <UserTransactionForm />,
                handle: { title: 'Chỉnh Sửa Chi Tiêu' }
              }
            ]
          },

          {
            path: ':id/tasks',
            element: <UserTasks />,
            handle: { title: 'Danh sách công việc' }
          }
        ]
      },

      {
        path: 'tasks',
        element: <Tasks />,
        handle: { title: 'Quản lý công việc' }
      },
      {
        path: 'taskboard',
        element: <TaskBoard />,
        handle: { title: 'Bảng công việc' }
      }
    ]
  }
]);

export default routers;