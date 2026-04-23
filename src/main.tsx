import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { EventLogProvider } from './context/EventLogContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <EventLogProvider>
        <App />
      </EventLogProvider>
    </BrowserRouter>
  </StrictMode>,
)
