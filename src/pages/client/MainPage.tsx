import Header from '@/pages/client/components/Header'
import Footer from '@/pages/client/components/Footer'
import Chat from '@/chat/Chat'
import { Outlet } from 'react-router-dom'

export default function MainPage() {
    return (
        <>  
            <Chat/>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
