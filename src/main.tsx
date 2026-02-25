import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { EventLogProvider } from './context/EventLogContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/conversion-tracking/demo">
      <EventLogProvider>
        <App />
      </EventLogProvider>
    </BrowserRouter>
  </StrictMode>,
)
