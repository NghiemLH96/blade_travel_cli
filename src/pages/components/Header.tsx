import { Link } from 'react-router-dom'
import banner1 from '../../assets/pics/Banner1.jpg'
import logo from '../../assets/pics/logo.png'

export default function Header() {
    return (
        <header>
            <img className='header_background' src={banner1} alt="" />
            <div className='header_top'>
                <section className='header_top_left'>
                    <img className='logo' src={logo} alt="" />
                </section>
                <section className='header_top_middle'>
                    <div className='nav'>
                        <span>Trang chủ</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Khách Sạn</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Tour</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Hỗ trợ1</span>
                        <div className='navLine'></div>
                    </div>
                </section>
                <section className='header_top_right'>

                </section>
            </div>

        </header>
    )
}
