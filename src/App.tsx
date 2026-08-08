import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { Market } from './pages/Market'
import { Sell } from './pages/Sell'
import { Messages } from './pages/Messages'
import { Profile } from './pages/Profile'
import { ListingDetails } from './pages/ListingDetails'
import { SellerProfile } from './pages/SellerProfile'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
      </Route>
    </Routes>
  )
}

export default App
