import { Button, Flex, Form, Input, Modal, Select, Space, Table, TableProps, Upload, UploadFile, UploadProps, message } from 'antd'
import '../../scss/fnPage.scss'
import { useEffect, useState } from 'react';
import { apis } from '@/service/apis';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { StoreType } from '@/store';
import { useSelector } from 'react-redux';

export default function CategoriesMng() {
    const adminStore = useSelector((store: StoreType) => store.adminStore).data
    useEffect(() => {
        handleGetCategories()
    }, [])
    //Lấy danh sách nhãn hiệu
    const [categoriesList, setCategoriesList] = useState([])
    const [renderCategories, setRenderCategories] = useState([])
    const handleGetCategories = async () => {
        try {
            const result = await apis.adminProductsApiModule.getProductCategories()
            if (result.status == 200) {
                setCategoriesList(result.data.data)
                setRenderCategories(result.data.data)
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    //Tìm kiếm 
    const [searchCategory, setSearchCategory] = useState("")
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    const handleStatusSelector = (value: boolean | null) => {
        setSearchStatus(value)
    }
    const handleSearch = () => {
        console.log(categoriesList);

        let render = categoriesList.filter(item =>
            (item as any).categoryName.includes(searchCategory)
        )
        if (searchStatus != null) {
            render = render.filter(item => (item as any).status == searchStatus)
        }

        setRenderCategories(render)
    }

    //Làm mới thanh tìm kiếm
    const clearSearchOption = () => {
        setSearchStatus(null),
            setSearchCategory("")
    }

    //Thêm mới
    const [addNewCategory, setAddNewCategory] = useState("")

    const handleAddNew = async () => {
        try {
            if (addNewCategory == "") {
                message.warning("Tên thể loại thêm mới không được để trống");
                return;
            } else {
                let existFlag = false;
                categoriesList.map(item => {
                    if ((item as any).categoryName == addNewCategory) {
                        message.warning("Tên thể loại thêm mới đã tồn tại");
                        existFlag = true
                        return;
                    }
                })
                if (existFlag) {
                    return;
                }
            }
            Modal.confirm({
                title: "Xác nhận thêm mới thể loại ",
                content: "Bạn chắc là muốn thêm thể loại này chứ?",
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.addNewCategory(addNewCategory)
                    if (result.status == 200) {
                        message.success(result.data.message)
                        handleGetCategories()
                        setAddNewCategory("")
                    } else {
                        message.error("Server bận!")
                    }
                },
                okText: "Xác định",
                cancelText: "Huỷ"
            })
        } catch (error) {
            message.error("Server bận!")
        }
    }

    //Thay đổi trạng thái
    const changeCategoryStatus = (data: { id: number, status: boolean , categoryName:string }) => {
        try {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: `Bạn chắc chắn muốn thay đổi trạng thái của thể loại này chứ?`,
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.changeCategoryStatus(data)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`${data.status ? 'Tạm khoá':'Kích hoạt'} thể loại ${data.categoryName}`,operator:adminStore?.username})
                        message.success(result.data.message)
                        handleGetCategories()
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

    //Xoá chất liệu
    const handleDelete = (data: { id: number ,categoryName:string}) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn chắc là muốn xoá thể loại này chứ?",
            onOk: async () => {
                try {
                    const result = await apis.adminProductsApiModule.deleteCategory(data.id)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Đã xoá thể loại ${data.categoryName}`,operator:adminStore?.username})
                        message.success(result.data.message)
                    } else {
                        message.warning(result.data.message)
                    }
                    handleGetCategories()
                } catch (error) {
                    message.error("Xoá dữ liệu thất bại")
                }
            }
        })
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
        categoryName: string;
        status: boolean;
        createAt: string;
        updateAt: string;
        avatar:string   
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Thể loại',
            dataIndex: 'categoryName',
            key: 'categoryName'
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) =>
                <img style={{width:"100px"}} src={avatar} alt="" />
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
                    <Button type="primary" danger={record.status ? true : false} size={"small"} onClick={() => { changeCategoryStatus(record) }}>
                        {record.status ? "Khoá" : "Mở Khoá"}
                    </Button>
                    <Button type='primary' danger size={"small"} onClick={() => { handleDelete(record) }}>
                        Xoá
                    </Button>
                </Space>,
        }
    ]
    const data: DataType[] = renderCategories

    
    const [addNewAvatar, setAddNewAvatar] = useState<UploadFile | null>()
    
    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    const handleAddAvatar: UploadProps['onChange'] = (info) => {
            setAddNewAvatar(info.fileList[0].originFileObj)
    };

    const handleRemoveAvatar: UploadProps['onRemove'] = () => {
        setAddNewAvatar(null);
    };

    const [addNewCatForm] = Form.useForm<{
        categoryName: string
    }>();

    
    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách tài khoản quản trị viên</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} size="small" type="text" placeholder='Tên tài khoản' value={searchCategory} onChange={(e) => { setSearchCategory(e.target.value) }} />
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
                        categoryName: string
                    }>
                        title="Thêm mới"
                        trigger={
                            <Button size="small" type="primary">
                                <PlusOutlined />
                                Thêm mới
                            </Button>
                        }
                        form={addNewCatForm}
                        autoFocusFirstInput
                        variant="filled"
                        modalProps={{
                            destroyOnClose: true,
                            onCancel: () => console.log('run'),
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            if (!values.categoryName) {
                                message.warning("Tên thể loại không được để trống")
                                return
                            } else {
                                categoriesList.map(item => {
                                    if ((item as any).categoryName == values.categoryName) {
                                        message.warning("Tên nhãn hiệu thêm mới đã tồn tại");
                                        return;
                                    }
                                })
                            }
                            if (!addNewAvatar) {
                                message.warning("Mời đăng tải ảnh thể loại")
                                return
                            }
                            try {
                                console.log(addNewAvatar);
                                
                                let catFormData = new FormData;
                                catFormData.append("data", JSON.stringify(values))
                                catFormData.append("avatar", addNewAvatar as any)
                                const result = await apis.adminProductsApiModule.addNewCategory(catFormData)
                                console.log(result);
                                
                                if (result.status == 200) {
                                    await apis.adminApiModule.record({id:adminStore?.id,content:`Thêm thể loại mới ${values.categoryName}}`,operator:adminStore?.username})
                                    message.success(result.data.message)
                                    handleGetCategories()
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
                                name="categoryName"
                                label="Tên thể loại"
                                tooltip="Tối đa 16 ký tự"
                                placeholder="Tên thể loại"
                                required
                            />
                        </ProForm.Group>
                        <ProForm.Group style={{ margin: "10px 0px" }}>
                            <label style={{ width: '200px', display: "inline-block" }} htmlFor="">Ảnh thể loại</label>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture"
                                defaultFileList={[]}
                                onChange={handleAddAvatar}
                                onRemove={handleRemoveAvatar}
                                beforeUpload={()=>false}
                                maxCount={1}
                            >
                                <Button >Upload</Button>
                            </Upload>
                        </ProForm.Group>
                    </ModalForm>
                    <Input style={{ width: 150 }} size="small" type="text" placeholder='Tên thể loại mới' value={addNewCategory} onChange={(e) => { setAddNewCategory(e.target.value) }} />
                    <Button type="primary" size={"small"} onClick={() => { handleAddNew() }}>
                        Thêm mới
                    </Button>
                </Flex>
            </Flex>
            <div className='table-container'>
                <Table
                    rowKey={"id"}
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', total: 10 }}
                    dataSource={data}
                />
            </div>
        </div>
    )
}
