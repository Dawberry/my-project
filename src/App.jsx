import Register from './Components/Register';
import Login from './Components/Login';
import Layout from './Components/Layout';
import Missing from './Components/Missing';
import Landing from './Components/Landing';
import RequireAuth from './Components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {

  return (
  <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        

        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          {/* <Route path="/" element={<Landing />} /> */}
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;