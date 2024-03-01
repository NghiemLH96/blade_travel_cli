import { useEffect, useState } from 'react';
import '../../scss/fnPage.scss'
import { apis } from '@/service/apis';
import Modal from 'antd/es/modal';
import { Button, Flex, Form, Input, PaginationProps, Select, Space, Table, TableProps } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';

export default function AdminAccMng() {
  const [renderUserList, setRenderUserList] = useState<Array<any>>([])
  const [resultCount , setResultCount] = useState<number>(0)
  const pageSize = 10

    //Tìm kiếm
    const [searchStatus , setSearchStatus] = useState<boolean|null>(null)
    const [searchByEmail , setSearchByEmail] = useState<string>("")
    const [searchByPhone , setSearchByPhone] = useState<string>("")

    const clearSearchOption = () => {
      setSearchStatus(null)
      setSearchByEmail("")
      setSearchByPhone("")
    }
  
    const handleSelectorChange = (value: boolean|null) => {
      setSearchStatus(value)
    };
  
    //Phân trang
    const [current, setCurrent] = useState(1);
    useEffect(()=>{
      getPageUserList()
    },[current])
  
    const handlePage: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
    };

  const getPageUserList = async () => {
      try {
        const result = await apis.usersMngApiModule.search({status:searchStatus,email:searchByEmail,phone:searchByPhone,currentPage:current,pageSize:pageSize})
        console.log('page',result);
        
        setResultCount(result.data.total)
        setRenderUserList(result.data.data)
      } catch (error) {
  
      }
  }

  const handleDateType = (timeString:string) => {
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

  const handleLock = (user: { userId: number, userStatus: boolean }) => {
    confirm({
      title: 'Thay đổi trạng thái',
      content: `Bạn chắc chắn muốn ${user.userStatus ? 'khoá' : 'mở khoá'} tài khoản này chứ`,
      async onOk() {
        const result = await apis.usersMngApiModule.changeUserStatus(user)
        if (result.status == 200) {
          success(result.data.message)
        } else {
          error(result.data.message)
        }
        getPageUserList()
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

  //Khôi phục mật khẩu

  const handleResetPW = (userId: number, userEmail: string) => {
    confirm({
      title: 'Khôi phục mật khẩu',
      content: `Bạn chắc chắn muốn khôi phục mật khẩu của ${userEmail} chứ`,
      async onOk() {
        try {
          const result = await apis.usersMngApiModule.resetPW(userId)
          if (result.status == 200) {
            success(result.data.message)
            console.log(result.data.data);
          } else {
            error(result.data.message)
          }
          getPageUserList()
        } catch (err) {
          error(String(err))
        }
      },
      okText: 'Xác định',
      cancelText: 'Huỷ'
    });
  };

    //searchBar
    const boxStyle: React.CSSProperties = {
      width: '100%',
      height: 50,
      marginTop: 5,
      marginBottom: 5,
      borderRadius: 6,
      columnGap:15,
      border: '1px solid #40a9ff',
      backgroundColor: '#FFFFFF'
  };

  //table

  interface DataType {
      id: number;
      email: string;
      email_verify: boolean;
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
          title: 'Email',
          dataIndex: 'email',
          key: 'email'
      },
      {
          title: 'Số điện thoại',
          dataIndex: 'phone',
          key: 'phone'
      },
      {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          render: (status) =>
              <span>{status ? "Hoạt động" : "Khoá"}</span>
      },
      {
          title: 'Xác thực email',
          dataIndex: 'email_verify',
          key: 'email_verify',
          render: (email_verify) =>
              <span>{email_verify ? "Đã xác thực" : "chưa xác thực"}</span>
      },
      {
          title: 'Thời gian đăng ký',
          dataIndex: 'createAt',
          key: 'createAt',
          render: (createAt) =>
              <span>{handleDateType(createAt)}</span>
      },
      {
          title: 'Thời gian cập nhật',
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
                  <Button type="primary" danger={record.status == true} size={"small"} onClick={() => { handleLock({ userId: record.id, userStatus: record.status }) }}>
                      {record.status ? "Khoá" : "Mở Khoá"}
                  </Button>
                  <ModalForm<{
                        phone: string
                    }>
                        title="Cập nhật số điện thoại"
                        trigger={
                            <Button size="small" type="primary">
                                Cập nhật số điện thoại
                            </Button>
                        }
                        form={editPhoneForm}
                        autoFocusFirstInput
                        modalProps={{
                            destroyOnClose: true,
                            onCancel: () => console.log('run'),
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            if (!values.phone) {
                              error("Số điện thoại không được để trống")
                              return false
                            }
                            
                            if (values.phone.length != 10) {
                              error("Số điện thoại phải đủ 10 số")
                              return false
                            }
                            try {
                              const result = await apis.usersMngApiModule.updatePhone(record.id,values.phone)
                              if (result.status == 200) {
                                success(result.data.message)
                                getPageUserList()
                                return true
                              }else{
                                error("Cập nhật số điện thoại thất bại")
                              }
                            } catch (err) {
                              error("Cập nhật số điện thoại thất bại")
                            }
                            
                            
                        }}
                    >
                        <ProForm.Group>
                          <ProFormText
                                width="md"
                                name="phone"
                                label="Số điện thoại mới"
                                tooltip="Số điện thoại chuẩn là 10 số"
                                placeholder="Số điện thoại"
                            />
                        </ProForm.Group>
                    </ModalForm>
                  <Button danger size={"small"} onClick={() => { handleResetPW(record.id, record.email) }}>
                      Đặt lại mật khẩu
                  </Button>
              </Space>,
      }
  ]

  const data: DataType[] = renderUserList

  const [editPhoneForm] = Form.useForm<{ phone:string }>();

  const waitTime = (time: number = 100) => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(true);
          }, time);
      });
  };
  return (
    <div className='content_container'>
      <h2 className='content_title'>Quản lý tài khoản người dùng</h2>
      <div className='toolBar'>
      </div>
          <Flex gap="middle" align="start" vertical>
                <Flex style={boxStyle} justify={'center'}  align={'center'}>
                    <Input style={{ width: 150 }} value={searchByEmail} size="small" type="text" placeholder='Tên tài khoản' onChange={(e) => { setSearchByEmail(e.target.value) }} />
                    <Input style={{ width: 150 }} value={searchByPhone} size="small" type="text" placeholder='Số điện thoại' onChange={(e) => { setSearchByPhone(e.target.value) }} />
                    <Select
                        value={searchStatus}
                        style={{ width: 120, height: 25 }}
                        onChange={handleSelectorChange}
                        options={[
                            { value: null, label: 'Tất cả' },
                            { value: true, label: 'Hoạt động' },
                            { value: false, label: 'Tạm khoá' },
                        ]}
                    />
                    <Button danger size={"small"} onClick={() => { getPageUserList() }}>
                        Tìm kiếm
                    </Button>
                    <Button type="default" size={"small"} onClick={() => { clearSearchOption() }}>
                        Làm mới
                    </Button>
                </Flex>
            </Flex>
            <div className="table-container">
                <Table
                    columns={columns}
                    pagination={{ position: ["bottomLeft"], pageSize: 10, size: 'default', onChange: handlePage, total: resultCount }}
                    dataSource={data}
                />
            </div>
    </div>
  )
}
