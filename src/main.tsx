import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './pages/Game'
import TestPage from './pages/TestPage'
import './index.css'

// Check if we want to show the test page
const isTestMode = window.location.search.includes('test') || window.location.pathname.includes('test');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isTestMode ? <TestPage /> : <Game />}
  </React.StrictMode>,
)
