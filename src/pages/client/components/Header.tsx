import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Drawer, Modal } from 'antd';
import './scss/header.scss'
import { useAppDispatch, useAppSelector } from '@/store/store';
import { userAction } from '@/store/slices/loginDetail.slice';
import { apis } from '@/service/apis';



export default function Header() {
    const dispatch = useAppDispatch()
    useEffect(()=>{
      if (localStorage.getItem("token")) {
        let token = localStorage.getItem("token")
        verifyToken(token)
      }
    },[])
    const verifyToken = async(token:string|null) => {
      try {
        if (token == null) {
          return
        }else{
          const result = await apis.userApiModule.checkLogin(token)
          if (result.status == 200) {
            dispatch(userAction.createLogin(result.data.data))
          }
        }
      } catch (error) {
        
      }
    }

    //ANTD warning notification
    const { confirm } = Modal;
    const showConfirm = (title: string) => {
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


    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <header>
            <img className='header_background' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fphoto-1528629297340-d1d466945dc5.avif?alt=media&token=84918ca7-6e27-4ee0-925e-2e2414274b2e" alt="" />
            <div className='header_top'>
                <section className='header_top_left'>
                    <img className='logo' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Flogo_b.png?alt=media&token=90278c26-bea6-4640-8499-5dfde55a41d8" alt="" />
                </section>
                <section className='header_top_middle'>
                    <div className='nav' onClick={() => { navigate("/") }}>
                        <span>Trang chủ</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav' onClick={() => { navigate("/products") }}>
                        <span>Sản phẩm</span>
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
                            <img className='userAvatar' src={(loginUser as any).avatar ? (loginUser as any).avatar : "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"} alt="" />
                        </div>
                        <div className={accTrigger ? 'accountMenu_dropDown active' : 'accountMenu_dropDown'}>
                            {!(loginUser as any).id && <span onClick={() => { navigate("/auth") }}>Đăng nhập</span>}
                            <span onClick={showDrawer}>Giỏ hàng</span>
                            <Drawer title="Giỏ hàng" onClose={onClose} open={open}>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                            </Drawer>
                            <span onClick={() => { navigate("/booking") }}>Đơn Hàng</span>
                            <span onClick={() => { navigate("/auth/business-login") }}>Truy cập trang quản lý</span>
                            <span onClick={() => {
                                showConfirm("Bạn chắc chắn muốn đăng xuất chứ?")
                            }}>Thoát</span>
                        </div>
                    </div>
                </section>
            </div>
        </header>
    )
}
