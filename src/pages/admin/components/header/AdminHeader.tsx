import logo from '@pics/logo.png'
import './adminHeader.scss'
import { Button } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

export default function AdminHeader({ toggleCollapsed, collapsed }: { collapsed: boolean, toggleCollapsed: any}) {
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
                    <span className="material-symbols-outlined icon">
                        settings
                    </span>
                </div>
            </div>
        </header>
    )
}
