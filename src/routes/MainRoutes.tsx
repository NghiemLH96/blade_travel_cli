import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from '@pages/MainPage'
import AuthenPage from '@pages/auth/AuthenPage'
import Home from '@pages/home/Home'

export default function MainRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<MainPage/>}>
                <Route path='' element={<Home/>}></Route>
            </Route>
            <Route path={'/login'} element={<AuthenPage/>}></Route>
            <Route path={'/register'} element={<AuthenPage/>}></Route>
            <Route path={'/admin-login'} element={<AuthenPage/>}></Route>
            <Route path={'/business-login'} element={<AuthenPage/>}></Route>
        </Routes>
    </BrowserRouter>
  )
}
