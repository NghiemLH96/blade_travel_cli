import { apis } from "@/service/apis"
import { Modal, Pagination, PaginationProps, Select } from "antd"
import { useEffect, useRef, useState } from "react"
import '../../scss/fnPage.scss'

export default function AdminAccsMng() {

    const [renderAdminsList, setRenderAdminsList] = useState<Array<any>>([])
    const [resultCount, setResultCount] = useState<number>(0)
    const pageSize = 10

    //Tìm kiếm
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    const [searchByUsername, setSearchByUsername] = useState<string>("")

    const handleSelectorChange = (value: boolean | null) => {
        setSearchStatus(value)
    };

    //Phân trang
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        getPageAdminsList()
    }, [current])

    const handlePage: PaginationProps['onChange'] = (page) => {
        setCurrent(page);
    };

    const getPageAdminsList = async () => {
        try {
            const result = await apis.adminAccsMngApiModule.search({ status: searchStatus, username: searchByUsername, currentPage: current, pageSize })
            console.log('page', result);

            setResultCount(result.data.count)
            setRenderAdminsList(result.data.data)
        } catch (error) {

        }
    }

    //time format
    const handleDateType = (timeString: string) => {
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

    const handleLock = (admin: { id: number, status: boolean }) => {
        confirm({
            title: 'Thay đổi trạng thái',
            content: `Bạn chắc chắn muốn ${admin.status ? 'khoá' : 'mở khoá'} tài khoản này chứ`,
            async onOk() {
                const result = await apis.adminAccsMngApiModule.changeStatus(admin);
                if (result.status == 200) {
                    success(result.data.message)
                } else {
                    error(result.data.error)
                }
                getPageAdminsList()
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

    //Thay đổi chức vụ
    const [editPermission, setEditPermission] = useState(false)
    const [permisChange , setPermisChange] = useState<string>('null')
    const [editingAdminId , setEditingAdminId] =  useState<number>(0)
    const [editingAdminName , setEditingAdminName] =  useState<string>('')
    let editPermisEl = useRef<HTMLInputElement>(null)
    useEffect(()=>{
        const handlePopupTrigger = (e:any) => {
            if (!editPermisEl.current?.contains(e.target)) {
                setEditPermission(false)
                setPermisChange('null')
            }
        }
        document.addEventListener('mousedown',handlePopupTrigger)
    })

    const handlePermissionChange = async() => {
        try {
            const result = await apis.adminAccsMngApiModule.changeDepartment({id:editingAdminId,department:permisChange})
            if (result.status == 200) {
                success(result.data.message)
                getPageAdminsList()
            }else{
                error(result.data.error)
            }
        } catch (err) {
            console.log("lỗi",err);
            
        }
    }

    return (
        <div className='content_container'> 
            <div ref={editPermisEl} className={editPermission ? "editPermiss_container active" : "editPermiss_container"}>
                <h2>Thay đổi chức vụ</h2>
                <p>Xin hãy chọn chức vụ cho quản trị viên {editingAdminName}</p>
                <select className="permis_selector" value={permisChange} onChange={(e)=>{setPermisChange(e.target.value)}}>
                        <option value='specialist'>Quản trị viên</option>
                        <option value='manager'>Quản lý</option>
                </select>
                <div className="permis_btnBox">
                    <button onClick={()=>{handlePermissionChange()}}>Xác nhận</button>
                </div>
            </div>
            <h2 className='content_title'>Quản lý tài khoản quản trị viên</h2>
            <div className='toolBar'>
                <div className='searchBar'>
                    <input className="adminAccs-searchInput" type="text" placeholder='Tên tài khoản' onChange={(e) => { setSearchByUsername(e.target.value) }} />
                    <label >Trạng thái: </label>
                    <Select
                        defaultValue={null}
                        style={{ width: 120, height: 25 }}
                        onChange={handleSelectorChange}
                        options={[
                            { value: null, label: 'Tất cả' },
                            { value: true, label: 'Hoạt động' },
                            { value: false, label: 'Tạm khoá' },
                        ]}
                    />
                    <button className='searchBtn' onClick={() => { getPageAdminsList() }}>Tìm kiếm</button>
                    <div className='paginationBar'>
                        <Pagination defaultCurrent={1}
                            total={resultCount}
                            pageSize={pageSize}
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
                        <th>Tên tài khoản</th>
                        <th>Trạng thái</th>
                        <th>Chức vụ</th>
                        <th>Thời gian đăng ký</th>
                        <th>Thời gian cập nhật</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {renderAdminsList && renderAdminsList.map(admin => (
                        <tr className='user_item' key={admin.id} style={{ height: '20px' }}>
                            <td>{admin.id}</td>
                            <td>{admin.username}</td>
                            <td>{admin.status ? 'Hoạt động' : 'Tạm khoá'}</td>
                            <td>{admin.department == 'specialist' ? "Quản trị viên" : admin.department == 'manager' ? "Quản lý" : "Giám đốc"}</td>
                            <td>{handleDateType(admin.createAt)}</td>
                            <td>{handleDateType(admin.updateAt)}</td>
                            <td className='btnBar'>
                                <button style={admin.status ? { backgroundColor: 'red' } : { backgroundColor: 'green' }} onClick={() => { handleLock({ id: admin.id, status: admin.status }) }}>{admin.status ? 'Khoá' : 'Mở khoá'}</button>
                                <button style={{ backgroundColor: 'green' }} onClick={() => { 
                                    setEditPermission(true)
                                    setEditingAdminId(admin.id)
                                    setEditingAdminName(admin.username)
                                    setPermisChange(admin.department)
                                    console.log(admin.department);
                                    
                                     }}>Thay đổi chức vụ</button>
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
