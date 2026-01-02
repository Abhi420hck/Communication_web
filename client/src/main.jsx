import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import ChatProvider from './Context/ChatProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
)
