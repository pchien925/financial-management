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
        index : true,
        element: <Navigate to="/dashboard/finance" replace />
      },
      {
        path: 'transactions',
        element: <Finance/>
      },
      {
        path: 'transactions/add',
        element: <FinanceForm/>
      },
      {
        path: 'transactions/edit/:id',
        element: <FinanceForm/>
      },
      {
        path: 'dashboard/finance',
        element: <Dashboard/>
      },
      {
        path: 'dashboard/user',
        element: <UserDashboard/>
      },
      {
        path: 'users',
        element: <User/>
      },
      {
        path: 'users/add',
        element: <UserForm/>
      },
      {
        path: 'users/edit/:id',
        element: <UserForm/>
      },
      {
        path: 'users/:id/details',
        element: <UserTransactions/>
      },
      {
        path: 'users/:userId/details/add',
        element: <UserTransactionForm/>
      },
      {
        path: 'users/:userId/details/edit/:transactionId',
        element: <UserTransactionForm/>
      },
      {
        path: 'users/:id/tasks',
        element: <UserTasks/>
      },
      {
        path: 'tasks',
        element: <Tasks/>
      },
      {
        path: '/taskboard',
        element: <TaskBoard/>
      }
    ]
  }
]);

export default routers;

