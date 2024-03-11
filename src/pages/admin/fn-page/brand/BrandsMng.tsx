import { Button, Flex, Form, Input, Modal, Select, Space, Table, TableProps, Upload, UploadFile, UploadProps, message } from 'antd'
import '../../scss/fnPage.scss'
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { apis } from '@/service/apis';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { StoreType } from '@/store';
import { useSelector } from 'react-redux';




export default function BrandsMng() {
    const adminStore = useSelector((store: StoreType) => store.adminStore).data
    useEffect(() => {
        handleGetBrands()
    }, [])
    //Lấy danh sách nhãn hiệu
    const [brandList, setBrandList] = useState([])
    const [renderBrandList, setRenderBrandList] = useState([])
    const handleGetBrands = async () => {
        try {
            const result = await apis.adminProductsApiModule.getProductBrand()
            if (result.status == 200) {
                setBrandList(result.data.data)
                setRenderBrandList(result.data.data)
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    //Tìm kiếm 
    const [searchBrand, setSearchBrand] = useState("")
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    const handleStatusSelector = (value: boolean | null) => {
        setSearchStatus(value)
    }
    const handleSearch = () => {
        let render = brandList.filter(item =>
            (item as any).brandName.includes(searchBrand)
        )
        if (searchStatus != null) {
            render = render.filter(item => (item as any).status == searchStatus)
        }
        setRenderBrandList(render)
    }

    //Làm mới thanh tìm kiếm
    const clearSearchOption = () => {
        setSearchStatus(null),
            setSearchBrand("")
    }

    //Thêm mới


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

    //Thay đổi trạng thái
    const changeBrandStatus = (data: { id: number, status: boolean ,brandName:string }) => {
        try {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: `Bạn chắc chắn muốn thay đổi trạng thái của nhãn hiệu này chứ?`,
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.changeBrandStatus(data)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`${data.status ? "Tạm khoá" : "Kích hoạt"} nhãn hiệu ${data.brandName}`,operator:adminStore?.username})
                        message.success(result.data.message)
                        handleGetBrands()
                    }
                    else {
                        message.error("Thay đổi trạng thái thất bại")
                    }
                },
                okText: 'Xác định',
                cancelText: 'Huỷ'
            })

        } catch (error) {
            message.error("Server bận!")
        }
    }

    //Xoá nhãn hiệu
    const handleDelete = (data: { id: number,brandName:string  }) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn chắc là muốn xoá nhãn hiệu này chứ?",
            onOk: async () => {
                try {
                    const result = await apis.adminProductsApiModule.deleteBrand(data.id)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Xoá nhãn hiệu ${data.brandName}`,operator:adminStore?.username})
                        message.success(result.data.message)
                    } else {
                        message.warning(result.data.message)
                    }
                    handleGetBrands()
                } catch (error) {
                    message.error("Xoá dữ liệu thất bại")
                }
            }
        })
    }

    //searchBar
    const boxStyle: React.CSSProperties = {
        width: '100%',
        height: 50,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 6,
        columnGap: 15,
        border: '1px solid #40a9ff',
        backgroundColor: '#FFFFFF'
    };

    //table

    interface DataType {
        id: number;
        username: string;
        department: string;
        status: boolean;
        createAt: string;
        updateAt: string;
        brandLogo: string;
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nhãn hiệu',
            dataIndex: 'brandName',
            key: 'brandName'
        },
        {
            title: 'Ảnh thương hiệu',
            dataIndex: 'brandLogo',
            key: 'brandLogo',
            render: (brandLogo) =>
                <img style={{ width: "50px" }} src={brandLogo} alt="" />
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                <span>{status ? "Hoạt động" : "Khoá"}</span>
        },
        {
            title: 'CreateAt',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (createAt) =>
                <span>{handleDateType(createAt)}</span>
        },
        {
            title: 'updateAt',
            dataIndex: 'updateAt',
            key: 'updateAt',
            render: (updateAt) =>
                <span>{handleDateType(updateAt)}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) =>
                <Space size="middle">
                    <Button type="primary" danger={record.status ? true : false} size={"small"} onClick={() => { changeBrandStatus(record) }}>
                        {record.status ? "Khoá" : "Mở Khoá"}
                    </Button>
                    <Button type='primary' danger size={"small"} onClick={() => { handleDelete(record) }}>
                        Xoá
                    </Button>
                </Space>,
        }
    ]
    const data: DataType[] = renderBrandList

    //addNewForm

    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    const [addNewBrandForm] = Form.useForm<{
        brandName: string
    }>();

    const [addNewAvatar, setAddNewAvatar] = useState<any | null>()
    const [addNewChoicePic, setAddNewwChoicePic] = useState<UploadFile | null>()

    const handleAddAvatar: UploadProps['onChange'] = (info) =>{
        setAddNewAvatar(info.fileList[0].originFileObj);
    }
    

    const handleRemoveAvatar: UploadProps['onRemove'] = () => {
        setAddNewAvatar(null);
    };

    const handleAddChoicePic: UploadProps['onChange'] = (info) => {  
            setAddNewwChoicePic(info.fileList[0].originFileObj)
    };

    const handleRemoveChoicePic: UploadProps['onRemove'] = () => {
        setAddNewwChoicePic(null);
    };
    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách nhãn hiệu</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} value={searchBrand} onChange={(e) => { setSearchBrand(e.target.value) }} size="small" type="text" placeholder='Tìm kiếm chất liệu' />
                    <Select
                        value={searchStatus}
                        style={{ width: 120, height: 25 }}
                        onChange={handleStatusSelector}
                        options={[
                            { value: null, label: 'Tất cả' },
                            { value: true, label: 'Hoạt động' },
                            { value: false, label: 'Tạm khoá' },
                        ]}
                    />
                    <Button danger size={"small"} onClick={() => { handleSearch() }}>
                        Tìm kiếm
                    </Button>
                    <Button type="default" size={"small"} onClick={() => { clearSearchOption() }}>
                        Làm mới
                    </Button>
                    <ModalForm<{
                        brandName: string
                    }>
                        title="Thêm mới"
                        trigger={
                            <Button size="small" type="primary">
                                <PlusOutlined />
                                Thêm mới
                            </Button>
                        }
                        form={addNewBrandForm}
                        autoFocusFirstInput
                        variant="filled"
                        modalProps={{
                            destroyOnClose: true,
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            if (!values.brandName) {
                                message.warning("Tên nhãn hiệu không được để trống")
                                return
                            } else {
                                brandList.map(item => {
                                    if ((item as any).brandName == values.brandName) {
                                        message.warning("Tên nhãn hiệu thêm mới đã tồn tại");
                                        return;
                                    }
                                })
                            }
                            if (!addNewAvatar) {
                                message.warning("Mời đăng tải ảnh thương hiệu")
                                return
                            }
                            if (!addNewChoicePic) {    
                                message.warning("Mời đăng tải hình đại diện")
                                return
                            }
                            try {
                                let brandFormData = new FormData;
                                brandFormData.append("data", JSON.stringify(values))
                                brandFormData.append("avatar", addNewAvatar as any)
                                brandFormData.append("avatar", addNewChoicePic as any)
                                const result = await apis.adminProductsApiModule.addNewBrand(brandFormData)
                                if (result.status == 200) {
                                    console.log(result);
                                    
                                    await apis.adminApiModule.record({id:adminStore?.id,content:`Thêm nhãn hiệu mới ${values.brandName}`,operator:adminStore?.username})
                                    message.success(result.data.message)
                                    handleGetBrands()
                                    return true
                                } else {
                                    message.error("Server bận!")
                                }
                            } catch (error) {
                                message.error("Server bận!")
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="brandName"
                                label="Tên nhãn hiệu"
                                tooltip="Tối đa 16 ký tự"
                                placeholder="Tên nhãn hiệu"
                                required
                            />
                        </ProForm.Group>
                        <ProForm.Group style={{ margin: "10px 0px" }}>
                            <label style={{ width: '200px', display: "inline-block" }} htmlFor="">Ảnh thương hiệu</label>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture"
                                defaultFileList={[]}
                                beforeUpload={()=>false}
                                onChange={handleAddAvatar}
                                onRemove={handleRemoveAvatar}
                                maxCount={1}
                            >
                                <Button >Upload</Button>
                            </Upload>
                        </ProForm.Group>
                        <ProForm.Group style={{ margin: "10px 0px" }}>
                            <label style={{ width: '200px', display: "inline-block" }} htmlFor="">Ảnh đại diện</label>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture"
                                defaultFileList={[]}
                                beforeUpload={()=>false}
                                onChange={handleAddChoicePic}
                                onRemove={handleRemoveChoicePic}
                                maxCount={1}
                            >
                                <Button >Upload</Button>
                            </Upload>
                        </ProForm.Group>
                    </ModalForm>
                </Flex>
            </Flex>
            <div className='table-container'>
                <Table
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', total: renderBrandList.length }}
                    dataSource={data}
                />
            </div>
        </div>
    )
}
