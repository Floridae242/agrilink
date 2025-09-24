import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Logistics from './pages/Logistics'
import Support from './pages/Support'
import RequestPilot from './pages/RequestPilot'
import QRPublic from './pages/QRPublic'
import Dashboards from './pages/Dashboards'
import Login from './pages/Login'
import { AuthProvider } from './lib/auth'
import { Protected } from './components/Protected'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home/> },
    { path: 'marketplace', element: <Protected><Marketplace/></Protected> },
    { path: 'logistics', element: <Protected><Logistics/></Protected> },
    { path: 'support', element: <Protected><Support/></Protected> },
    { path: 'pilot', element: <RequestPilot/> },
    { path: 'qr/:lotId', element: <QRPublic/> },
    { path: 'dash/*', element: <Protected><Dashboards/></Protected> },
    { path: 'login', element: <Login/> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
