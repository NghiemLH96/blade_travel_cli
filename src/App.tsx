import MainRoutes from "@routes/MainRoutes"
import { useEffect } from "react"
import { useAppDispatch } from "./store/store"
import { apis } from "./service/apis"
import { userAction } from "./store/slices/loginDetail.slice"

function App() {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token")
      verifyToken(token)
    }
  },[])
  const verifyToken = async(token:string|null) => {
    try {
      if (token == null) {
        return
      }else{
        const result = await apis.userApiModule.checkLogin(token)
        if (result.status == 200) {
          dispatch(userAction.createLogin(result.data.data))
        }
      }
    } catch (error) {
      
    }
  }
  return (
    <>
      <MainRoutes/>
    </>
  )
}

export default App
