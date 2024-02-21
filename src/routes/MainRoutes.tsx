import { Route, Routes } from 'react-router-dom'
import AuthenPage from '@pages/auth/AuthenPage'
import Home from '@pages/home/Home'
import utils from '@/utils'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import AdminAuth from '@/pages/admin/auth/AdminAuth'
import AdminMainPage from '@/pages/admin/AdminMainPage'
import AdminHome from '@/pages/admin/home/AdminHome'
import AdminProductMng from '@/pages/admin/products/AdminProductMng'
import AdminAccMng from '@/pages/admin/accounts/AdminAccMng'
import AdminReceiptMng from '@/pages/admin/receipts/AdminReceiptMng'

export default function MainRoutes() {
  return (
        <Routes>
            <Route path='/' element={utils.lazyFn(()=>import('@pages/MainPage'))()}>
                <Route path='' element={<Home/>}></Route>
            </Route>
            <Route path='/auth' element={<AuthenPage/>}></Route>
            <Route path='/admin-auth' element={<AdminAuth/>}></Route>
            <Route path='/admin' element={<AdminMainPage/>}>
              <Route path='home' element={<AdminHome/>}/>
              <Route path='products' element={<AdminProductMng/>}/>
              <Route path='accounts' element={<AdminAccMng/>}/>
              <Route path='receipts' element={<AdminReceiptMng/>}/>
            </Route>
            <Route path={'/verify-email'} element={<VerifyEmailPage/>}></Route>
        </Routes>
  )
}
