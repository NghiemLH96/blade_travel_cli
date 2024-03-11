import { Route, Routes } from 'react-router-dom'
import { lazyFn } from '@/utils/lazy'

export default function MainRoutes() {
  return (
        <Routes>
            <Route path='/' element={lazyFn(() => import('@pages/client/MainPage'))}>
                <Route path='' element={lazyFn(() => import('@pages/client/pages/home/Home'))}></Route>
                <Route path='products' element={lazyFn(() => import('@pages/client/pages/products/Products'))}></Route>
                <Route path='brands/:id' element={lazyFn(() => import('@pages/client/pages/brands/Brand'))}></Route>
            </Route>
            <Route path='/auth' element={lazyFn(() => import('@pages/client/auth/AuthenPage'))}></Route>
            <Route path='/admin-auth' element={lazyFn(() => import('@pages/admin/auth-page/auth/AdminAuth'))}></Route>
            <Route path='/admin' element={lazyFn(()=>import('@pages/admin/AdminMainPage'))}>
              <Route path='home' element={lazyFn(() => import('@pages/admin/fn-page/home/AdminHome'))}/>
              <Route path='products' element={lazyFn(() => import('@pages/admin/fn-page/products/AdminProductMng'))}/>
              <Route path='materials' element={lazyFn(() => import('@pages/admin/fn-page/material/MaterialsMng'))}/>
              <Route path='categories' element={lazyFn(() => import('@pages/admin/fn-page/categories/CategoriesMng'))}/>
              <Route path='brands' element={lazyFn(() => import('@pages/admin/fn-page/brand/BrandsMng'))}/>
              <Route path='made-by' element={lazyFn(() => import('@pages/admin/fn-page/madeBy/MadeByMng'))}/>
              <Route path='admins-account' element={lazyFn(() => import('@pages/admin/fn-page/admins/AdminAccsMng'))}/>
              <Route path='accounts' element={lazyFn(() => import('@pages/admin/fn-page/accounts/AdminAccMng'))}/>
              <Route path='receipts' element={lazyFn(() => import('@pages/admin/fn-page/receipts/AdminReceiptMng'))}/>
              <Route path='record' element={lazyFn(() => import('@pages/admin/fn-page/records/Records'))}/>
            </Route>
            <Route path={'/verify-email'} element={lazyFn(() => import('@pages/client/auth/VerifyEmailPage'))}></Route>
        </Routes>
  )
}
