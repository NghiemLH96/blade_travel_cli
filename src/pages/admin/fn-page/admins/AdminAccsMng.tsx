import { apis } from "@/service/apis"
import { Button, Flex, Input, Modal, PaginationProps, Select, Space, Table, TableProps } from "antd"
import { useEffect, useState } from "react"
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import '../../scss/fnPage.scss'
import { StoreType } from "@/store";
import { useSelector } from "react-redux";

export default function AdminAccsMng() {
    const adminStore = useSelector((store: StoreType) => store.adminStore).data
    
    const [renderAdminsList, setRenderAdminsList] = useState<Array<any>>([])
    const [resultCount, setResultCount] = useState<number>(0)
    const pageSize = 10

    //Tìm kiếm
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    const [searchByUsername, setSearchByUsername] = useState<string>("")
    const [searchDepartment, setSearchDepartment] = useState<number | null>(null)

    const clearSearchOption  = () => {
        setSearchStatus(null),
        setSearchByUsername(""),
        setSearchDepartment(null)
    }

    const handleDepSelectorChange = (value: number | null) =>{
        setSearchDepartment(value)
    }

    const handleSelectorChange = (value: boolean | null) => {
        setSearchStatus(value)
    };

    //Phân trang
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        getPageAdminsList()
        getDepartment()
    }, [current])

    const handlePage: PaginationProps['onChange'] = (page) => {
        setCurrent(page);
    };

    const getPageAdminsList = async () => {
        try {
            const result = await apis.adminAccsMngApiModule.search({department:searchDepartment, status: searchStatus, username: searchByUsername, currentPage: current, pageSize })
            setResultCount(result.data.count)
            setRenderAdminsList(result.data.data)
        } catch (error) {

        }
    }

    const [departmentList, setDepartmentList] = useState([])
    const getDepartment = async () => {
        try {
            const result = await apis.adminAccsMngApiModule.getDepartment()
            if (result.status == 200) {
                setDepartmentList(result.data.data)
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
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

    const handleLock = (admin: { id: number, status: boolean ,username:string}) => {
        confirm({
            title: 'Thay đổi trạng thái',
            content: `Bạn chắc chắn muốn ${admin.status ? 'khoá' : 'mở khoá'} tài khoản này chứ`,
            async onOk() {
                const result = await apis.adminAccsMngApiModule.changeStatus(admin);
                if (result.status == 200) {
                    await apis.adminApiModule.record({id:adminStore?.id,content:`${admin.status ? 'Tạm khoá':'Kích hoạt'} tài khoản quản trị viên ${admin.username}`,operator:adminStore?.username
                })
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
        updateAt: string
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                <span>{status ? "Hoạt động" : "Khoá"}</span>
        },
        {
            title: 'Chức vụ',
            dataIndex: 'FK_admins_departments',
            key: 'FK_admins_departments',
            render: (FK_admins_departments) =>
                <span>{FK_admins_departments.department}</span>
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
                    <Button type="primary" danger={record.status == true} size={"small"} onClick={() => { handleLock({ id: record.id, status: record.status , username:record.username}) }}>
                        {record.status ? "Khoá" : "Mở Khoá"}
                    </Button>
                    <ModalForm<{
                        department: number
                    }>
                        title="Thay đổi chức vụ"
                        trigger={
                            <Button size="small" type="primary">
                                Thay đổi chức vụ
                            </Button>
                        }
                        form={permisForm}
                        autoFocusFirstInput
                        modalProps={{
                            destroyOnClose: true,
                            onCancel: () => console.log('run'),
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            try {
                                const result = await apis.adminAccsMngApiModule.changeDepartment({id:record.id,department:values.department})
                                if (result.status == 200) {
                                    await apis.adminApiModule.record({id:adminStore?.id,content:`Cập nhật chức vụ cho tài khoản quản trị viên ${record.username}}`,operator:adminStore?.username})
                                    success(result.data.message)
                                    getPageAdminsList()
                                    return true
                                }else{
                                    error("Thay đổi chức vụ thất bại")
                                }
                            } catch (err) {
                                error("Thay đổi chức vụ thất bại")
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormSelect
                                initialValue={record.department}
                                width="md"
                                options={
                                    departmentList.map(item => {
                                        return { value: (item as any).id, label: (item as any).department }
                                    })
                                }
                                name="department"
                                label="Chức vụ"
                            />
                        </ProForm.Group>
                    </ModalForm>
                </Space>,
        }
    ]

    const data: DataType[] = renderAdminsList

    //Form
    const [addNewForm] = Form.useForm<{ username: string; passwords: string; department: number }>();
    const [permisForm] = Form.useForm<{ username: string; passwords: string; department: number }>();

    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách tài khoản quản trị viên</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} value={searchByUsername} size="small" type="text" placeholder='Tên tài khoản' onChange={(e) => { setSearchByUsername(e.target.value) }} />
                    <Select
                        value={searchStatus}
                        style={{height: 25 }}
                        onChange={handleSelectorChange}
                        options={[
                            { value: null, label: 'Chọn trạng thái' },
                            { value: true, label: 'Hoạt động' },
                            { value: false, label: 'Tạm khoá' },
                        ]}
                    />
                    <Select
                        value={searchDepartment}
                        style={{height: 25 }}
                        onChange={handleDepSelectorChange}
                        options={[
                            { value: null, label: "Chọn chức vụ" }
                        ].concat(departmentList.map(item => {
                            return { value: (item as any).id, label: (item as any).department }
                        }))

                        }
                    />
                    <Button danger size={"small"} onClick={() => { getPageAdminsList() }}>
                        Tìm kiếm
                    </Button>
                    <Button type="default" size={"small"} onClick={() => {clearSearchOption() }}>
                        Làm mới
                    </Button>
                    <ModalForm<{
                        username: string;
                        passwords: string;
                        department: number
                    }>
                        title="Thêm mới"
                        trigger={
                            <Button size="small" type="primary">
                                <PlusOutlined />
                                Thêm mới
                            </Button>
                        }
                        form={addNewForm}
                        autoFocusFirstInput
                        modalProps={{
                            destroyOnClose: true,
                            onCancel: () => console.log('run'),
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            try {
                                const addNewDetail = {
                                    username: values.username,
                                    passwords: values.passwords,
                                    department: values.department
                                }
                                const result = await apis.adminAccsMngApiModule.createAdmin(addNewDetail)
                                if (result.status == 200) {
                                    message.success(result.data.message)
                                    getPageAdminsList()
                                    return true
                                } else if (result.status == 214) {
                                    message.error(result.data.message)
                                } else {
                                    message.error("Khởi tạo thất bại")
                                }
                            } catch (error) {
                                message.error("Khởi tạo thất bại")
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="username"
                                label="Tài khoản quản trị viên"
                                tooltip="Không được để trống"
                                placeholder="Tài khoản"
                            />

                            <ProFormText
                                width="md"
                                name="passwords"
                                label="Mật khẩu"
                                placeholder="Mật khẩu quản trị viên"
                            />
                            <ProFormSelect
                                width="md"
                                options={
                                    departmentList.map(item => {
                                        return { value: (item as any).id, label: (item as any).department }
                                    })
                                }
                                name="department"
                                label="Chức vụ"
                            />
                        </ProForm.Group>
                    </ModalForm>
                </Flex>
            </Flex>
            <div className="table-container">
                <Table
                    columns={columns}
                    rowKey={"id"}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', onChange: handlePage, total: resultCount }}
                    dataSource={data}
                />
            </div>

        </div>
    )
}
