import axios from "axios"

export const adminApiModule = {
    login:async function(data:{username:string,password:string}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins",data)
    }
    ,
    checkLogin:async function(token:string){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins/check-login",{token})
    },
    record:async function(operateInfo:{id?:number,content:string,operator?:string}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/admins/record",operateInfo)
    }
    ,
    changeUserStatus:async function(user:{userId:number,userStatus:boolean}){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins-users/user-status`,user)
    }
    ,
    resetPW:async function(userId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins-users/reset-pass`,{userId})
    }
    ,
    updatePhone:async function(userId:number,newPhoneNo:string){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins-users/update-phone`,{userId,newPhoneNo})
    }
    ,
    search:async function(searchOption:{status:boolean|null,email:string|null,phone:string|null,currentPage:number,pageSize:number}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins-users/users-search`,searchOption)
    },
    getRecord:async function(searchOperator:string,current:number,pageSize:number){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins/record?operator=${searchOperator}&current=${current}&size=${pageSize}`)
    }
}