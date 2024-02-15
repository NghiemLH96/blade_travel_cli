import { Route, Routes } from 'react-router-dom'
import AuthenPage from '@pages/auth/AuthenPage'
import Home from '@pages/home/Home'
import utils from '@/utils'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'

export default function MainRoutes() {
  return (
        <Routes>
            <Route path='/' element={utils.lazyFn(()=>import('@pages/MainPage'))()}>
                <Route path='' element={<Home/>}></Route>
            </Route>
            <Route path={'/auth'} element={<AuthenPage/>}></Route>
            <Route path={'/verify-email'} element={<VerifyEmailPage/>}></Route>
        </Routes>
  )
}
