import { StockProvider } from './context/StockContext'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ChatWindow from './components/Chatbot/ChatWindow'

export default function App() {
  return (
    <StockProvider>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#1C1C1E' }}>
        <Header />
        <main className="flex-1 flex gap-3 p-3 overflow-hidden min-h-0">
          <div className="flex-1 min-w-0 overflow-y-auto">
            <Dashboard />
          </div>
          <div className="w-[360px] flex-shrink-0">
            <ChatWindow />
          </div>
        </main>
      </div>
    </StockProvider>
  )
}
