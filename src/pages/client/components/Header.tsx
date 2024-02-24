import { useNavigate } from 'react-router-dom'
import banner1 from '@pics/Banner1.jpg'
import logo from '@pics/logo.png'
import { useEffect, useRef, useState } from 'react'
import { DatePicker, Modal } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN'
import './scss/header.scss'
import { useAppDispatch, useAppSelector } from '@/store/store';
import { userAction } from '@/store/slices/loginDetail.slice';



export default function Header() {
    const dispatch = useAppDispatch()

    //ANTD warning notification
    const { confirm } = Modal;
    const showConfirm = (title:string) => {
        confirm({
          title,
          onOk() {
            localStorage.removeItem('token')
            dispatch(userAction.removeLogin())
          },
          onCancel() {
            
          },
        });
      };

    const loginUser = useAppSelector(state => state.user.data);


    const { RangePicker } = DatePicker;
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    console.log(startDate);
    console.log(endDate);
    
    

    const navigate = useNavigate()
    const [languageTrigger, setLanguageTrigger] = useState(false)
    const [accTrigger, setAccTrigger] = useState(false)
    let langMenuRef = useRef<HTMLInputElement>(null);
    let accMenuRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleMenuTrigger = (e: any) => {
            if (!langMenuRef.current?.contains(e.target)) {
                setLanguageTrigger(false);
            }

            if (!accMenuRef.current?.contains(e.target)) {
                setAccTrigger(false)
            }
        };
        document.addEventListener("mousedown", handleMenuTrigger)
    })
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
                        <span>Hỗ trợ</span>
                        <div className='navLine'></div>
                    </div>
                </section>
                <section className='header_top_right'>
                    <div ref={langMenuRef} className='languageBtn' >
                        <span className="material-symbols-outlined languageIcon" onClick={() => {
                            setLanguageTrigger(!languageTrigger)
                        }}>
                            language
                        </span>
                        <div className={languageTrigger ? 'langMenu_dropDown active' : 'langMenu_dropDown'}>
                            <span>Tiếng Việt</span>
                            <span>Tiếng Anh</span>
                            <span>Tiếng Trung</span>
                        </div>
                    </div>
                    <div ref={accMenuRef} className='accountMenu'>
                        <div className='accountMenu_btn' onClick={() => { setAccTrigger(!accTrigger) }}>
                            <span className="material-symbols-outlined menuIcon">
                                menu
                            </span>
                            <img className='userAvatar' src={(loginUser as any).avatar ? `http://127.0.0.1:3000/imgs/avatars/${(loginUser as any).avatar}` : "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"} alt="" />
                        </div>
                        <div className={accTrigger ? 'accountMenu_dropDown active' : 'accountMenu_dropDown'}>
                            {!(loginUser as any).id && <span onClick={() => { navigate("/auth") }}>Đăng nhập</span>}
                            <span onClick={() => { navigate("/booking") }}>Đơn Hàng</span>
                            <span onClick={() => { navigate("/auth/business-login") }}>Truy cập trang quản lý</span>
                            <span onClick={() => {
                                showConfirm("Bạn chắc chắn muốn đăng xuất chứ?")
                            }}>Thoát</span>
                        </div>
                    </div>
                </section>
            </div>
            <section className="header_bottom">
                <div className='header_searchBar'>
                    <div className='selector area'>
                        <input className='areaInput' type="text" />
                    </div>
                    <div className='selector date'>
                        <RangePicker locale={locale} className='dateInput' onChange={(e => {
                            setStartDate(`${e?.[0]?.get('date')}/${String(Number(e?.[0]?.get('month')) + 1)}/${e?.[0]?.get('year')}`)
                            setEndDate(`${e?.[1]?.get('date')}/${String(Number(e?.[1]?.get('month')) + 1)}/${e?.[1]?.get('year')}`)
                        })} />
                    </div>
                    <div className='selector pax'>
                        <div className='paxInput'>
                            1 người lớn , 0 trẻ em , 1 phòng
                        </div>
                    </div>
                    <div className='searchBox'>
                        <button className='searchBtn'>Tìm kiếm</button>
                    </div>
                </div>
            </section>
        </header>
    )
}
