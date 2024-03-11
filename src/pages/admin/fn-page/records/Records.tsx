import { useEffect, useState } from 'react';
import '../../scss/fnPage.scss'
import { Button, Flex, Input, PaginationProps, Table, TableProps, message } from 'antd'
import { apis } from '@/service/apis';

export default function Records() {
    const [recordList , setRecordList] = useState([])
    const [recordCount , setrecordCount] = useState(0)

    useEffect(()=>{
        getrecord(searchOperator,current,pageSize)
    },[])

    const pageSize=10;
    const [current, setCurrent] = useState(1);
    useEffect(() => {
      getrecord(searchOperator,current,pageSize)
    }, [current])
  
    const handlePage: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
    };

    const getrecord=async(searchOperator:string,current:number,pageSize:number)=>{
        try {
            const result = await apis.adminApiModule.getRecord(searchOperator,current,pageSize)
            if(result.status==200){
                setRecordList(result.data.data)
                setrecordCount(result.data.total)
            }else{
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Server bận mời thử lại sau")
        }
    }
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
            title: 'Người thao tác',
            dataIndex: 'operator',
            key: 'operator'
        },
        {
            title: 'Nội dung thao tác',
            dataIndex: 'operateContent',
            key: 'operateContent',
        },
        {
            title: 'Thời gian thao tác',
            dataIndex: 'operateAt',
            key: 'operateAt',
            render:(operateAt)=>
            <span>{handleDateType(operateAt)}</span>
        }
    ]
    const data: DataType[] = recordList

    const [searchOperator,setSearchOperator] = useState("")
    return (
        <div className='content_container'>
            <h2 className='content_title'>Danh sách chất liệu</h2>
            <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'} align={'center'}>
                    <Input style={{ width: 150 }} value={searchOperator} onChange={(e)=>{setSearchOperator(e.target.value)}} size="small" type="text" placeholder='Người thao tác' />
                    <Button danger size={"small"} onClick={() => { }}>
                        Tìm kiếm
                    </Button>
                </Flex>
            </Flex>
            <div className='table-container'>
                <Table
                    rowKey={"id"}
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: pageSize, size: 'default', total: recordCount , onChange:handlePage}}
                    dataSource={data}
                />
            </div>
        </div>
    )
}
