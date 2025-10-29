import './App.css'
import { ActivityForm } from './components/forms/ActivityForm'
import { ActivityList } from './components/views/ActivityList'
import { StatsDashboard } from './components/views/StatsDashboard'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🌟 Движение и Покой</h1>
        <p className="app-subtitle">
          Комплексное отслеживание физической и ментальной активности
        </p>
      </header>
      
      <main className="app-main">
        <div className="app-section">
          <StatsDashboard />
        </div>
        
        <div className="app-section">
          <ActivityForm />
        </div>
        
        <div className="app-section">
          <ActivityList />
        </div>
      </main>
    </div>
  )
}

export default App
