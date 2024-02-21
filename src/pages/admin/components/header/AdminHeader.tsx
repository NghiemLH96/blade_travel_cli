import logo from '@pics/logo.png'
import './adminHeader.scss'

export default function AdminHeader({setMenuListState,menuListState}: {setMenuListState: any,menuListState:boolean}) {
    return (
        <header>
            <div className="header_left">
                <img className='header_logo' src={logo} alt="" />
                <span className='header_slogan'>Dash Board</span>
            </div>
            <div className="header_right">
                <div className='menuBox' onClick={()=>{
                    setMenuListState(!menuListState)
                }}>
                    <span className="material-symbols-outlined icon">
                        menu
                    </span>
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
