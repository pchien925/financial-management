import { createBrowserRouter, Navigate } from "react-router-dom";
import { defineMessages } from "react-intl";
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

const messages = defineMessages({
  financeStats: { defaultMessage: 'Thống kê Tài Chính' },
  userStats: { defaultMessage: 'Thống kê Người Dùng' },
  manageTransactions: { defaultMessage: 'Quản Lý Giao Dịch' },
  addTransaction: { defaultMessage: 'Thêm Giao Dịch' },
  editTransaction: { defaultMessage: 'Chỉnh Sửa Giao Dịch' },
  manageUsers: { defaultMessage: 'Quản lý người dùng' },
  addUser: { defaultMessage: 'Thêm người dùng' },
  editUser: { defaultMessage: 'Chỉnh sửa người dùng' },
  userSpendings: { defaultMessage: 'Chi Tiêu Người Dùng' },
  addSpending: { defaultMessage: 'Thêm chi tiêu' },
  editSpending: { defaultMessage: 'Chỉnh Sửa Chi Tiêu' },
  userTasks: { defaultMessage: 'Danh sách công việc' },
  manageTasks: { defaultMessage: 'Quản lý công việc' },
  taskBoard: { defaultMessage: 'Bảng công việc' },
});

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
            handle: { title: messages.financeStats }
          },
          {
            path: 'user',
            element: <UserDashboard />,
            handle: { title: messages.userStats }
          }
        ]
      },

      {
        path: 'transactions',
        handle: { title: messages.manageTransactions },
        children: [
          {
            index: true,
            element: <Finance />
          },
          {
            path: 'add',
            element: <FinanceForm />,
            handle: { title: messages.addTransaction }
          },
          {
            path: 'edit/:id',
            element: <FinanceForm />,
            handle: { title: messages.editTransaction }
          }
        ]
      },

      {
        path: 'users',
        handle: { title: messages.manageUsers },
        children: [
          {
            index: true,
            element: <User />
          },
          {
            path: 'add',
            element: <UserForm />,
            handle: { title: messages.addUser }
          },
          {
            path: 'edit/:id',
            element: <UserForm />,
            handle: { title: messages.editUser }
          },

          {
            path: ':id/details',
            handle: { title: messages.userSpendings },
            children: [
              {
                index: true,
                element: <UserTransactions />
              },
              {
                path: 'add',
                element: <UserTransactionForm />,
                handle: { title: messages.addSpending }
              },
              {
                path: 'edit/:transactionId',
                element: <UserTransactionForm />,
                handle: { title: messages.editSpending }
              }
            ]
          },

          {
            path: ':id/tasks',
            element: <UserTasks />,
            handle: { title: messages.userTasks }
          }
        ]
      },

      {
        path: 'tasks',
        element: <Tasks />,
        handle: { title: messages.manageTasks }
      },
      {
        path: 'taskboard',
        element: <TaskBoard />,
        handle: { title: messages.taskBoard }
      }
    ]
  }
]);

export default routers;