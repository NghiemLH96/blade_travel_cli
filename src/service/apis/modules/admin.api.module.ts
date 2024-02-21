import axios from "axios"

export const adminApiModule = {
    login:async function(data:{username:string,password:string}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins",data)
    }
    ,
    checkLogin:async function(token:string){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins/check-login",{token})
    }
    ,
    getUsers:async function(){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins/get-users")
    }
    ,
    changeUserStatus:async function(user:{userId:number,userStatus:boolean}){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/user-status`,user)
    }
    ,
    resetPW:async function(userId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/reset-pass`,{userId})
    }
}