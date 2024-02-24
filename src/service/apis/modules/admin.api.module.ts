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
    changeUserStatus:async function(user:{userId:number,userStatus:boolean}){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/user-status`,user)
    }
    ,
    resetPW:async function(userId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/reset-pass`,{userId})
    }
    ,
    updatePhone:async function(userId:number,newPhoneNo:string){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/update-phone`,{userId,newPhoneNo})
    }
    ,
    search:async function(searchOption:{status:boolean|null,email:string|null,phone:string|null,currentPage:number,pageSize:number}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/users-search`,searchOption)
    }
}