import { apis } from "@/service/apis"
import { Modal, Pagination, PaginationProps, Select } from "antd"
import { useEffect, useState } from "react"
import '../../scss/fnPage.scss'

export default function AdminProductMng() {

  const [renderProductList, setRenderProductList] = useState<Array<any>>([])
  const [resultCount, setResultCount] = useState<number>(0)
  const pageSize = 10

  //Phân trang
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    getPageProductList()
  }, [current])

  const handlePage: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };

  //Tìm kiếm
  const [searchName, setSearchName] = useState<string>("")
  const [searchMaterial, setSearchMaterial] = useState<string | null>(null)
  const handleMaterialSelector = (value: string | null) => {
    setSearchMaterial(value)
  }

  const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
  const handleStatusChange = (value: boolean | null) => {
    setSearchStatus(value)
  };

  const [searchMadeBy, setSearchMadeBy] = useState<string | null>(null)
  const handleMadeBySelector = (value: string | null) => {
    setSearchMadeBy(value)
  };

  const [searchCategory, setSearchCategory] = useState<string | null>(null)
  const handleCategoryChange = (value: string | null) => {
    setSearchCategory(value)
  };

  const [searchBrand, setSearchBrand] = useState<string | null>(null)
  const handleBrandChange = (value: string | null) => {
    setSearchBrand(value)
  };

  const getPageProductList = async () => {
    try {
      const searchOption = {
        productName: searchName,
        material: searchMaterial,
        status: searchStatus,
        madeBy: searchMadeBy,
        category: searchCategory,
        brand: searchBrand,
        currentPage:current,
        pageSize
      }
      console.log(searchOption);

      const result = await apis.adminProductsApiModule.search(searchOption)
      console.log(result.data.data);

      setResultCount(result.data.total)
      setRenderProductList(result.data.data)
    } catch (error) {

    }
  }











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
        getPageProductList()
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
          getPageProductList()
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
      <h2 className='content_title'>Quản lý sản phẩm</h2>
      <div className='toolBar'>
        <div className='searchBar'>
          <input type="text" placeholder='Tên sản phẩm' onChange={(e) => { setSearchName(e.target.value) }} />
          <Select
            defaultValue={null}
            style={{ width: 120, height: 25 }}
            onChange={handleStatusChange}
            size="small"
            options={[
              { value: null, label: 'Chọn trạng thái' },
              { value: true, label: 'Hoạt động' },
              { value: false, label: 'Tạm khoá' },
            ]}
          />
          <Select
            defaultValue={null}
            style={{ width: 120, height: 25 }}
            onChange={handleMaterialSelector}
            size="small"
            options={[
              { value: null, label: 'Chọn chất liệu' },
              { value: 'inox', label: 'Inox' },
              { value: 'aluminum', label: 'Nhôm' },
              { value: 'other', label: 'Khác' }
            ]}
          />
          <Select
            defaultValue={null}
            style={{ width: 120, height: 25 }}
            onChange={handleMadeBySelector}
            size="small"
            options={[
              { value: null, label: 'Chọn xuất xứ' },
              { value: 'england', label: 'Anh' },
              { value: 'china', label: 'Trung Quốc' },
              { value: 'taiwan', label: 'Đài loan' },
              { value: 'japan', label: 'Nhật Bản' },
              { value: 'hongkong', label: 'Hồng Kong' },
              { value: 'vietnam', label: 'Việt Nam' },
              { value: 'other', label: 'Khác' },
            ]}
          />
          <Select
            defaultValue={null}
            style={{ width: 120, height: 25 }}
            onChange={handleBrandChange}
            size="small"
            options={[
              { value: null, label: 'Chọn nhãn hiệu' },
              { value: 'jett', label: 'Jett' },
              { value: 'hero', label: 'Hero' },
              { value: 'fonix', label: 'Fonix' },
              { value: 'giant', label: 'Giant' },
              { value: 'life', label: 'Life' },
              { value: 'hitasa', label: 'Hitasa' },
              { value: 'other', label: 'Khác' },
            ]}
          />
          <Select
            defaultValue={null}
            style={{ width: 120, height: 25 }}
            onChange={handleCategoryChange}
            size="small"
            options={[
              { value: null, label: 'Chọn thể loại' },
              { value: 1, label: 'Xe leo núi' },
              { value: 2, label: 'Xe đường trường' },
              { value: 3, label: 'Xe người lớn' },
              { value: 4, label: 'Xe trẻ em' },
              { value: 5, label: 'Phụ kiện' },
            ]}
          />
          <button className='searchBtn' onClick={() => { getPageProductList() }}>Tìm kiếm</button>
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
            <th style={{ width: '200px' }}>Tên sản phẩm</th>
            <th style={{ width: '100px' }}>Giá</th>
            <th style={{ width: '80px' }}>Trạng thái</th>
            <th style={{ width: '100px' }}>Thể loại</th>
            <th style={{ width: '100px' }}>Nhãn hiệu</th>
            <th style={{ width: '100px' }}>Xuất xứ</th>
            <th style={{ width: '100px' }}>Chất liệu</th>
            <th style={{ width: '150px' }}>Thời gian đăng ký</th>
            <th style={{ width: '150px' }}>Thời gian cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {renderProductList && renderProductList.map(item => (
            <tr className='user_item' key={item.id} style={{ height: '20px' }}>
              <td>{item.id}</td>
              <td>{item.productName}</td>
              <td>{item.price}</td>
              <td>{item.status ? 'Hoạt động' : 'Tạm khoá'}</td>
              <td>{item.FK_products_categories.categoryName}</td>
              <td>{item.brand.toUpperCase()}</td>
              <td>{item.madeBy.toUpperCase()}</td>
              <td>{item.material.toUpperCase()}</td>
              <td>{handleDateType(item.createAt)}</td>
              <td>{handleDateType(item.updateAt)}</td>
              <td className='btnBar'>
                <button style={item.status ? { backgroundColor: 'red' } : { backgroundColor: 'green' }}>{item.status ? 'Khoá' : 'Mở khoá'}</button>
                <button style={{ backgroundColor: 'green' }}>Sửa số điện thoại</button>
                <button style={{ backgroundColor: 'orange' }}>Đặt lại mật khẩu</button>
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
