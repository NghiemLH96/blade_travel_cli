import { Route, Routes } from 'react-router-dom'
import AuthenPage from '@pages/client/auth/AuthenPage'
import Home from '@pages/client/pages/home/Home'
import utils from '@/utils'
import VerifyEmailPage from '@/pages/client/auth/VerifyEmailPage'
import AdminAuth from '@/pages/admin/auth-page/auth/AdminAuth'
import AdminMainPage from '@/pages/admin/AdminMainPage'
import AdminHome from '@/pages/admin/fn-page/home/AdminHome'
import AdminProductMng from '@/pages/admin/fn-page/products/AdminProductMng'
import AdminAccMng from '@/pages/admin/fn-page/accounts/AdminAccMng'
import AdminReceiptMng from '@/pages/admin/fn-page/receipts/AdminReceiptMng'
import AdminAccsMng from '@/pages/admin/fn-page/admins/AdminAccsMng'
import MaterialsMng from '@/pages/admin/fn-page/material/MaterialsMng'
import CategoriesMng from '@/pages/admin/fn-page/categories/CategoriesMng'
import BrandsMng from '@/pages/admin/fn-page/brand/BrandsMng'
import MadeByMng from '@/pages/admin/fn-page/madeBy/MadeByMng'
import Products from '@/pages/client/pages/products/Products'

export default function MainRoutes() {
  return (
        <Routes>
            <Route path='/' element={utils.lazyFn(()=>import('@pages/client/MainPage'))()}>
                <Route path='' element={<Home/>}></Route>
                <Route path='products' element={<Products/>}></Route>
            </Route>
            <Route path='/auth' element={<AuthenPage/>}></Route>
            <Route path='/admin-auth' element={<AdminAuth/>}></Route>
            <Route path='/admin' element={<AdminMainPage/>}>
              <Route path='home' element={<AdminHome/>}/>
              <Route path='products' element={<AdminProductMng/>}/>
              <Route path='materials' element={<MaterialsMng/>}/>
              <Route path='categories' element={<CategoriesMng/>}/>
              <Route path='brands' element={<BrandsMng/>}/>
              <Route path='made-by' element={<MadeByMng/>}/>
              <Route path='admins-account' element={<AdminAccsMng/>}/>
              <Route path='accounts' element={<AdminAccMng/>}/>
              <Route path='receipts' element={<AdminReceiptMng/>}/>
            </Route>
            <Route path={'/verify-email'} element={<VerifyEmailPage/>}></Route>
        </Routes>
  )
}
