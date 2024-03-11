import { Button, Flex, Input, Modal, Select, Space, Table, TableProps, message } from 'antd'
import '../../scss/fnPage.scss'
import { useEffect, useState } from 'react';
import { apis } from '@/service/apis';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';

export default function MadeByMng() {
    const adminStore = useSelector((store: StoreType) => store.adminStore).data
    useEffect(() => {
        handleGetMadeBy()
    }, [])
    //Lấy danh sách nhãn hiệu
    const [madeByList, setMadeByList] = useState([])
    const [rederMadeByList, setRenderMadeByList] = useState([])
    const handleGetMadeBy = async () => {
        try {
            const result = await apis.adminProductsApiModule.getProductmadeBy()
            if (result.status == 200) {
                setMadeByList(result.data.data)
                setRenderMadeByList(result.data.data)
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    //Tìm kiếm 
    const [searchMadeBy, setSearchMadeBy] = useState("")
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    const handleStatusSelector = (value: boolean | null) => {
        setSearchStatus(value)
    }
    const handleSearch = () => {
        let render = madeByList.filter(item =>
            (item as any).country.includes(searchMadeBy)
        )
        if (searchStatus != null) {
            render = render.filter(item => (item as any).status == searchStatus)
        }

        setRenderMadeByList(render)
    }

    //Làm mới thanh tìm kiếm
    const clearSearchOption = () => {
        setSearchStatus(null),
            setSearchMadeBy("")
    }

    //Thêm mới
    const [addNewMadeBy, setAddNewMadeBy] = useState("")

    const handleAddNew = async () => {
        try {
            if (addNewMadeBy == "") {
                message.warning("Tên xuất xứ thêm mới không được để trống");
                return;
            } else {
                let existFlag = false;
                madeByList.map(item => {
                    if ((item as any).country == addNewMadeBy) {
                        message.warning("Tên xuất xứ thêm mới đã tồn tại");
                        existFlag = true
                        return;
                    }
                })
                if (existFlag) {
                    return;
                }
            }
            Modal.confirm({
                title: "Xác nhận thêm mới xuất xứ ",
                content: "Bạn chắc là muốn thêm xuất xứ này chứ?",
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.addNewMadeBy(addNewMadeBy)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Thêm xuất xứ mới ${addNewMadeBy}`,operator:adminStore?.username})
                        message.success(result.data.message)
                        handleGetMadeBy()
                        setAddNewMadeBy("")
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
    const changeMadeByStatus = (data: { id: number, status: boolean ,country:string}) => {
        try {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: `Bạn chắc chắn muốn thay đổi trạng thái của xuất xứ này chứ?`,
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.changeMadeByStatus(data)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`${data.status ? "Tạm khoá" : "Kích hoạt"} xuất xứ ${data.country}`,operator:adminStore?.username})
                        message.success(result.data.message)    
                        handleGetMadeBy()
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

    //Xoá xuất xứ
    const handleDelete = (data: { id: number , country:string }) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn chắc là muốn xoá xuất xứ này chứ?",
            onOk: async () => {
                try {
                    const result = await apis.adminProductsApiModule.deleteMadeBy(data.id)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Đã xoá xuất xứ ${data.country}`,operator:adminStore?.username})
                        message.success(result.data.message)
                    } else {
                        message.warning(result.data.message)
                    }
                    handleGetMadeBy()
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
        updateAt: string
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Xuất xứ',
            dataIndex: 'country',
            key: 'country'
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
                    <Button type="primary" danger={record.status ? true : false} size={"small"} onClick={() => { changeMadeByStatus(record) }}>
                        {record.status ? "Khoá" : "Mở Khoá"}
                    </Button>
                    <Button type='primary' danger size={"small"} onClick={() => { handleDelete(record) }}>
                        Xoá
                    </Button>
                </Space>,
        }
    ]
    const data: DataType[] = rederMadeByList
    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách xuất xứ</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} value={searchMadeBy} size="small" type="text" placeholder='Tên tài khoản' onChange={(e) => { setSearchMadeBy(e.target.value) }} />
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
                    <Input style={{ width: 150 }} value={addNewMadeBy} size="small" type="text" placeholder='Xuất xứ mới' onChange={(e) => { setAddNewMadeBy(e.target.value) }} />
                    <Button type="primary" size={"small"} onClick={() => { handleAddNew() }}>
                        Thêm mới
                    </Button>
                </Flex>
            </Flex>
            <div className='table-container'>
                <Table
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', total: 10 }}
                    dataSource={data}
                />
            </div>
        </div>
    )
}
