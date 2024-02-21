import { useEffect, useState } from 'react';
import './adminAcc.scss'
import { apis } from '@/service/apis';
import Modal from 'antd/es/modal';

export default function AdminAccMng() {
  const [usersList , setUsersList] = useState<Array<any>>([])

  useEffect(()=>{
    getUsersList()
  },[])

  const getUsersList = async () => {
    try {
      const result = await apis.adminApiModule.getUsers()
      setUsersList(result.data.data)
    } catch (error) {
      
    }
  }
  
  //Khoá & Mở khoá tài khoản
  const { confirm } = Modal;

  const handleLock = (user:{userId:number,userStatus:boolean}) => {
    confirm({
      title: 'Thay đổi trạng thái',
      content: `Bạn chắc chắn muốn ${user.userStatus ? 'khoá' : 'mở khoá'} tài khoản này chứ`,
      async onOk() {
        const result = await apis.adminApiModule.changeUserStatus(user)
        if (result.status == 200) {
          success(result.data.message)
        }else{
          error(result.data.message)
        }
        getUsersList()
      },
      okText:'Xác định',
      cancelText:'Huỷ'
    });
  };
  
  const success = (content:string) => {
    Modal.success({
      content: content,
    });
  };

  const error = (content:string) => {
    Modal.error({
      content: content,
    });
  };

  //Khôi phục mật khẩu

  const handleResetPW = (userId:number,userEmail:string) => {
    confirm({
      title: 'Khôi phục mật khẩu',
      content: `Bạn chắc chắn muốn khôi phục mật khẩu của ${userEmail} chứ`,
      async onOk() {   
        const result = await apis.adminApiModule.resetPW(userId)
        if (result.status == 200) {
          success(result.data.message)
          console.log(result.data.data);
        }else{
          error(result.data.message)
        }
        getUsersList()
      },
      okText:'Xác định',
      cancelText:'Huỷ'
    });
  };

  return (
    <div className='content_container'>
      <h2 className='content_title'>Quản lý tài khoản người dùng</h2>
      <table className='content_table' border={1} >
        <thead>
          <tr style={{height:'40px'}}>
            <th style={{width:'50px'}}>ID</th>
            <th style={{width:'200px'}}>Tên tài khoản</th>
            <th style={{width:'80px'}}>Trạng thái</th>
            <th style={{width:'100px'}}>Số điện thoại</th>
            <th style={{width:'150px'}}>Thời gian đăng ký</th>
            <th style={{width:'150px'}}>Thời gian cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          { usersList && usersList.map(user =>(
            <tr key={user.id} style={{height:'20px'}}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.status ? 'Hoạt động' : 'Tạm khoá'}</td>
              <td>{user.phone}</td> 
              <td>{user.createAt}</td>
              <td>{user.updateAt}</td>
              <td className='btnBar'>
                <button style={user.status ? {backgroundColor:'red',color:'#FFFFFF'} : {backgroundColor:'green',color:'#FFFFFF'}} onClick={()=>{handleLock({userId:user.id,userStatus:user.status})}}>{user.status ? 'Khoá' : 'Mở khoá'}</button>
                <button style={{backgroundColor:'green',color:'#FFFFFF'}}>Sửa số điện thoại</button>
                <button style={{backgroundColor:'orange',color:'#FFFFFF'}} onClick={()=>{handleResetPW(user.id,user.email)}}>Đặt lại mật khẩu</button>
                <button style={{backgroundColor:'blue',color:'#FFFFFF'}}>Gửi thông báo</button>
              </td>
          </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={6}>Tổng số người dùng</th>
            <th>{usersList.length}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
