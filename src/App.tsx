import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { Market } from './pages/Market'
import { Sell } from './pages/Sell'
import { Messages } from './pages/Messages'
import { Chat } from './pages/Chat'
import { Profile } from './pages/Profile'
import { MyListings } from './pages/MyListings'
import { ListingDetails } from './pages/ListingDetails'
import { EditListing } from './pages/EditListing'
import { SellerProfile } from './pages/SellerProfile'
import { SignUp } from './pages/SignUp'
import { Login } from './pages/Login'
import { VerifyEmail } from './pages/VerifyEmail'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/listing/:id/edit" element={<EditListing />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
