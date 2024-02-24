import { useState } from 'react'
import './phoneEditProp.scss'
import { Modal } from 'antd';
import { apis } from '@/service/apis';

export default function PhoneEditProp({showPhoneEdit,setShowPhoneEdit,getPageUserList,editingUserId}:{showPhoneEdit:boolean,setShowPhoneEdit:any,getPageUserList:any,editingUserId:number}) {
    const [updatePhone , setUpdatePhone] = useState("")
    
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

    const handleChangePhone = async(e:React.SyntheticEvent) => {
        e.preventDefault()
        if (updatePhone == "") {
            error("Số điện thoại không được để trống!")
          } else {
            if (isNaN(Number(updatePhone))) {
              error("Số điện thoại không hợp lệ! (number only)")
            } else {
              if (updatePhone.length != 10) {
                error("Số điện thoại chuẩn phải có 10 số!")
              } else {
                try {
                  const result = await apis.adminApiModule.updatePhone(editingUserId,updatePhone)
                  if (result.status == 200) {
                    success(result.data.message)
                    getPageUserList()
                    setShowPhoneEdit(false)
                  }else{
                    error(result.data.message)
                  }
                } catch (err) {
                  error(String(err))
                }
              }
            }
          }
    }
  return (
    <div className="prop_layout">
        <form onSubmit={(e)=>{handleChangePhone(e)}} className={showPhoneEdit ? 'prop_container' : 'prop_container hide'}>
            <h2>Cập nhật số điện thoại</h2>
            <input type="text" placeholder='Số điện thoại mới' onChange={(e)=>{setUpdatePhone(e.target.value)}}/>
            <div className='btnBox'>
                <button style={{backgroundColor:"red"}} onClick={()=>{setShowPhoneEdit(false)}}>Huỷ</button>
                <button type='submit' style={{backgroundColor:"blue"}}>Cập nhật</button>
            </div>
        </form>
    </div>
  )
}
