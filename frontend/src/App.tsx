import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TunerPage from './pages/TunerPage'
import TabsPage from './pages/TabsPage'
import LearnPage from './pages/LearnPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tuner" element={<TunerPage />} />
            <Route path="/tabs" element={<TabsPage />} />
            <Route path="/learn" element={<LearnPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
