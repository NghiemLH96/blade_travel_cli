import { apis } from '@/service/apis'
import './adminAuth.scss'
import bckGrdImg from '@pics/adminAuthBckg.jpeg'
import { Modal, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { adminAction } from '@/store/slices/adminLoginDetail.slice';

export default function AdminAuth() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        checkLogin()
    }, [])
    //checkLogin
    const checkLogin = async () => {
        const adtkn = localStorage.getItem('adtkn')
        if (adtkn) {
            const result = await apis.adminApiModule.checkLogin(adtkn)
            result && loginNotice("Tài khoản đã đăng nhập!")
        }
    }

    //ANTD warning notification
    const navigate = useNavigate()
    const loginNotice = (content: string) => {
        Modal.warning({
            content: content,
            onOk: () => {
                navigate("/admin")
            }
        });
    };

    // >Success Message
    const [messageApi, contextHolder] = message.useMessage();
    const successMessage = (informText: string) => {
        messageApi.open({
            type: 'success',
            content: informText,
        });
    };
    // >Error Message
    const errorMessage = (errorText: string) => {
        messageApi.open({
            type: 'error',
            content: errorText,
        });
    };

    const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const adminLoginDetail = {
            username: (e.target as any).admin_username.value,
            password: (e.target as any).admin_password.value
        }
        const result = await apis.adminApiModule.login(adminLoginDetail)
        if (result.status == 200) {
            successMessage(result.data.message)
            localStorage.setItem('adtkn', result.data.token)
            dispatch(adminAction.createLogin(result.data.data))
            setTimeout(() => {
                navigate('/admin')
            }, 1000);
        } else {
            errorMessage(result.data.message)
        }
    }

    return (
        <section className='pageConstruct'>
            <img className='bckGrdImg' src={bckGrdImg} alt="" />
            {contextHolder}
            <div className='adminAuth'>
                <h2>Đăng nhập</h2>
                <form className='admin_loginForm' onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleAdminLogin(e) }}>
                    <label htmlFor="admin_username">Tài Khoản</label>
                    <input className='admin_input' id='admin_username' type="text" name='username' autoComplete='off' />
                    <label htmlFor="admin_password">Mật Khẩu</label>
                    <input className='admin_input' id='admin_password' type="password" name='password' autoComplete='off' />
                    <div className='btnBox'>
                        <a href="">Yêu cầu khôi phục mật khẩu</a>
                        <button type='submit' className='admin_loginBtn'>Đăng Nhập</button>
                    </div>
                </form>
            </div>
        </section>
    )
}
