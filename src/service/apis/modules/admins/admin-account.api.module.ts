import axios from "axios"

export const adminAccsMngApiModule = {
    search:async function(searchOption:{status:boolean|null,username:string,currentPage:number,pageSize:number}){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-accounts/search`,searchOption)
    }
    ,
    changeStatus:async function(adminDetail:{id:number,status:boolean}){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-accounts/status`,adminDetail)
    }
    ,
    changeDepartment:async function(changeDetail:{id:number,department:string}){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-accounts/department`,changeDetail)
    }
}