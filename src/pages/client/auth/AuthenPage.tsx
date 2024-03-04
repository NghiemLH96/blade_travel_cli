import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import './authPage.scss'
import { message , Modal } from 'antd';
import { apis } from "@/service/apis";
import utils from "@/utils";
import { userAction } from "@/store/slices/loginDetail.slice";
import { useAppDispatch } from "@/store/store";
import {  GoogleOutlined } from "@ant-design/icons";

export default function AuthenPage() {
  const dispatch = useAppDispatch();
  //ANTD warning notification
  const warningNotice = (content:string) => {
    Modal.warning({
      content: content,
      onOk:()=>{
        navigate("/")
      }
    });
  };

  useEffect(()=>{
    checkLogin()
  },[])
  const checkLogin = async ()=>{
    let token = localStorage.getItem("token")
    if (token) {
      try {
        let result = await apis.userApiModule.checkLogin(token)
        if (result.status == 200) {
          dispatch(userAction.createLogin(result.data.data))
          warningNotice("Hiện bạn đang trong trạng thái đang nhập")
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // ANTD components
  // >Error Message
  const [messageApi, contextHolder] = message.useMessage();
  const errorMessage = (errorText: string) => {
    messageApi.open({
      type: 'error',
      content: errorText,
    });
  };
  // >Success Message
  const successMessage = (informText: string) => {
    messageApi.open({
      type: 'success',
      content: informText,
    });
  };

  //
  const navigate = useNavigate()
  const { pageFn } = useParams()


  //Validate data
  const [emailError, setEmailError] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passValue, setPassValue] = useState("")
  const [passVision, setPassVision] = useState(false)
  const [confirmPassError, setConfirmPassError] = useState("")
  const [confirmPassVision, setConfirmPassVision] = useState(false)
  const [phoneValue, setPhoneValue] = useState("")
  const [phoneError, setPhoneError] = useState("")

  // Bước kiểm tra dữ liệu nhập lúc đăng ký
  const firstStepVerify = async (e: React.SyntheticEvent) => {
    //vô hiệu hoá tính năng reload của Form.Event
    e.preventDefault();

    let verifyFlag = true;
    //Kiểm tra định dạng Email
    let validateEmail = {
      isEmail: function (emailString: string) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailString)
      }
    }

    if ((e.target as any).register_email.value == "") {
      verifyFlag = false;
      setEmailValue((e.target as any).register_email.value)
      setEmailError("Email không được để trống!")
    } else {
      if (!validateEmail.isEmail((e.target as any).register_email.value)) {
        verifyFlag = false;
        setEmailValue((e.target as any).register_email.value)
        setEmailError("Email chưa đúng định dạng!")
      } else {
        setEmailValue((e.target as any).register_email.value)
        setEmailError("")
      }
    }

    //Kiểm tra định dạng Mật Khẩu
    if ((e.target as any).register_pass.value == "") {
      verifyFlag = false;
      setPassValue((e.target as any).register_pass.value)
      setPasswordError("Mật khẩu không được để trống!")
    } else {
      if ((e.target as any).register_pass.value.length < 8) {
        verifyFlag = false;
        setPassValue((e.target as any).register_pass.value)
        setPasswordError("Mật khẩu không ít hơn 8 ký tự!")
      } else {

        if ((e.target as any).register_pass.value.length > 16) {
          verifyFlag = false;
          setPassValue((e.target as any).register_pass.value)
          setPasswordError("Mật khẩu không quá 16 ký tự!")
        } else {
          setPassValue((e.target as any).register_pass.value)
          setPasswordError("")
        }
      }
    }

    //Kiểm tra xác nhận mật khẩu
    if ((e.target as any).register_passConfirm.value == "") {
      verifyFlag = false;
      setConfirmPassError("Xác nhận mật khẩu không được để trống!")
    } else {
      if ((e.target as any).register_passConfirm.value != (e.target as any).register_pass.value) {
        verifyFlag = false;
        setConfirmPassError("Mật khẩu không khớp!")
      } else {
        setConfirmPassError("")
      }
    }

    //Kiểm tra định dạng số điện thoại
    if ((e.target as any).register_phone.value == "") {
      verifyFlag = false;
      setPhoneValue((e.target as any).register_phone.value)
      setPhoneError("Số điện thoại không được để trống!")
    } else {
      if (isNaN(Number((e.target as any).register_phone.value))) {
        verifyFlag = false;
        setPhoneValue((e.target as any).register_phone.value)
        setPhoneError("Số điện thoại không hợp lệ! (number only)")
      } else {
        if ((e.target as any).register_phone.value.length != 10) {
          verifyFlag = false;
          setPhoneValue((e.target as any).register_phone.value)
          setPhoneError("Số điện thoại chuẩn phải có 10 số!")
        } else {
          setPhoneValue((e.target as any).register_phone.value)
          setPhoneError("")
        }
      }
    }

    //Nếu dữ liệu k đúng định dạng thì đình chỉ hàm
    if (!verifyFlag) {
      return
    }

    //Nếu dữ liệu đúng định dạng thì kiểm tra dữ liệu đã từng đăng ký hay chưa
    const checkExistData = {
      email: emailValue,
      phone: phoneValue
    }

    try {
      const result = await apis.userApiModule.checkExist(checkExistData)

      if (result.status == 200) {
        document.querySelector(".authSite_right")?.classList.add("active_avatar")
      } else {
        errorMessage(result.data.message)
        return
      }
    } catch (error) {
      errorMessage(String(error))
      return
    }
  }

  const [avatarFile, setAvatarFile] = useState(null);
  //Đăng ký
  const handleRegister = async () => {
    const newUserDetail = {
      email: emailValue,
      password: passValue,
      phone: phoneValue
    }

    let userFormData = new FormData();
    userFormData.append("data", JSON.stringify(newUserDetail))
    userFormData.append("avatar", avatarFile as any)
    try {
      const result = await apis.userApiModule.createNew(userFormData)
      if (result.status == 200) {
        document.querySelector(".authSite_right")?.classList.add("active_success")
      } else {
        errorMessage(result.data.message)
      }
    } catch (error) {
      errorMessage(String(error))
    }
  }
  /*********************************************************************************************************/
  //Đăng nhập

  const handleLogin = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    let loginInfo = {
      email:(e.target as any).login_email.value,
      password:(e.target as any).login_password.value
    }
    try {
      let loginResult = await apis.userApiModule.loginByAccount(loginInfo)
      if (loginResult.status == 200) {
        successMessage(loginResult.data.message)
        localStorage.setItem("token",loginResult.data.token)
        setTimeout(()=>{navigate("/")},500)
      }else{
        errorMessage(loginResult.data.message)
        return
      }
    } catch (error) {
      errorMessage("Lỗi gì rồi nhỉ? thôi thử lại sau nhé")
    }
  }
  return (
    <section className="authPage_container">
      {contextHolder}
      <div className="authSite_container">
        <div className="authSite_left">
          <img className="authSite_logo" src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Flogo_b.png?alt=media&token=90278c26-bea6-4640-8499-5dfde55a41d8" alt="" />
          <img className="authSite_backGround" src={"https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fyoung-man-cycling-skatepark-low-angle-shot.jpg?alt=media&token=899e8907-7e86-40f0-b2dc-724c2dde4abe"} alt="" />
        </div>
        <div className="authSite_right">
          <div className="login_container">
            <h2>{pageFn == "admin-login" ? "Admin Đăng Nhập" : "Đăng Nhập"}</h2>
            <form onSubmit={(e:React.SyntheticEvent)=>{ handleLogin(e) }} className="login_form" action="">
              <div className="inputField">
                <label htmlFor="login_email">Email :</label>
                <input id="login_email" name="login_email" type="email" />
              </div>
              <div className="inputField">
                <label htmlFor="login_password"> Mật Khẩu :</label>
                <input id="login_password" name="login_password" type="password" />
              </div>
              <div className="optionField">
                <span>Quên mật khẩu</span>
                <p>Vẫn chưa có tài khoản? <span onClick={() => { document.querySelector(".authSite_right")?.classList.add("active_register") }}>Đăng ký ngay</span> </p>
              </div>
              <button type="submit">Đăng Nhập</button>
            </form>
            <button className="login_socialMedia" onClick={async()=>{
               try {
                  let result = await utils.firebase.handleGoogleLogin()
                  console.log("result",result.user);
                    const loginDetail = {
                      email:result.user.email,
                      password:result.user.uid,
                      phone:result.user.phoneNumber || "0000000000",
                      avatar:result.user.photoURL || "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg",
                      ip:"127.0.0.1"
                    }
                  const createResult = await apis.userApiModule.loginWithGoogle(loginDetail)
                  if (createResult.status == 200) {
                    localStorage.setItem("token",createResult.data.token)
                    message.success(createResult.data.message)
                    setTimeout(()=>{
                      navigate('/')
                    },1000)
                  }
                  
                  
               } catch (err) {
                  console.log("loi dang nhap google",err);
                  
               }
            }}>
              <GoogleOutlined />
              <span>Đăng nhập bằng tài khoản Google</span>
            </button>
          </div>
          <div className="register_container">
            <div className="register_fstStep">
              <h2>Đăng Ký</h2>
              <form onSubmit={(e: React.SyntheticEvent) => { firstStepVerify(e) }} className="register_form" action="">
                <div className="inputField">
                  <label htmlFor="register_email"> Email :</label>
                  <input id="register_email" name="register_email" type="text" onChange={() => {
                    setEmailError("")
                  }} />
                  <p className="errorText">{emailError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_pass"> Password :</label>
                  <span onClick={() => { setPassVision(!passVision) }} className="material-symbols-outlined visionIcon">
                    {passVision ? "visibility_off" : "visibility"}
                  </span>
                  <input id="register_pass" name="register_pass" type={passVision ? "text" : "password"} onChange={() => {
                    setPasswordError("")
                  }} />
                  <p className="errorText">{passwordError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_passConfirm"> Confirm Password :</label>
                  <span onClick={() => { setConfirmPassVision(!confirmPassVision) }} className="material-symbols-outlined visionIcon">
                    {confirmPassVision ? "visibility_off" : "visibility"}
                  </span>
                  <input id="register_passConfirm" name="register_passConfirm" type={confirmPassVision ? "text" : "password"} onChange={() => {
                    setConfirmPassError("")
                  }} />
                  <p className="errorText">{confirmPassError}</p>
                </div>
                <div className="inputField">
                  <label htmlFor="register_phone"> Phone :</label>
                  <input id="register_phone" name="register_phone" type="text" onChange={() => {
                    setPhoneError("")
                  }} />
                  <p className="errorText">{phoneError}</p>
                </div>
                <div className="btnField">
                  <button onClick={() => { document.querySelector(".authSite_right")?.classList.remove("active_register") }}>Quay lại đăng nhập</button>
                  <button type="submit" id="register_nextBtn">Tiếp theo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                  </svg></button>
                </div>
              </form>
            </div>
            <div className="register_sndStep">
              <h2>Avatar</h2>
              <div className="uploadAvatar">
                <img className="showAvatar" src={avatarFile ? URL.createObjectURL(avatarFile) : "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"}></img>
                <input onChange={(e) => {
                  setAvatarFile((e.target as any).files[0])
                }} type="file" />
              </div>
              <div className="btnField">
                <button onClick={() => { document.querySelector(".authSite_right")?.classList.remove("active_avatar") }}>Quay lại</button>
                <button onClick={() => { handleRegister() }}>{avatarFile ? "Đăng ký" : "Bỏ qua"} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
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
