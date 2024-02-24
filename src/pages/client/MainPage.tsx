import Header from '@/pages/client/components/Header'
import Footer from '@/pages/client/components/Footer'
import { Outlet } from 'react-router-dom'

export default function MainPage() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
