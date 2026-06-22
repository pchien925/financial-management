import logo from './logo.svg';
import './App.css';
import AppLayout from './components/Layout/AppLayout';
import { LOCALES, messages } from './index';
import { IntlProvider } from 'react-intl';

function App() {
  return (
      <AppLayout />
  );
}

export default App;
