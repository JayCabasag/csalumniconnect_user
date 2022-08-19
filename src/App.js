import { useContext} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Error from "./containers/Error";
import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import UserContextProvider from "./UserContext";
import Modal from 'react-modal/lib/components/Modal';
import ForgotPassword from "./components/ForgotPassword";
import LandingPage from "./containers/LandingPage";
import WaitingPage from "./containers/WaitingPage"

Modal.setAppElement('#root');

function App() {
  return (
        <UserContextProvider>
          <Router>
            <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='*' element={<Home />}/>
                <Route path='/notfound' element={<Error />} />
                <Route path='/landingpage' element={<LandingPage />} />
                <Route path='/waitingpage' element={<WaitingPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />}/>
            </Routes>
          </Router>     
        </UserContextProvider>

  
  );
}

export default App;
