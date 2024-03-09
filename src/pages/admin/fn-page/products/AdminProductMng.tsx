import { apis } from "@/service/apis"
import { Button, Flex, Form, Input, Modal, PaginationProps, Select, Space, Table, Upload, message } from "antd"
import { useEffect, useState } from "react"
import type { TableProps, UploadFile, UploadProps } from 'antd';
import '../../scss/fnPage.scss'
import { ModalForm, ProForm, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";

export default function AdminProductMng() {

  const [renderProductList, setRenderProductList] = useState<Array<any>>([])
  const [categoriesList, setCategoriesList] = useState<Array<any>>([])
  const [materialList, setMaterialList] = useState<Array<any>>([])
  const [madeByList, setMadeByList] = useState<Array<any>>([])
  const [brandsList, setBrandsList] = useState<Array<any>>([])

  const [categoriesOption, setCategoriesOption] = useState<Array<{ value: number | null, label: string }>>([])
  const [materialOption, setMaterialOption] = useState<Array<{ value: number | null, label: string }>>([])
  const [brandsOption, setBrandsOption] = useState<Array<{ value: number | null, label: string }>>([])
  const [madeByOption, setMadeByOption] = useState<Array<{ value: number | null, label: string }>>([])

  useEffect(() => {
    let cateOption = categoriesList.map(item => {
      return { value: item.id, label: item.categoryName }
    });
    setCategoriesOption(cateOption);

    let mateOption = materialList.map(item => {
      return { value: item.id, label: item.material }
    });
    setMaterialOption(mateOption);

    let brandOption = brandsList.map(item => {
      return { value: item.id, label: item.brandName }
    });
    setBrandsOption(brandOption)

    let countryOption = madeByList.map(item => {
      return { value: item.id, label: item.country }
    });
    setMadeByOption(countryOption)

  }, [categoriesList, madeByList, materialList, brandsList])

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

  const clearSearch = () => {
    setSearchName("");
    setSearchMaterial(null);
    setSearchStatus(null);
    setSearchMadeBy(null);
    setSearchCategory(null)
    setSearchBrand(null)
  }

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
      console.log(err);

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

      const result = await apis.adminProductsApiModule.productFilter(searchOption)

      setResultCount(result.data.count)
      setRenderProductList(result.data.data)
    } catch (error) {
      console.log("error", error);

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

  //Thêm sản phẩm

  const handleDelete = (item: { id: number }) => {
    confirm(
      {
        title: 'Xác nhận xoá?',
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
        cancelText: 'Huỷ'
      }
    )
  }
  //searchBar
  const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 50,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 6,
    border: '1px solid #40a9ff',
    backgroundColor: '#FFFFFF'
  };

  //table
  interface DataType {
    id: number;
    productName: string;
    price: number;
    material: number;
    madeBy: number;
    brand: number;
    status: boolean;
    avatar: string | null
    FK_products_categories: { categoryName: string },
    FK_products_brands: { brandName: string },
    FK_products_madeBy: { madeBy: string },
    FK_products_material: { material: string },
  }

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const [uploadImgForm] = Form.useForm<{ username: string; passwords: string; department: number }>();
  const [editForm] = Form.useForm<{
    productName: string,
    price: number,
    material: number | null,
    categoryId: number | null,
    brand: number | null,
    madeBy: number | null
  }>();
  const [uploadImg, setUploadImg] = useState<UploadFile[]>([])

  const handleUploadPics = async (id: number) => {
    if (uploadImg.length != 0) {
      let originObjImgList = uploadImg.map(item => {
        return item.originFileObj
      })
      let uploadAvatarFormData = new FormData;
      for (let i in originObjImgList) {
        uploadAvatarFormData.append('uploadImgs', originObjImgList[i] as any)
      }
      uploadAvatarFormData.append('productId', String(id))
      try {
        const result = await apis.adminProductsApiModule.uploadImgs(uploadAvatarFormData)
        if (result.status == 200) {
          message.success(result.data.message)
          return true
        } else {
          message.error("Đăng tải hình ảnh thất bại")
          return false
        }
      } catch (error) {
        message.error("Đăng tải hình ảnh thất bại")
        return false
      }
    } else {
      message.warning("Xin hãy đăng tải hình ảnh")
      return false
    }

  };

  const handleUploadImgs: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      setUploadImg(info.fileList)
    }
  };

  const handleRemoveImgs: UploadProps['onRemove'] = (file) => {
    const index = uploadImg.indexOf(file);
    const newFileList = uploadImg.slice();
    newFileList.splice(index, 1);
    setUploadImg(newFileList);
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Product Image',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) =>
        <img style={{ width: "70px", height: "70px" }} src={avatar} alt="" />
    }, {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        <span>{status ? "Hoạt động" : "Tạm khoá"}</span>
    },
    {
      title: 'Material',
      dataIndex: 'FK_products_material',
      key: 'material',
      render: (FK_products_material) =>
        <span>{FK_products_material.material}</span>
    },
    {
      title: 'Made By',
      dataIndex: 'FK_products_madeBy',
      key: 'madeBy',
      render: (FK_products_madeBy) =>
        <span>{FK_products_madeBy.country}</span>
    },
    {
      title: 'Category',
      dataIndex: 'FK_products_categories',
      key: 'categoryId',
      render: (FK_products_categories) =>
        <span>{FK_products_categories.categoryName}</span>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        <span>{price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}</span>
    },
    {
      title: 'createAt',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (createAt) => <span>{handleDateType(createAt)}</span>,
    },
    {
      title: 'updateAt',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (updateAt) => <span>{handleDateType(updateAt)}</span>
    },
    {
      title: 'Brand',
      dataIndex: 'FK_products_brands',
      key: 'brand',
      render: (FK_products_brands) =>
        <span>{FK_products_brands.brandName}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) =>
        <Space size="small">
          <Button style={{ width: "75px" }} type="primary" danger={record.status == true} size={"small"} onClick={() => { handleStatusToggle(record) }}>
            {record.status ? "Khoá" : "Mở Khoá"}
          </Button>
          <Button style={{ width: "75px" }} danger size={"small"} onClick={() => { handleDelete(record) }}>
            Xoá
          </Button>
          <ModalForm<{
            productName: string,
            price: number,
            material: number | null,
            categoryId: number | null,
            brand: number | null,
            madeBy: number | null
          }>
            title="Chỉnh sửa thông tin sản phẩm"
            trigger={
              <Button size="small" type="primary">
                 Chỉnh sửa
              </Button>
            }
            form={editForm}
            autoFocusFirstInput
            variant="filled"
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              await waitTime(2000);
              const productDetail = {id:record.id,...values}
              try {
                const result = await apis.adminProductsApiModule.updateDetail(productDetail)
                if (result.status == 200) {
                  message.success(result.data.message)
                  getPageProductList()
                  return true
                }else{
                  message.error("Chỉnh sửa thất bại")
                }
              } catch (error) {
                message.error("Server bận thử lại sau nhé")
              }
            }}
          >
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="productName"
                  label="Tên sản phẩm"
                  tooltip="Tối đa 20 ký tự"
                  placeholder="Tên sản phẩm"
                  initialValue={record.productName}
                  required
                />
                <ProFormMoney
                  label="Giá"
                  name="price"
                  locale='vi-VN'
                  initialValue={record.price}
                  required
                  min={0}
                  trigger="onBlur"
                />
                <ProFormSelect
                  initialValue={record.material}
                  width="md"
                  options={
                    materialOption
                  }
                  required
                  name="material"
                  label="Chất liệu"
                />
                <ProFormSelect
                  initialValue={record.madeBy}
                  width="md"
                  options={
                    madeByOption
                  }
                  required
                  name="madeBy"
                  label="Xuất xứ"
                />
                <ProFormSelect
                  initialValue={record.brand}
                  width="md"
                  options={
                    brandsOption
                  }
                  required
                  name="brand"
                  label="Nhãn hiệu"
                />
                <ProFormSelect
                  initialValue={record.categoryId}
                  width="md"
                  options={
                    categoriesOption
                  }
                  required
                  name="categoryId"
                  label="Thể loại"
                />
              </ProForm.Group>
          </ModalForm>
          <ModalForm<{
            username: string;
            passwords: string;
            department: number
          }>
            title="Thêm hình sản phẩm"
            trigger={
              <Button size="small" type="primary">
                Thêm ảnh
              </Button>
            }
            form={uploadImgForm}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={async () => {
              await waitTime(2000);
              const flag = await handleUploadPics(record.id)
              if (flag) {
                return true
              }
            }}
          >
            <ProForm.Group>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                defaultFileList={[]}
                onChange={handleUploadImgs}
                onRemove={handleRemoveImgs}
                multiple
                maxCount={3}
              >
                <Button >Upload</Button>
              </Upload>

            </ProForm.Group>
          </ModalForm>
        </Space>,
    }
  ]

  const data: DataType[] = renderProductList.filter(item => item.deleted == 0)


  const [addNewProductForm] = Form.useForm<{
    productName: string,
    price: number,
    material: number | null,
    categoryId: number | null,
    brand: number | null,
    madeBy: number | null
  }>();

  const [addNewAvatar, setAddNewAvatar] = useState<UploadFile | null>()

  const handleAddAvatar: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      setAddNewAvatar(info.fileList[0])
    }
  };

  const handleRemoveAvatar: UploadProps['onRemove'] = () => {
    setAddNewAvatar(null);
  };



  return (
    <div className='content_container'>
      <h2 className='content_title'>Danh sách sản phẩm</h2>
      <Flex gap="middle" align="start" vertical>
        <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
          <Input style={{ width: 120 }} value={searchName} size="small" type="text" placeholder="Tên sản phẩm" onChange={(e) => { setSearchName(e.target.value) }} />
          <Select
            value={searchStatus}
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
            value={searchMaterial}
            style={{ width: 140, height: 25 }}
            onChange={handleMaterialSelector}
            size="small"
            options={[{ value: null, label: "Chọn chất liệu" }, ...materialOption]}
          />
          <Select
            value={searchMadeBy}
            style={{ width: 140, height: 25 }}
            onChange={handleMadeBySelector}
            size="small"
            options={[{ value: null, label: "Chọn xuất xứ" }, ...madeByOption]}
          />
          <Select
            value={searchBrand}
            style={{ width: 140, height: 25 }}
            onChange={handleBrandChange}
            size="small"
            options={[{ value: null, label: "Chọn nhãn hiệu" }, ...brandsOption]}
          />
          <Select
            value={searchCategory}
            style={{ width: 140, height: 25 }}
            onChange={handleCategoryChange}
            size="small"
            options={[{ value: null, label: "Chọn thể loại" }, ...categoriesOption]}
          />
          <Button danger size={"small"} onClick={() => { getPageProductList() }}>
            Tìm kiếm
          </Button>
          <Button type="default" size={"small"} onClick={() => { clearSearch() }}>
            Làm mới
          </Button>
          <ModalForm<{
            productName: string,
            price: number,
            material: number | null,
            categoryId: number | null,
            brand: number | null,
            madeBy: number | null
          }>
            title="Thêm mới"
            trigger={
              <Button size="small" type="primary">
                Thêm mới
              </Button>
            }
            form={addNewProductForm}
            autoFocusFirstInput
            variant="filled"
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              await waitTime(2000);
              try {
                let errorList = []
                //kiểm tra ảnh đại diện
                if (!addNewAvatar) {
                  errorList.push('Xin hãy đăng tải ảnh đại diện')

                }

                //kiểm tra tên sản phẩm
                if (!values.productName) {
                  errorList.push('Tên sản phẩm không được để trống')
                } else {
                  if (values.productName.length > 20) {
                    errorList.push('Tên sản phẩm không được quá 20 ký tự')
                  }
                }

                //kiểm tra giá
                if (Number(values.price) == 0) {
                  errorList.push('Mời nhập giá của sản phẩm')
                }

                if (isNaN(Number(values.price))) {
                  errorList.push('Giá sản phẩm không hợp lệ')
                }

                //kiểm tra trường chất liệu
                if (!values.material) {
                  errorList.push('Chất liệu không được để trống')
                }

                //kiểm tra trường nhãn hiệu
                if (!values.brand) {
                  errorList.push('Nhãn hiệu không được để trống')
                }

                //kiểm tra trường thể loại
                if (!values.categoryId) {
                  errorList.push('Thể loại không được để trống')

                }

                //kiểm tra trường xuất xứ
                if (!values.madeBy) {
                  errorList.push('Xuất xứ không được để trống')
                }

                if (errorList.length > 0) {
                  message.error(<section style={{ textAlign: 'start', fontSize: '12px', color: 'red' }}>
                    <h4 style={{ textAlign: 'center' }}>Thiếu thông tin</h4>
                    {errorList.map(text => (
                      <p>- {text}<br /></p>
                    ))}
                  </section>)
                  return false
                }
                let productFormData = new FormData();
                productFormData.append("data", JSON.stringify(values))
                productFormData.append("avatar", addNewAvatar?.originFileObj as any)
                console.log(addNewAvatar);

                try {
                  const result = await apis.adminProductsApiModule.createNew(productFormData)
                  if (result.status == 200) {
                    success(result.data.message)
                    getPageProductList()
                    return true
                  }
                  if (result.status == 214) {
                    error(result.data.message)
                    getPageProductList()
                    return false
                  }
                } catch (err) {
                  error("Lỗi, xin hãy thử lại sau")
                }

              } catch (error) {

              }
            }}
          >
            <ProForm.Group>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                defaultFileList={[]}
                onChange={handleAddAvatar}
                onRemove={handleRemoveAvatar}
                maxCount={1}
              >
                <Button >Upload</Button>
              </Upload>
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="productName"
                  label="Tên sản phẩm"
                  tooltip="Tối đa 20 ký tự"
                  placeholder="Tên sản phẩm"
                  required
                />
                <ProFormMoney
                  label="Giá"
                  name="price"
                  locale='vi-VN'
                  initialValue={0}
                  required
                  min={0}
                  trigger="onBlur"
                />
                <ProFormSelect
                  initialValue={null}
                  width="md"
                  options={
                    materialOption
                  }
                  required
                  name="material"
                  label="Chất liệu"
                />
                <ProFormSelect
                  initialValue={null}
                  width="md"
                  options={
                    madeByOption
                  }
                  required
                  name="madeBy"
                  label="Xuất xứ"
                />
                <ProFormSelect
                  initialValue={null}
                  width="md"
                  options={
                    brandsOption
                  }
                  required
                  name="brand"
                  label="Nhãn hiệu"
                />
                <ProFormSelect
                  initialValue={null}
                  width="md"
                  options={
                    categoriesOption
                  }
                  required
                  name="categoryId"
                  label="Thể loại"
                />
              </ProForm.Group>
            </ProForm.Group>
          </ModalForm>
        </Flex>
      </Flex>
      <div className="table-container">
        <Table
          size="small"
          showSorterTooltip
          columns={columns}
          rowKey={"id"}
          pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', onChange: handlePage, total: resultCount }}
          dataSource={data}
        />
      </div>

    </div>
  )
}


