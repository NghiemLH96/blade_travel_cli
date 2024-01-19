import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import authImg from '@pics/authen.jpg'
import logo from '@pics/logo_b.png'
import './authPage.scss'
import { message, Modal, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';

export default function AuthenPage() {
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img as any);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = (file as any).type === 'image/jpeg' || (file as any).type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = (file as any).size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const props: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const navigate = useNavigate()
  const { pageFn } = useParams()
  useEffect(() => {
    if (!(pageFn == "login" || pageFn == "business-login" || pageFn == "admin-login")) {
      showModal()
    }
  }, [])


  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    navigate("/auth/login")
    setOpen(false);
  };

  const handleCancel = () => {
    navigate("/")
    setOpen(false);
  };

  //Validate data
  const [newUserDetail, setNewUserDetail] = useState({
    email: "",
    password: "",
    phone: ""
  })
  const [emailField, setEmailField] = useState(false)
  const [emailError, setEmailError] = useState("")
  let validateEmail = {
    isEmail: function (emailString: string) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailString)
    }
  }

  const [passwordField, setPasswordField] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passVision , setPassVision ] = useState(false)

  const [confirmPassField, setConfirmPassField] = useState(false)
  const [confirmPassError, setConfirmPassError] = useState("")
  const [confirmPassVision , setConfirmPassVision ] = useState(false)

  const [phoneField, setPhoneField] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  const [ nextStepBtn , setNextStepBtn ] = useState(false)
useEffect(()=>{
  console.log("passwordField",passwordField);
  console.log("confirmPassField",confirmPassField);
  console.log("phoneField",phoneField);
  console.log("emailField",emailField);
  if (emailField == true && passwordField == true && confirmPassField == true && phoneField == true) {
    document.querySelector("#register_nextBtn")?.removeAttribute("disabled");
    setNextStepBtn(true)
  }else{
    document.querySelector("#register_nextBtn")?.setAttribute("disabled","");
    setNextStepBtn(false)
  }
},[emailField,passwordField,confirmPassField,phoneField])

  return (
    <section className="authPage_container">
      <Modal
        title="Lỗi địa chỉ truy cập"
        open={open}
        onOk={handleOk}
        okText="Qua trang đăng nhập"
        cancelText="Trở về trang chủ"
        onCancel={handleCancel}
      >
        <p>Địa chỉ truy cập không chính xác!</p>
      </Modal>
      <div className="authSite_container">
        <div className="authSite_left">
          <img className="authSite_logo" src={logo} alt="" />
          <img className="authSite_backGround" src={authImg} alt="" />
        </div>
        <div className="authSite_right">
          <div className="login_container">
            <h2>{pageFn == "admin-login" ? "Admin Đăng Nhập" : "Đăng Nhập"}</h2>
            <form className="login_form" action="">
              <div className="inputField">
                <label htmlFor="login_email">Email :</label>
                <input id="login_email" name="login_email" type="email" />
              </div>
              <div className="inputField">
                <label htmlFor="login_password"> Mật Khẩu :</label>
                <input id="login_password" name="login_password" type="password" />
              </div>
              <div className="optionField">
                <span>{pageFn == "login" && "Quên mật khẩu"}</span>
                {pageFn == "login" && <p>Vẫn chưa có tài khoản? <span onClick={() => { document.querySelector(".authSite_right")?.classList.add("active_register") }}>Đăng ký ngay</span> </p>}
              </div>
              <button>Đăng Nhập</button>
            </form>
            {pageFn == "login" && <button className="login_socialMedia">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google social_icon" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
              </svg>
              <span>Đăng nhập bằng tài khoản Google</span>
            </button>
            }
          </div>
          <div className="register_container">
            <div className="register_fstStep">
              <h2>Đăng Ký</h2>
              <form onSubmit={(e) => { e.preventDefault() }} className="register_form" action="">
                <div className="inputField">
                  <label htmlFor="register_email"> Email :</label>
                  <input id="register_email" name="register_email" type="text" onChange={(e) => {
                    console.log("1");
                    
                    if (e.target.value == "") {
                      setEmailField(false)
                      setNewUserDetail({...newUserDetail,email:e.target.value})
                      setEmailError("Email không được để trống!")
                    } else {
                      if (!validateEmail.isEmail(e.target.value)) {
                        setEmailField(false)
                        setNewUserDetail({...newUserDetail,email:e.target.value})
                        setEmailError("Email chưa đúng định dạng!")
                      } else {
                        setEmailField(true)
                        setNewUserDetail({...newUserDetail,email:e.target.value})
                        setEmailError("")
                      }
                    }
                  }} />
                  <p>{emailError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_pass"> Password :</label>
                  <span onClick={()=>{setPassVision(!passVision)}} className="material-symbols-outlined visionIcon">
                    {passVision ? "visibility_off" : "visibility"}
                  </span>
                  <input id="register_pass" name="register_pass" type={passVision ? "text" : "password"} onChange={(e) => {
                    if (e.target.value == "") {
                      setPasswordField(false)
                      setNewUserDetail({...newUserDetail,password:e.target.value})
                      setPasswordError("Mật khẩu không được để trống!")
                    } else {
                      if (e.target.value.length > 16) {
                        setPasswordField(false)
                        setNewUserDetail({...newUserDetail,password:e.target.value})
                        setPasswordError("Mật khẩu không quá 16 ký tự!")
                      } else {
                        setPasswordField(true)
                        setNewUserDetail({...newUserDetail,password:e.target.value})
                        setPasswordError("")
                      }
                    }
                  }} />
                  <p>{passwordError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_passConfirm"> Confirm Password :</label>
                  <span onClick={()=>{setConfirmPassVision(!confirmPassVision)}} className="material-symbols-outlined visionIcon">
                    {confirmPassVision ? "visibility_off" : "visibility"}
                  </span>
                  <input id="register_passConfirm" name="register_passConfirm" type={confirmPassVision ? "text" : "password"} onChange={(e) => {
                    if (e.target.value == "") {
                      setConfirmPassField(false)
                      setConfirmPassError("Xác nhận mật khẩu không được để trống!")
                    } else {
                      if (e.target.value != newUserDetail.password) {
                        setConfirmPassField(false)
                        setConfirmPassError("Mật khẩu không khớp!")
                      } else {
                        setConfirmPassField(true)
                        setConfirmPassError("")
                      }
                    }
                  }} />
                  <p>{confirmPassError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_phone"> Phone :</label>
                  <input id="register_phone" name="register_phone" type="text" onChange={(e) => {
                    if (e.target.value == "") {
                      setPhoneField(false)
                      setNewUserDetail({...newUserDetail,phone:e.target.value})
                      setPhoneError("Số điện thoại không được để trống!")
                    } else {
                      if(isNaN(Number(e.target.value))){
                        setPhoneField(false)
                        setNewUserDetail({...newUserDetail,phone:e.target.value})
                        setPhoneError("Số điện thoại không hợp lệ!")
                      }else{
                        if (e.target.value.length != 10) {
                          setPhoneField(false)
                          setNewUserDetail({...newUserDetail,phone:e.target.value})
                          setPhoneError("Số điện thoại phải có 10 số!")
                        }else {
                          setPhoneField(true)
                          setNewUserDetail({...newUserDetail,phone:e.target.value})
                          setPhoneError("")
                        }
                      }
                    }
                  }}/>
                  <p>{phoneError}</p>
                </div>
                <div className="btnField">
                  <button onClick={() => { document.querySelector(".authSite_right")?.classList.remove("active_register") }}>Quay lại đăng nhập</button>
                  <button id="register_nextBtn" className={nextStepBtn ? "" : "disabled"} onClick={() => { document.querySelector(".authSite_right")?.classList.add("active_avatar") }}>Tiếp theo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                  </svg></button>
                </div>
              </form>
            </div>
            <div className="register_sndStep">
              <h2>Avatar</h2>
              <div>
                <Upload
                  {...props}
                  maxCount={1}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </div>
              <div className="btnField">
                <button onClick={() => { document.querySelector(".authSite_right")?.classList.remove("active_avatar") }}>Quay lại đăng nhập</button>
                <button onClick={() => { document.querySelector(".authSite_right")?.classList.add("active_success") }}>Tiếp theo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                </svg></button>
              </div>
            </div>
            <div className="register_success">
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" color="green" fill="currentColor" className="bi bi-check-circle successIcon" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
              </svg>
              <div className="success_message">
                <h2>Đăng ký thành công</h2>
                <p>Yêu cầu xác thực email đã được gửi<br />
                  vui lòng kiểm tra và làm theo hướng dẫn.
                </p>
              </div>
              <button onClick={() => { navigate("/") }}>Quay lại trang chủ</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
