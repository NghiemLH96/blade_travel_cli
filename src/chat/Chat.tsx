import './component/chatBox.scss'
import ChatBox from './component/ChatBox';
import { useEffect, useState } from 'react';
import { chatService } from '@/socket/chat.socket';
import { Button, Form } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';

export default function Chat() {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (localStorage.getItem("guest-infor")) {
            chatService.connect(JSON.parse(localStorage.getItem("guest-infor") || ""))
        }
    }, [])
    const [chatBoxForm] = Form.useForm<{
        guestName: string
    }>();

    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    return (
        <div className='chat-box'>
            {
                open ? (
                    <div>
                        <button className="closeBtn" onClick={() => { setOpen(false) }}>X</button>
                        <ChatBox setOpen={setOpen} />
                    </div>
                ) : (
                    <ModalForm<{
                        guestName: string
                    }>
                        title="Thêm mới"
                        trigger={
                            <Button size="large" type="primary">
                                Hỗ trợ
                            </Button>
                        }
                        form={chatBoxForm}
                        autoFocusFirstInput
                        variant="filled"
                        modalProps={{
                            destroyOnClose: true,
                        }}
                        submitTimeout={2000}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            if (localStorage.getItem("guest-infor")) {
                                setOpen(true)
                            } else {
                                let data = {
                                    guestId: `guest_${Math.ceil(Math.random() * Date.now())}`,
                                    guestName: values.guestName,
                                }
                                if (data.guestName == "") return
                                localStorage.setItem("guest-infor", JSON.stringify(data))
                                /* connect socket */
                                chatService.connect(data)
                                setOpen(true)
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="guestName"
                                label="Nhập tên khách hàng"
                                placeholder="Tên xưng hô"
                                required
                            />
                        </ProForm.Group>
                    </ModalForm>
                )
            }

        </div>

    )
}
