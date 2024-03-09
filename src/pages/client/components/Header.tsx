import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Button, Carousel, Drawer, Form, Modal, message } from 'antd';
import './scss/header.scss'
import { StoreType } from '@/store/store';
import { useSelector } from 'react-redux';
import { apis } from '@/service/apis';
import modal from 'antd/es/modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';



export default function Header() {
    //ANTD warning notification
    const { confirm } = Modal;
    const showConfirm = (title: string) => {
        confirm({
            title,
            onOk() {
                localStorage.removeItem('token')
                setUserDetail(null)
            },
            onCancel() {

            },
        });
    };
    const [userDetail, setUserDetail] = useState<{ id: number, avatar: string, wallet: number } | null>()
    const loginUser = useSelector((store: StoreType) => store.userStore)

    useEffect(() => {
        if (!loginUser.data && !loginUser.loading) {
            localStorage.removeItem("token")
            window.location.href = "/auth"
        }
        setUserDetail(loginUser.data)
    }, [loginUser.data, loginUser.loading])


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

    const [cart, setCart] = useState([])
    useEffect(() => {
        console.log(cart);

    }, [cart])

    const getCartFn = async () => {
        try {
            if (localStorage.getItem('token')) {
                const user = await apis.userApiModule.checkLogin(localStorage.getItem('token') || 'null')
                if (user) {
                    const result = await apis.productCliApi.getCart(user.data.data.id)
                    if (result.status == 200) {
                        setCart(result.data.data)
                    } else {
                        message.error("Lấy dữ liệu thất bại")
                    }
                }
            }
        } catch (error) {

        }
    }
    const showDrawer = async () => {
        getCartFn()
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleAdjust = async (itemId: number, type: string) => {
        switch (type) {
            case '-':
                try {
                    const result = await apis.productCliApi.cartDecrease(itemId)
                    if (result.status == 200) {
                        message.success(result.data.message)
                    } else {
                        message.error("Giảm sản phẩm thất bại")
                    }
                } catch (error) {
                    message.error('Server đang bận xin thử lại sau')
                };
                getCartFn();
                break;
            case '+':
                try {
                    const result = await apis.productCliApi.cartIncrease(itemId)
                    if (result.status == 200) {
                        message.success(result.data.message)
                    } else {
                        message.error("Tăng thêm sản phẩm thất bại")
                    }
                } catch (error) {
                    message.error('Server đang bận xin thử lại sau')
                };
                getCartFn();
                break;
            default:
                break;
        }
    }

    const removeCartItem = (itemId: number) => {
        modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn chắc chắn muốn xoá sản phẩm này trong giỏ hàng của bạn chứ?',
            okText: 'Xác nhận',
            cancelText: 'Huỷ',
            onOk: async () => {
                try {
                    const result = await apis.productCliApi.removeCartItem(itemId)
                    if (result.status == 200) {
                        message.success(result.data.message)
                    } else {
                        message.error('Xoá sản phẩm thất bại')
                    }
                } catch (error) {
                    message.error('Server đang bận xin thử lại sau')
                }
                getCartFn();
            }
        })
    }
    // Proform 
    const [formRef] = Form.useForm<{
        address: string,
        paymentMethod: string
    }>();
    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    return (
        <header>
            <div className='header_carousel'>
                <Carousel autoplay effect="fade">
                    <div className='slide_container'>
                        <img className='slideImg banner1' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fphoto-1528629297340-d1d466945dc5.avif?alt=media&token=84918ca7-6e27-4ee0-925e-2e2414274b2e" alt="" />
                        <div className='bannerSlogan banner1'>
                            <h1>Chạm tới tự do</h1>
                            <p>Khám phá thế giới trên bánh xe của bạn.</p>
                        </div>
                        <div className='bannerBtn banner1'>
                            <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
                        </div>
                    </div>
                    <div className='slide_container'>
                        <img className='slideImg banner2' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fman-riding-mountain-bike-low-angle.jpg?alt=media&token=50994900-4f49-4620-b938-0e12edc9a894" alt="" />
                        <div className='bannerSlogan banner2'>
                            <h1>Phiêu lưu bất tận</h1>
                            <p>Khám phá nhiều hơn, đi xa hơn - cùng với xe đạp của bạn.</p>
                        </div>
                        <div className='bannerBtn banner2'>
                            <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
                        </div>
                    </div>
                    <div className='slide_container'>
                        <img className='slideImg banner3' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fyoung-sports-man-bicycle-european-city-sports-urban-environments.jpg?alt=media&token=03071b15-8675-43d6-a127-ff5bebfcf980" alt="" />
                        <div className='bannerSlogan banner3'>
                            <h1>Sống theo cách riêng</h1>
                            <p>Xe đạp không chỉ là phương tiện di chuyển, mà còn là cách sống.</p>
                        </div>
                        <div className='bannerBtn banner3'>
                            <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
                        </div>
                    </div>
                    <div>
                        <div className='slide_container'>
                            <img className='slideImg banner4' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fkenny-eliason-PSo2G2lkHPQ-unsplash.jpg?alt=media&token=060ba464-d522-4ecc-8f44-102b78a57f15" alt="" />
                            <div className='bannerSlogan banner4'>
                                <h1>Khơi dậy hành trình</h1>
                                <p>Vững bước đi xa từ những vòng bánh đầu tiên.</p>
                            </div>
                            <div className='bannerBtn banner4'>
                                <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
                            </div>
                        </div>
                    </div>
                </Carousel>
            </div>
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
                            <img src={userDetail?.avatar || "https://tse1.mm.bing.net/th?id=OIP.R5mlhTBdGitUND1A324dAQHaHa&pid=Api&rs=1&c=1&qlt=95&w=105&h=105"} className='userAvatar' alt="" />
                        </div>
                        <div className={accTrigger ? 'accountMenu_dropDown active' : 'accountMenu_dropDown'}>
                            {userDetail?.id && <span>Số dư : {userDetail?.wallet.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}</span>}
                            {!userDetail?.id && <span onClick={() => { navigate("/auth") }}>Đăng nhập</span>}
                            {userDetail?.id && <span onClick={showDrawer}>Giỏ hàng</span>}
                            <Drawer title="Giỏ hàng" onClose={onClose} open={open}>
                                {cart.length == 0 ? <img className='cartEmpty' src='https://mir-s3-cdn-cf.behance.net/projects/404/95974e121862329.Y3JvcCw5MjIsNzIxLDAsMTM5.png' /> : cart.map(item => (
                                    <div key={Math.random() * Date.now()} className="cartItem">
                                        <img className='cartItemPic' src={(item as any).FK_products_cartItem.avatar} alt="" />
                                        <div className='info'>
                                            <p>Tên sản phẩm:{(item as any).FK_products_cartItem.productName}</p>
                                            <p>Giá:{(item as any).FK_products_cartItem.price.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}</p>
                                            <p>Số lượng:<span className='adjustBtn' onClick={() => {
                                                if ((item as any).quantity >= 1) {
                                                    removeCartItem((item as any).id)
                                                } else {
                                                    handleAdjust((item as any).id, '-')
                                                }
                                            }}>-</span>{(item as any).quantity}<span className='adjustBtn' onClick={() => { handleAdjust((item as any).id, '+') }}>+</span></p>
                                        </div>
                                        <button className='removeBtn' onClick={() => { removeCartItem((item as any).id) }}>Xoá</button>
                                    </div>
                                ))
                                }
                                {cart.length == 0 ? <></> :
                                    <div className='cartFooter'>
                                        <label htmlFor="">Số lượng : {cart.reduce((total, value) => { return total + (value as any).quantity }, 0)}</label>
                                        <label htmlFor="">Tổng tiền :{cart.reduce((total, value) => { return total + ((value as any).quantity * (value as any).FK_products_cartItem.price) }, 0).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}</label>
                                    </div>}
                                {cart.length == 0 ? <></> :
                                    <div className='paymentBtn'>
                                        <ModalForm<{
                                            address: string,
                                            paymentMethod: string
                                        }>
                                            title="Xác nhận thanh toán"
                                            trigger={
                                                <Button size="small" type="primary">
                                                    Thanh toán
                                                </Button>
                                            }
                                            form={formRef}
                                            autoFocusFirstInput
                                            variant="filled"
                                            modalProps={{
                                                destroyOnClose: true,
                                                onCancel: () => console.log('run'),
                                            }}
                                            submitTimeout={2000}
                                            onFinish={async (values) => {
                                                await waitTime(2000);
                                            }}
                                        >
                                            <ProForm.Group>
                                                <ProFormText
                                                    width="md"
                                                    name="address"
                                                    label="Địa chỉ"
                                                    placeholder="Địa chỉ"
                                                    required
                                                />
                                                <ProFormSelect
                                                    initialValue={null}
                                                    width="md"
                                                    options={
                                                        [{ value: 'cod', label: "Thanh toán khi nhận hàng" },
                                                        { value: 'wallet', label: "Thanh toán ví" }]
                                                    }
                                                    required
                                                    name="paymentMethod"
                                                    label="Cách thức thanh toán"
                                                />
                                            </ProForm.Group>
                                        </ModalForm>
                                    </div>
                                }
                            </Drawer>
                            {userDetail?.id &&
                                <span onClick={() => {
                                    showConfirm("Bạn chắc chắn muốn đăng xuất chứ?")
                                }}>Thoát</span>}
                        </div>
                    </div>
                </section>
            </div>
        </header>
    )
}
