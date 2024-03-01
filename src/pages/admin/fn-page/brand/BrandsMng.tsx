import { Button, Flex, Input, Modal, Select, Space, Table, TableProps, message } from 'antd'
import '../../scss/fnPage.scss'
import { useEffect, useState } from 'react';
import { apis } from '@/service/apis';




export default function BrandsMng() {

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
    const [addNewBrand, setAddNewBrand] = useState("")

    const handleAddNew = async () => {
        try {
            if (addNewBrand == "") {
                message.warning("Tên chất liệu thêm mới không được để trống");
                return;
            } else {
                let existFlag = false;
                brandList.map(item => {
                    if ((item as any).brandName == addNewBrand) {
                        message.warning("Tên chất liệu thêm mới đã tồn tại");
                        existFlag = true;
                        return;
                    }
                });
                if (existFlag) {
                    return;
                }
            }
            Modal.confirm({
                title: "Xác nhận thêm mới nhãn hiệu",
                content: "Bạn chắc là muốn thêm nhãn hiệu này chứ?",
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.addNewBrand(addNewBrand)
                    if (result.status == 200) {
                        message.success(result.data.message)
                        handleGetBrands()
                        setAddNewBrand("")
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
    const changeBrandStatus = (data: { id: number, status: boolean }) => {
        try {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: `Bạn chắc chắn muốn thay đổi trạng thái của nhãn hiệu này chứ?`,
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.changeBrandStatus(data)
                    if (result.status == 200) {
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
    const handleDelete = (data: { id: number }) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn chắc là muốn xoá nhãn hiệu này chứ?",
            onOk: async () => {
                try {
                    const result = await apis.adminProductsApiModule.deleteBrand(data.id)
                    if (result.status == 200) {
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
        updateAt: string
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
                    <Input style={{ width: 150 }} size="small" type="text" value={addNewBrand} placeholder='Nhãn hiệu mới' onChange={(e) => { setAddNewBrand(e.target.value) }} />
                    <Button type="primary" size={"small"} onClick={() => { handleAddNew() }}>
                        Thêm mới
                    </Button>
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
