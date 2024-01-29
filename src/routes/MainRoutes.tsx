import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthenPage from '@pages/auth/AuthenPage'
import Home from '@pages/home/Home'
import utils from '@/utils'

export default function MainRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={utils.lazyFn(()=>import('@pages/MainPage'))()}>
                <Route path='' element={<Home/>}></Route>
            </Route>
            <Route path={'/auth'} element={<AuthenPage/>}></Route>
        </Routes>
    </BrowserRouter>
  )
}
