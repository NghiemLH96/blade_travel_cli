import { apis } from '@/service/apis'
import './adminAuth.scss'
import bckGrdImg from '@pics/adminAuthBckg.jpeg'
import { message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { adminAction } from '@/store/slices/adminLoginDetail.slice';

export default function AdminAuth() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        checkLogin()
    }, [])
    const navigate = useNavigate()
  //checkLogin
  const checkLogin = async () => {
    const adtkn = localStorage.getItem('adtkn')
    if (adtkn) {
        try {
          const result = await apis.adminApiModule.checkLogin(adtkn)
          console.log(result.status);
          
          if(result.status == 215){
            localStorage.removeItem("adtkn")
            message.warning("Phiên làm việc trước đã quá hạn mời đăng nhập lại")
          }
          if(result.status == 200){
            navigate("/admin")
          }
        } catch (error) {
          
        }
    }
}

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
                        <button type='submit' className='admin_loginBtn'>Đăng Nhập</button>
                    </div>
                </form>
            </div>
        </section>
    )
}
