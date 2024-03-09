import axios from "axios"

export const userApiModule = {
    createNew:async function (newUserDetail:any){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users",
        newUserDetail,
        {headers:{'Content-Type': 'multipart/form-data'}})
    },
    checkExist:async function (checkExistData:object){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users/check-exist",checkExistData)
    },
    loginByAccount: async function (loginInfo:{email:string, password:string}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users/login",loginInfo)
    },
    checkLogin:async function (token: string){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/users/check-login`,{token})
    },
    loginWithGoogle:async function (newUserDetail:{
        email:string | null,
        password:string,
        phone:string,
        avatar:string,
        ip:string
      }){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users/login-google",newUserDetail)
    }
}