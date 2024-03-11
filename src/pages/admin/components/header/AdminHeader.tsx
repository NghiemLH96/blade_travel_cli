import logo from '@pics/logo.png'
import './adminHeader.scss'
import { Button, Modal } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { adminAction } from '@/store/slices/adminLoginDetail.slice';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ toggleCollapsed, collapsed }: { collapsed: boolean, toggleCollapsed: any}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { confirm } = Modal;
    const handleLogout = () => {
        confirm(
            {
              title: 'Xác nhận',
              content: `Bạn chắc chắn đăng xuất chứ?`,
              async onOk() {
                localStorage.removeItem('adtkn')
                dispatch(adminAction.removeStore(null))
                navigate('admin-auth')
              },
              okText: 'Xác định',
              cancelText: 'Huỷ'
            }
          )
    }
    return (
        <header>
            <div className="header_left">
                <img className='header_logo' src={logo} alt="" />
                <span className='header_slogan'>Dash Board</span>
            </div>
            <div className="header_right">
                <div className='menuBox'>
                        <Button onClick={toggleCollapsed} style={{color:'#FFFFFF',backgroundColor:'transparent'}}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                </div>
                <div className='toolBox'>
                    <span className="material-symbols-outlined icon">
                        notifications
                    </span>
                    <span className="material-symbols-outlined icon">
                        mail
                    </span>
                    <span className="material-symbols-outlined icon" onClick={()=>{handleLogout()}}>
                        logout
                    </span>
                </div>
            </div>
        </header>
    )
}
