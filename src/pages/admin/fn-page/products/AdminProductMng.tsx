import { apis } from "@/service/apis"
import { Modal, Pagination, PaginationProps, Select, Upload, message } from "antd"
import { useEffect, useRef, useState } from "react"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import '../../scss/fnPage.scss'

export default function AdminProductMng() {

  const [renderProductList, setRenderProductList] = useState<Array<any>>([])
  const [categoriesList, setCategoriesList] = useState<Array<any>>([])
  const [materialList, setMaterialList] = useState<Array<any>>([])
  const [madeByList, setMadeByList] = useState<Array<any>>([])
  const [brandsList, setBrandsList] = useState<Array<any>>([])

  const [categoriesOption, setCategoriesOption] = useState<Array<{ value: number | null, label: string }>>([{ value: null, label: "Chọn thể loại" }])
  const [materialOption, setMaterialOption] = useState<Array<{ value: number | null, label: string }>>([{ value: null, label: "Chọn chất liệu" }])
  const [brandsOption, setBrandsOption] = useState<Array<{ value: number | null, label: string }>>([{ value: null, label: "Chọn nhãn hiệu" }])
  const [madeByOption, setMadeByOption] = useState<Array<{ value: number | null, label: string }>>([{ value: null, label: "Chọn xuất xứ" }])


  useEffect(() => {
    setCategoriesOption(
      categoriesOption.concat(categoriesList.map(item => {
        return { value: item.id, label: item.categoryName }
      })))
  }, [categoriesList])

  useEffect(() => {
    setMaterialOption(
      materialOption.concat(materialList.map(item => {
        return { value: item.id, label: item.material }
      }))
    )
  }, [materialList])

  useEffect(() => {
    setMadeByOption(
      madeByOption.concat(madeByList.map(item => {
        return { value: item.id, label: item.country }
      }))
    )
  }, [madeByList])

  useEffect(() => {
    setBrandsOption(
      brandsOption.concat(brandsList.map(item => {
        return { value: item.id, label: item.brandName }
      }))
    )
  }, [brandsList])

  const [resultCount, setResultCount] = useState<number>(0)
  const pageSize = 10


  const error = (content: string) => {
    Modal.error({
      content: content,
    });
  };

  const success = (content: string) => {
    Modal.success({
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

      const result = await apis.adminProductsApiModule.search(searchOption)

      setResultCount(result.data.total)
      setRenderProductList(result.data.data)
    } catch (error) {

    }
  }

  const { confirm } = Modal;
  const handleStatusToggle = (item: { id: number, status: boolean }) => {
    confirm({
      title: 'Thay đổi trạng thái',
      content: `Bạn chắc chắn muốn ${item.status ? 'khoá' : 'mở khoá'} sản phẩm này chứ`,
      async onOk() {
        const result = await apis.adminProductsApiModule.changeStatus(item)
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

  //PopupConfig
  let popUpEl = useRef<any>(null)
  useEffect(()=>{
    const handlePopupTrigger = (e:any) => {
        if (!popUpEl.current?.contains(e.target)) {
            setAddNewDisplay(false)
        }
    }
    document.addEventListener('mousedown',handlePopupTrigger)
})

  const [addNewDisplay, setAddNewDisplay] = useState(false)
  const [addNewAvatar, setAddNewAvatar] = useState<any>(null)
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setAddNewAvatar(info.fileList[0].originFileObj)
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  //Thêm sản phẩm
  const [addNewPrName, setAddNewPrName] = useState<string>("")
  const [addNewPrPrice, setAddNewPrPrice] = useState<number | null>(null)
  const [addNewPrMaterial, setAddNewPrMaterial] = useState<number | null>(null)
  const [addNewPrBrand, setAddNewPrBrand] = useState<number | null>(null)
  const [addNewPrMadeBy, setAddNewPrMadeBy] = useState<number | null>(null)
  const [addNewPrCategory, setAddNewPrCategory] = useState<number | null>(null)

  const handleAddnewPrName = (value: string) => {
    setAddNewPrName(value)
  }
  const handleAddnewPrMaterial = (value: number) => {
    setAddNewPrMaterial(value)
  }
  const handleAddnewPrBrand = (value: number) => {
    setAddNewPrBrand(value)
  }
  const handleAddnewPrMadeBy = (value: number) => {
    setAddNewPrMadeBy(value)
  }
  const handleAddnewPrCategory = (value: number) => {
    setAddNewPrCategory(value)
  }

  const clearAddNewForm = () => {
    setAddNewAvatar(null)
    setImageUrl("")
    setAddNewPrName("")
    setAddNewPrPrice(null)
    setAddNewPrMaterial(null)
    setAddNewPrBrand(null)
    setAddNewPrMadeBy(null)
    setAddNewPrCategory(null)
  }

  const handleAddNew = async () => {
    const newProductDetail = {
      productName: addNewPrName,
      material: addNewPrMaterial,
      madeBy: addNewPrMadeBy,
      categoryId: addNewPrCategory,
      price: addNewPrPrice,
      brand: addNewPrBrand,
      createAt: String(Date.now()),
      updateAt: String(Date.now())
    }

    if (addNewPrName == "") {
      error("Tên sản phẩm không được để trống")
      return
    }
    if (addNewPrMaterial == null) {
      error("Chất liệu không được để trống")
      return
    }
    if (addNewPrMadeBy == null) {
      error("Xuất xứ không được để trống")
      return
    }
    if (addNewPrCategory == null) {
      error("Thể loại không được để trống")
      return
    }
    if (addNewPrPrice == null || addNewPrPrice == 0) {
      error("Giá không được để trống")
      return
    }
    if (addNewPrBrand == null) {
      error("Nhãn hiệu không được để trống")
      return
    }
    if (addNewAvatar == null) {
      error("Xin hãy đăng tải ít nhất 1 hình")
      return
    }

    let productFormData = new FormData();
    productFormData.append("data", JSON.stringify(newProductDetail))
    productFormData.append("avatar", addNewAvatar as any)

    try {
      const result = await apis.adminProductsApiModule.createNew(productFormData)
      if (result.status == 200) {
        success(result.data.message)
        getPageProductList()
        clearAddNewForm()
        setAddNewDisplay(false)
        return
      } else {
        error(result.data.error)
      }
    } catch (err) {
      error("Lỗi, xin hãy thử lại sau")
    }
  }

  const handleDelete = (item:{id:number}) => {
    confirm(
      {title: 'Xác nhận xoá?',
      content: `Bạn chắc chắn muốn xoá sản phẩm này chứ?`,
      async onOk() {
        const result = await apis.adminProductsApiModule.delete(item)
        if (result.status == 200) {
          success(result.data.message)
        } else {
          error(result.data.error)
        }
        getPageProductList()
      },
      okText: 'Xác định',
      cancelText: 'Huỷ'}
    )
  }

  return (
    <div className='content_container'>
      <div ref={popUpEl} className={addNewDisplay ? "popupWindow addNew active" : "popupWindow addNew"}>
        <h2>Thêm mới sản phẩm</h2>
        <div className="popupWindow-inputForm">
          <input type="text" value={addNewPrName} placeholder="Tên sản phẩm" onChange={(e) => { handleAddnewPrName(e.target.value) }} />
          <input type="number" value={String(addNewPrPrice)} placeholder="Giá sản phẩm" onChange={(e) => { setAddNewPrPrice(Number(e.target.value)) }} />
          <Select
            ref={popUpEl}
            value={addNewPrMaterial}
            style={{ width: 150, height: 25 }}
            onChange={handleAddnewPrMaterial}
            size="small"
            options={materialOption}
          />
          <Select
            ref={popUpEl}
            value={addNewPrMadeBy}
            style={{ width: 150, height: 25 }}
            onChange={handleAddnewPrMadeBy}
            size="small"
            options={madeByOption}
          />
          <Select
            ref={popUpEl}
            value={addNewPrBrand}
            style={{ width: 150, height: 25 }}
            onChange={handleAddnewPrBrand}
            size="small"
            options={brandsOption}
          />
          <Select
            ref={popUpEl}
            value={addNewPrCategory}
            style={{ width: 150, height: 25 }}
            onChange={handleAddnewPrCategory}
            size="small"
            options={categoriesOption}
          />
        </div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <div className="permis_btnBox">
          <button onClick={() => { handleAddNew() }}>Xác nhận</button>
          <button onClick={() => {
            setAddNewDisplay(false);
            clearAddNewForm()
          }}>Huỷ</button>
        </div>
      </div>
      <h2 className='content_title'>Quản lý sản phẩm</h2>
      <div className='toolBar'>
        <div className='searchBar'>
          <input type="text" placeholder='Tên sản phẩm' onChange={(e) => { setSearchName(e.target.value) }} />
          <Select
            value={null}
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
            value={null}
            style={{ width: 140, height: 25 }}
            onChange={handleMaterialSelector}
            size="small"
            options={materialOption}
          />
          <Select
            value={null}
            style={{ width: 140, height: 25 }}
            onChange={handleMadeBySelector}
            size="small"
            options={madeByOption}
          />
          <Select
            value={null}
            style={{ width: 140, height: 25 }}
            onChange={handleBrandChange}
            size="small"
            options={brandsOption}
          />
          <Select
            value={null}
            style={{ width: 140, height: 25 }}
            onChange={handleCategoryChange}
            size="small"
            options={categoriesOption}
          />
          <button className='btn search' onClick={() => { getPageProductList() }}>Tìm kiếm</button>
          <button className='btn add' disabled={addNewDisplay ? true : false} onClick={() => { setAddNewDisplay(true) }}>Thêm mới</button>
        </div>
      </div>
      <table className='content_table' border={1}  >
        <thead>
          <tr style={{ height: '40px' }}>
            <th style={{ width: '50px' }}>STT</th>
            <th style={{ width: '50px' }}>ID</th>
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
          {renderProductList && renderProductList.filter(item=>item.deleted == 0).map((item, index) => (
            <tr className='user_item' key={Math.random() * Date.now()} style={{ height: '20px' }}>
              <td>{(current - 1) * pageSize + index + 1}</td>
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
                <button style={item.status ? { backgroundColor: 'red' } : { backgroundColor: 'green' }} onClick={() => { handleStatusToggle(item) }}>{item.status ? 'Khoá' : 'Mở khoá'}</button>
                <button style={{ backgroundColor: 'orange' }}>Thêm ảnh</button>
                <button style={{ backgroundColor: 'red' }} onClick={()=>{handleDelete(item)}}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={11}>Tổng số người dùng</th>
            <th>{resultCount}</th>
          </tr>
        </tfoot>
      </table>
      <div className='paginationBar'>
        <Pagination defaultCurrent={1}
          total={resultCount}
          pageSize={10}
          size='small'
          onChange={handlePage}
        />
      </div>
    </div>
  )
}
