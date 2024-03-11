import { Button, Flex, Input, Modal, Select, Space, Table, TableProps, message } from 'antd'
import '../../scss/fnPage.scss'
import { useEffect, useState } from 'react';
import { apis } from '@/service/apis';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';

export default function MaterialsMng() {
    const adminStore = useSelector((store: StoreType) => store.adminStore).data
    const [materialList, setMaterialList] = useState([])
    const [renderMaterialList, setRenderMaterialList] = useState([])
    useEffect(() => {
        handleGetMaterial()
    }, [])

    //Tìm kiếm 
    const [searchMaterial, setSearchMaterial] = useState("")
    const [searchStatus, setSearchStatus] = useState<boolean | null>(null)
    
    const handleStatusSelector = (value: boolean | null) => {
        setSearchStatus(value)
    }
    const handleSearch = () => {
        let render = materialList.filter(item =>
            (item as any).material.includes(searchMaterial)
        )
        if (searchStatus != null) {
            render = render.filter(item => (item as any).status == searchStatus)
        }
        setRenderMaterialList(render)
    }

    const handleGetMaterial = async () => {
        try {
            const result = await apis.adminProductsApiModule.getProductMaterial()
            if (result.status == 200) {
                setMaterialList(result.data.data)
                setRenderMaterialList(result.data.data)
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    //Xoá chất liệu
    const handleDelete = (data: { id: number ,material:string}) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn chắc là muốn xoá thể loại này chứ?",
            onOk: async () => {
                try {
                    const result = await apis.adminProductsApiModule.deleteMaterial(data.id)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Đã xoá chất liệu ${data.material}`,operator:adminStore?.username})
                        message.success(result.data.message)
                    } else {
                        message.warning(result.data.message)
                    }
                    handleGetMaterial()
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
            title: 'Chất liệu',
            dataIndex: 'material',
            key: 'material'
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
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="primary" danger={record.status ? true : false} size={"small"} onClick={() => { changeMaterialStatus(record) }}>
                        {record.status ? "Khoá" : "Mở Khoá"}
                    </Button>
                    <Button type='primary' danger size={"small"} onClick={() => { handleDelete(record) }}>
                        Xoá
                    </Button>
                </Space>,
        }
    ]
    const data: DataType[] = renderMaterialList

    //Thay đổi trạng thái
    const changeMaterialStatus = (data: { id: number, status: boolean ,material:string}) => {
        try {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: `Bạn chắc chắn muốn thay đổi trạng thái của chất liệu này chứ?`,
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.changeMaterialStatus(data)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`${data.status ? "Tạm khoá" : "Kích hoạt"} chất liệu ${data.material}`,operator:adminStore?.username})
                        message.success(result.data.message)
                        handleGetMaterial()
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

    //Thêm mới
    const [addNewMaterial, setAddNewMaterial] = useState("")

    const handleAddNew = async () => {
        try {
            if (addNewMaterial == "") {
                message.warning("Tên chất liệu thêm mới không được để trống");
                return;
            } else {
                let existFlag = false;
                materialList.map(item => {
                    if ((item as any).material == addNewMaterial) {
                        message.warning("Tên chất liệu thêm mới đã tồn tại");
                        existFlag = true;
                        return;
                    }
                })
                    ;
                if (existFlag) {
                    return;
                }
            }
            Modal.confirm({
                title: "Xác nhận thêm mới chất liệu",
                content: "Bạn chắc là muốn thêm chất liệu này chứ?",
                onOk: async () => {
                    const result = await apis.adminProductsApiModule.addNewMaterial(addNewMaterial)
                    if (result.status == 200) {
                        await apis.adminApiModule.record({id:adminStore?.id,content:`Thêm chất liệu mới ${addNewMaterial}`,operator:adminStore?.username})
                        message.success(result.data.message)
                        handleGetMaterial()
                        setAddNewMaterial("")
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

    //Làm mới thanh tìm kiếm
    const clearSearchOption = () => {
        setSearchStatus(null),
            setSearchMaterial("")
    }

    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách chất liệu</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} value={searchMaterial} onChange={(e) => { setSearchMaterial(e.target.value) }} size="small" type="text" placeholder='Tìm kiếm chất liệu' />
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
                    <Input style={{ width: 150 }} size="small" type="text" value={addNewMaterial} placeholder='Chất liệu mới' onChange={(e) => { setAddNewMaterial(e.target.value) }} />
                    <Button type="primary" size={"small"} onClick={() => { handleAddNew() }}>
                        Thêm mới
                    </Button>
                </Flex>
            </Flex>
            <div className='table-container'>
                <Table
                    rowKey={"id"}
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', total: renderMaterialList.length }}
                    dataSource={data}
                />
            </div>
        </div>
    )
}
