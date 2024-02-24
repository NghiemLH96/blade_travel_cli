import { apis } from "@/service/apis"
import { Modal, Pagination, PaginationProps, Select } from "antd"
import { useEffect, useState } from "react"
import '../../scss/fnPage.scss'

export default function AdminProductMng() {

  const [renderUserList, setRenderUserList] = useState<Array<any>>([])
  const [resultCount , setResultCount] = useState<number>(0)
  const pageSize = 10

    //Tìm kiếm
    const [searchStatus , setSearchStatus] = useState<boolean|null>(null)
    const [searchByEmail , setSearchByEmail] = useState<string|null>(null)
    const [searchByPhone , setSearchByPhone] = useState<string|null>(null)
  
    const handleSelectorChange = (value: boolean|null) => {
      setSearchStatus(value)
    };
  
    //Phân trang
    const [current, setCurrent] = useState(1);
    useEffect(()=>{
      getPageUserList()
    },[current])
  
    const handlePage: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
    };

  const getPageUserList = async () => {
      try {
        const result = await apis.adminApiModule.search({status:searchStatus,email:searchByEmail,phone:searchByPhone,currentPage:current,pageSize:pageSize})
        console.log('page',result);
        
        setResultCount(result.data.total)
        setRenderUserList(result.data.data)
      } catch (error) {
  
      }
  }

  const handleDateType = (timeString:string) => {
    const timestamp = Number(timeString)
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
  }
  //Khoá & Mở khoá tài khoản
  const { confirm } = Modal;

  const handleLock = (user: { userId: number, userStatus: boolean }) => {
    confirm({
      title: 'Thay đổi trạng thái',
      content: `Bạn chắc chắn muốn ${user.userStatus ? 'khoá' : 'mở khoá'} tài khoản này chứ`,
      async onOk() {
        const result = await apis.adminApiModule.changeUserStatus(user)
        if (result.status == 200) {
          success(result.data.message)
        } else {
          error(result.data.message)
        }
        getPageUserList()
      },
      okText: 'Xác định',
      cancelText: 'Huỷ'
    });
  };

  const success = (content: string) => {
    Modal.success({
      content: content,
    });
  };

  const error = (content: string) => {
    Modal.error({
      content: content,
    });
  };

  //Khôi phục mật khẩu

  const handleResetPW = (userId: number, userEmail: string) => {
    confirm({
      title: 'Khôi phục mật khẩu',
      content: `Bạn chắc chắn muốn khôi phục mật khẩu của ${userEmail} chứ`,
      async onOk() {
        try {
          const result = await apis.adminApiModule.resetPW(userId)
          if (result.status == 200) {
            success(result.data.message)
            console.log(result.data.data);
          } else {
            error(result.data.message)
          }
          getPageUserList()
        } catch (err) {
          error(String(err))
        }
      },
      okText: 'Xác định',
      cancelText: 'Huỷ'
    });
  };

  return (
    <div className='content_container'>
    <h2 className='content_title'>Quản lý tài khoản người dùng</h2>
    <div className='toolBar'>
      <div className='searchBar'>
        <input type="text" placeholder='Tên tài khoản' onChange={(e)=>{setSearchByEmail(e.target.value == "" ? null : e.target.value)}}/>
        <input type="text" placeholder='Số điện thoại' onChange={(e)=>{setSearchByPhone(e.target.value == "" ? null : e.target.value)}}/>
        <label >Trạng thái: </label>
        <Select
          defaultValue={null}
          style={{ width: 120 , height: 25}}
          onChange={handleSelectorChange}
          options={[
            { value: null, label: 'Tất cả' },
            { value: true, label: 'Hoạt động' },
            { value: false, label: 'Tạm khoá' },
          ]}
        />
        <button className='searchBtn' onClick={()=>{getPageUserList()}}>Tìm kiếm</button>
        <div className='paginationBar'>
          <Pagination defaultCurrent={1} 
          total={resultCount} 
          pageSize={10}
          size='small' 
          onChange={handlePage} 
          />
        </div>
      </div>
    </div>
    <table className='content_table' border={1}  >
      <thead>
        <tr style={{ height: '40px' }}>
          <th style={{ width: '50px' }}>ID</th>
          <th style={{ width: '200px' }}>Tên tài khoản</th>
          <th style={{ width: '80px' }}>Trạng thái</th>
          <th style={{ width: '100px' }}>Số điện thoại</th>
          <th style={{ width: '150px' }}>Thời gian đăng ký</th>
          <th style={{ width: '150px' }}>Thời gian cập nhật</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {renderUserList && renderUserList.map(user => (
          <tr className='user_item' key={user.id} style={{ height: '20px' }}>
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.status ? 'Hoạt động' : 'Tạm khoá'}</td>
            <td>{user.phone}</td>
            <td>{handleDateType(user.createAt)}</td>
            <td>{handleDateType(user.updateAt)}</td>
            <td className='btnBar'>
              <button style={user.status ? { backgroundColor: 'red' } : { backgroundColor: 'green' }} onClick={() => { handleLock({ userId: user.id, userStatus: user.status }) }}>{user.status ? 'Khoá' : 'Mở khoá'}</button>
              <button style={{ backgroundColor: 'green' }}>Sửa số điện thoại</button>
              <button style={{ backgroundColor: 'orange' }} onClick={() => { handleResetPW(user.id, user.email) }}>Đặt lại mật khẩu</button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={6}>Tổng số người dùng</th>
          <th>{resultCount}</th>
        </tr>
      </tfoot>
    </table>
  </div>
  )
}
