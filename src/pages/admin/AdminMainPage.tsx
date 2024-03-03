import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./components/header/AdminHeader";
import { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import './scss/adminMain.scss'
import { apis } from "@/service/apis";

export default function AdminMainPage() {
  const navigate = useNavigate()
  useEffect(() => {
      checkLogin()
  }, [])
  //checkLogin
  const checkLogin = async () => {
      const adtkn = localStorage.getItem('adtkn')
      if (adtkn) {
          try {
            const result = await apis.adminApiModule.checkLogin(adtkn)
            console.log(result.status);
            
            if(result.status == 215){
              navigate("/admin-auth")
              localStorage.removeItem("adtkn")
              message.warning(result.data.message)
              return
            }
            if(result.status == 200){
              return
            }
            {
              message.warning("Chỉ quản trị viên mới được truy cập")
              navigate("/admin-auth")
            }
          } catch (error) {
            
          }
      }
      navigate("/admin-auth")
      message.warning("Chỉ quản trị viên mới được truy cập")
  }

  type MenuItem = Required<MenuProps>['items'][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem('Trang chủ', '0'),
    getItem('Quản lý tài khoản', 'sub1', <MailOutlined />, [
      getItem('Danh sách quản trị viên', '1'),
      getItem('Danh sách người dùng', '2'),
    ]),

    getItem('Quản lý sản phẩm', 'sub2', <AppstoreOutlined />, [
      getItem('Danh sách sản phẩm', '3'),
      getItem('Danh sách nhãn hiệu', '4'),
      getItem('Danh sách xuất xứ', '5'),
      getItem('Danh sách chất liệu', '6'),
      getItem('Danh sách thể loại', '7')
    ]),
  ];

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    switch (Number(e.key)) {
      case 0:
        navigate("/admin")
        break;
      case 1:
        navigate("/admin/admins-account")
        break;
      case 2:
        navigate("/admin/accounts")
        break;
      case 3:
        navigate("/admin/products")
        break;
      case 4:
        navigate("/admin/brands")
        break;
      case 5:
        navigate("/admin/made-by")
        break;
      case 6:
        navigate("/admin/materials")
        break;
      case 7:
        navigate("/admin/categories")
        break;

      default:
        break;
    }
  };

  return (
    <div className="adminMain_container">
      <AdminHeader toggleCollapsed={toggleCollapsed} collapsed={collapsed} />
      <div className="body_content">
        <div>

          <Menu
            subMenuOpenDelay={1}
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['0']}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            items={items}
            onClick={onClick}
          />
        </div>
        <div className="outlet_container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
