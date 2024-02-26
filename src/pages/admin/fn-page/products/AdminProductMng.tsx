import { apis } from "@/service/apis"
import { Modal, Pagination, PaginationProps, Select } from "antd"
import { useEffect, useState } from "react"
import '../../scss/fnPage.scss'

export default function AdminProductMng() {

  const [renderProductList, setRenderProductList] = useState<Array<any>>([])
  const [categoriesList, setCategoriesList] = useState<Array<any>>([])
  const [materialList, setMaterialList] = useState<Array<any>>([])
  const [madeByList, setMadeByList] = useState<Array<any>>([])
  const [brandsList, setBrandsList] = useState<Array<any>>([])

  const [categoriesOption , setCategoriesOption] = useState<Array<{value:number|null,label:string}>>([{value:null,label:"Chọn thể loại"}])
  const [materialOption , setMaterialOption] = useState<Array<{value:number|null,label:string}>>([{value:null,label:"Chọn chất liệu"}])
  const [brandsOption , setBrandsOption] = useState<Array<{value:number|null,label:string}>>([{value:null,label:"Chọn nhãn hiệu"}])
  const [madeByOption , setMadeByOption] = useState<Array<{value:number|null,label:string}>>([{value:null,label:"Chọn xuất xứ"}])


  useEffect(()=>{
    setCategoriesOption(
      categoriesOption.concat(categoriesList.map(item => {
      return {value:item.id , label:item.categoryName}
    })))
  },[categoriesList])

  useEffect(()=>{
    setMaterialOption(
      materialOption.concat(materialList.map(item => {
        return {value:item.id , label:item.material}
      }))
    )
  },[materialList])

  useEffect(()=>{
    setMadeByOption(
      madeByOption.concat(madeByList.map(item => {
        return {value:item.id , label:item.country}
      }))
    )
  },[madeByList])

  useEffect(()=>{
    setBrandsOption(
      brandsOption.concat(brandsList.map(item => {
        return {value:item.id , label:item.brandName}
      }))
    )
  },[brandsList])

  const [resultCount, setResultCount] = useState<number>(0)
  const pageSize = 10


  const error = (content: string) => {
    Modal.error({
      content: content,
    });
  };
  
  //Phân trang
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    getPageProductList()
    getSearchSelector(null)
  }, [current])

  const handlePage: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };

  //Tìm kiếm
  const [searchName, setSearchName] = useState<string>("")
  const [searchMaterial, setSearchMaterial] = useState<number | null>(null)
  const handleMaterialSelector = (value: number | null) => {
    setSearchMaterial(value)
  }

  const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
  const handleStatusChange = (value: boolean | null) => {
    setSearchStatus(value)
  };

  const [searchMadeBy, setSearchMadeBy] = useState<number | null>(null)
  const handleMadeBySelector = (value: number | null) => {
    setSearchMadeBy(value)
  };

  const [searchCategory, setSearchCategory] = useState<number | null>(null)
  const handleCategoryChange = (value: number | null) => {
    setSearchCategory(value)
  };

  const [searchBrand, setSearchBrand] = useState<number | null>(null)
  const handleBrandChange = (value: number | null) => {
    setSearchBrand(value)
  };

  const getSearchSelector = async (type: number | null) => {
    try {
      let material;
      let categories;
      let madeBy;
      let brands;
      switch (type) {
        case null:
          material = await apis.adminProductsApiModule.getProductMaterial()
          categories = await apis.adminProductsApiModule.getProductCategories()
          madeBy = await apis.adminProductsApiModule.getProductmadeBy()
          brands = await apis.adminProductsApiModule.getProductBrand()
          break;
        case 1:
          material = await apis.adminProductsApiModule.getProductMaterial()
          break;
        case 2:
          categories = await apis.adminProductsApiModule.getProductCategories()
          break;
        case 3:
          madeBy = await apis.adminProductsApiModule.getProductmadeBy()
          break;
        case 4:
          brands = await apis.adminProductsApiModule.getProductBrand()
          break;
        default:
          break;
      }
      setBrandsList(brands?.data.data || [])
      setCategoriesList(categories?.data.data || [])
      setMadeByList(madeBy?.data.data || [])
      setMaterialList(material?.data.data || [])
    } catch (err) {
      error('lấy dữ liệu thất bại')
    }
  }

  const getPageProductList = async () => {
    try {
      const searchOption = {
        productName: searchName,
        material: searchMaterial,
        status: searchStatus,
        madeBy: searchMadeBy,
        category: searchCategory,
        brand: searchBrand,
        currentPage: current,
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
  /*
  const success = (content: string) => {
    Modal.success({
      content: content,
    });
  };


*/
  return (
    <div className='content_container'>
      <h2 className='content_title'>Quản lý sản phẩm</h2>
      <div className='toolBar'>
        <div className='searchBar'>
          <input type="text" placeholder='Tên sản phẩm' onChange={(e) => { setSearchName(e.target.value) }} />
          <Select
            defaultValue={null}
            style={{ width: 140, height: 25 }}
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
            style={{ width: 140, height: 25 }}
            onChange={handleMaterialSelector}
            size="small"
            options={materialOption}
          />
          <Select
            defaultValue={null}
            style={{ width: 140, height: 25 }}
            onChange={handleMadeBySelector}
            size="small"
            options={madeByOption}
          />
          <Select
            defaultValue={null}
            style={{ width: 140, height: 25 }}
            onChange={handleBrandChange}
            size="small"
            options={brandsOption}
          />
          <Select
            defaultValue={null}
            style={{ width: 140, height: 25 }}
            onChange={handleCategoryChange}
            size="small"
            options={categoriesOption}
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
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Thể loại</th>
            <th>Nhãn hiệu</th>
            <th>Xuất xứ</th>
            <th>Chất liệu</th>
            <th>Thời gian đăng ký</th>
            <th>Thời gian cập nhật</th>
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
              <td>{item.FK_products_brands.brandName}</td>
              <td>{item.FK_products_madeBy.country}</td>
              <td>{item.FK_products_material.material}</td>
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
            <th colSpan={10}>Tổng số người dùng</th>
            <th>{resultCount}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
