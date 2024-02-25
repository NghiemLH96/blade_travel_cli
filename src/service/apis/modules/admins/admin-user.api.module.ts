import axios from "axios"

export const usersMngApiModule = {
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
    search:async function(searchOption:{status:boolean|null,email:string,phone:string,currentPage:number,pageSize:number}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admins-users/users-search`,searchOption)
    }
}