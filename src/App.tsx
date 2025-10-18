import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Layout from "./components/Layout";

function App() {
  return (
    <div className = "flex">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          </Route>
      </Routes>
    </div>
  )
}


export default App
