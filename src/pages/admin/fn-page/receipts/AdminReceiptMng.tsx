import { apis } from "@/service/apis";
import { StoreType } from "@/store";
import '@pages/admin/scss/fnPage.scss'
import { Button, Flex, Input, Modal, PaginationProps, Select, Space, Table, TableProps, message } from "antd"
import modal from "antd/es/modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminReceiptMng() {
  const adminStore = useSelector((store: StoreType) => store.adminStore).data
  //Modal antd
  const [open, setOpen] = useState(false);
  const [renderingDetail, setRenderingDetail] = useState()

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getReceipts(searchName,searchStatus,current,pageSize)
  }, [])
  const pageSize =10;
  const [receiptsList, setReceiptList] = useState([])
  const [receiptCount, setReceiptCount] = useState(0)
  const [current, setCurrent] = useState(1);
    useEffect(() => {
      getReceipts(searchName,searchStatus,current,pageSize)
    }, [current])
  
    const handlePage: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
    };

  const getReceipts = async (searchName:string,searchStatus:string,current:number,pageSize:number) => {
    try {
      const result = await apis.adminReceiptMngApiModule.getReceipts(searchName,searchStatus,current,pageSize)

      if (result.status == 200) {
        setReceiptList(result.data.data)
        setReceiptCount (result.data.total)
      } else {
        message.error("Lấy dữ liệu thất bại")
      }
    } catch (error) {
      message.error("Lấy dữ liệu thất bại")
    }
  }

  //Date format
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

  //searchBar\
  const [searchName,setSearchName]=useState("")
  const [searchStatus, setSearchStatus] = useState<string>("")
  const handleStatusSelector = (value: string) => {
      setSearchStatus(value)
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


  //Table
  interface DataType {
    receiptId: number,
    items: any,
    status: boolean,
    phone: string,
    address: string
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người dùng',
      dataIndex: 'items',
      key: 'items',
      render: (items) => {
        return <span>{items[0].FK_user_cartItem.email}</span>
      }
    },
    {
      title: 'Tổng số sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items) => {
        const itemsTotal = items?.reduce((total: any, value: { quantity: any; }) => { return total + value.quantity }, 0)
        return <span>{itemsTotal}  Sản phẩm</span>
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'items',
      key: 'items',
      render: (items) => {
        let totalPrice = 0;
        for (let i = 0; i < items.length; i++) {
          totalPrice += items[i].quantity * items[i].FK_products_cartItem.price
        }
        return <span>{totalPrice.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}</span>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return <span className={`statusText ${status}`}>{status}</span>
      }
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => {
        return <span style={{ textTransform: 'uppercase' }}>{paymentMethod}</span>
      }
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'address',
      key: 'address',
      render: (address) => {
        return <span>{address}</span>
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => {
        
        return <span>{phone}</span>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) =>
        <Space size="middle">
          {record.status == 'pending' && <Button type="primary" danger size={"small"} onClick={()=>{cancelReceipt((record as any).id)}}>
            Huỷ đơn
          </Button>}
          <Button type='primary' size={"small"} onClick={() => {
            showModal(),
            setRenderingDetail(record)
          }}>
            Chi tiết
          </Button>
        </Space>,
    }
  ]
  const data: DataType[] = receiptsList

  //Huỷ đơn
  const cancelReceipt = async(receiptId:number) =>{
    modal.confirm({
      title: 'Xác nhận huỷ đơn',
      content: `Bạn chắc chắn muốn huỷ đơn hàng này chứ`,
      async onOk() {
        try {
          const result = await apis.adminReceiptMngApiModule.cancelReceipt(receiptId)
          if (result.status==200) {
            await apis.adminApiModule.record({id:adminStore?.id,content:`Đã huỷ đơn hàng, mã hoá đơn là ${receiptId}`,operator:adminStore?.username})
            message.success(result.data.message)
            getReceipts(searchName,searchStatus,current,pageSize)
          }else{
            message.error('Huỷ đơn thất bại')
          }
        } catch (error) {
          message.error('Server bận mời thử lại sau')
        }
      },
      okText: 'Xác định',
      cancelText: 'Huỷ'
    });
  }

  return (
    <div className='content_container'>
      <Modal
        open={open}
        width={800}
        title="Chi tiết đơn hàng"
        okText='Đóng'
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        {renderingDetail && 
        <div className="receiptDetail">
          <div className="receiptDetail childBox left">
            <span>Mã số hoá đơn: {(renderingDetail as any).id}</span><br />
            <span>Địa chỉ giao hàng: {(renderingDetail as any).address}</span><br />
            <span>Phương thức thanh toán: <span style={{textTransform:'uppercase'}}>{(renderingDetail as any).paymentMethod}</span></span><br />
          </div>
          <div className="receiptDetail childBox right">
            <span>Trạng thái hoá đơn:<span className={`statusText ${(renderingDetail as any).status}`}>{(renderingDetail as any).status}</span></span><br />
            <span>Thời gian khởi tạo:{handleDateType((renderingDetail as any).createAt)}</span><br />
            <span>Thời gian cập nhật:{handleDateType((renderingDetail as any).updateAt)}</span><br />
          </div>
        </div>}
        <div className="receipt">
        {renderingDetail && (renderingDetail as any)?.items.map((item: any) =>
          <div className="receipt-productDetail">
            <img className='receipt-productDetail-avatar' src={(item as any).FK_products_cartItem.avatar} alt="" />
            <div className='receipt-productDetail-info'>
              <p>Tên sản phẩm:{(item as any).FK_products_cartItem.productName}</p>
              <p>Giá:{(item as any).FK_products_cartItem.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}</p>
              <p>Số lượng:{(item as any).quantity}</p>
            </div>
          </div>
        )}
        </div>
      </Modal>
      <h2 className='content_title'>Danh sách hoá đơn</h2>
      <Flex gap="middle" align="start" vertical>
        <Flex style={boxStyle} justify={'center'} align={'center'}>
          <Input style={{ width: 150 }} value={searchName} size="small" type="text" placeholder='Tên tài khoản' onChange={(e)=>{setSearchName(e.target.value)}}/>
          <Select
            defaultValue={"null"}
            style={{ width: 120, height: 25 }}
            onChange={handleStatusSelector}
            options={[
              { value: "null", label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'success', label: 'Success' },
              { value: 'canceled', label: 'Canceled' }
            ]}
          />
          <Button danger size={"small"} onClick={()=>{getReceipts(searchName,searchStatus,current,pageSize)}}>
            Tìm kiếm
          </Button>
          <Button type="default" size={"small"} onClick={()=>{setSearchName("")}}>
            Làm mới
          </Button>
        </Flex>
      </Flex>
      <div className='table-container'>
        <Table
          columns={columns}
          rowKey={'id'}
          pagination={{ position: ["bottomLeft"], pageSize: pageSize, size: 'default', total: receiptCount, onChange:handlePage , defaultCurrent:current}}
          dataSource={data}
        />
      </div>
    </div>
  )
}
