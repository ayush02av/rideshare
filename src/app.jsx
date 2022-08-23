import { ThemeProvider } from '@mui/material/styles'
import { PrimaryTheme } from './themes/primaryTheme'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

import './styles/index.css'

import Header from "./components/header"

import Home from './pages/home'
import Rider from './pages/rider'
import Login from './pages/login'
import Ride from './pages/ride'

const headers = {
  'Authorization': `Token ${localStorage.getItem('token')}`
};

const redirectTo = (page) => {
  switch (page) {
    case 'rider':
      if ((localStorage.getItem('token_type') != 'rider')) {
        redirectTo('/login/rider');
      } else {
        redirectTo('/rider');
      }
      break;

    case 'driver':
      if ((localStorage.getItem('token_type') != 'driver')) {
        redirectTo('/login/driver');
      } else {
        redirectTo('/driver');
      }
      break;

    default:
      window.location.href = page;
      break;
  }
}

const App = () => {

  return (

    <Router>
      <ThemeProvider theme={PrimaryTheme}>
        <Header redirectTo={redirectTo} />
        <Routes>
          <Route path="/" element={<Home redirectTo={redirectTo} />} />
          <Route path="/rider" element={<Rider headers={headers} />} />
          <Route path="/ride/:id" element={<Ride headers={headers} />} />
          <Route path="/login/:account_type" element={<Login redirectTo={redirectTo} />} />
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App
