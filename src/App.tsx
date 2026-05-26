import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PersonalTax from './pages/PersonalTax'
import VatTax from './pages/VatTax'
import CorporateTax from './pages/CorporateTax'
import OtherTaxes from './pages/OtherTaxes'
import History from './pages/History'
import Entities from './pages/Entities'
import Profile from './pages/Profile'
import Detail from './pages/Detail'
import TabBar from './components/TabBar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bgLight">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tax/personal" element={<PersonalTax />} />
          <Route path="/tax/vat" element={<VatTax />} />
          <Route path="/tax/corporate" element={<CorporateTax />} />
          <Route path="/tax/other" element={<OtherTaxes />} />
          <Route path="/history" element={<History />} />
          <Route path="/entities" element={<Entities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}

export default App
