import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./components/header/AdminHeader";
import { useState } from "react";
import './adminMain.scss'

export default function AdminMainPage() {
  const [menuListState , setMenuListState] = useState(true)
  const navigate = useNavigate()
  return (
    <div className="adminMain_container">
      <AdminHeader setMenuListState={setMenuListState} menuListState={menuListState}/>
      <div className="body_content">
        <div className={menuListState ? "menuList" : "menuList disable"}>
          <div className="menuSelector" onClick={()=>{
            navigate("/admin/products")
          }}>
            <span className="material-symbols-outlined icon">
              inventory_2
            </span>
            <span className="menuText">Quản lý sản phẩm</span>
          </div>
          <div className="menuSelector" onClick={()=>{
            navigate("/admin/accounts")
          }}>
            <span className="material-symbols-outlined icon">
              person
            </span>
            <span className="menuText">Quản lý người dùng</span>
          </div>
          <div className="menuSelector" onClick={()=>{
            navigate("/admin/receipts")
          }}>
            <span className="material-symbols-outlined icon">
              receipt
            </span>
            <span className="menuText">Quản lý đơn hàng</span>
          </div>
          <div className="menuSelector" onClick={()=>{
            navigate("/admin/receipts")
          }}>
            <span className="material-symbols-outlined icon">
              list
            </span>
            <span className="menuText">Lịch sử thao tác</span>
          </div>
        </div>
        <div className={menuListState ? "outlet_container" : "outlet_container extend" }>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
