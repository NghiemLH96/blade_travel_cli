import axios from "axios"

export const userApiModule = {
    createNew:async function (newUserDetail:any){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users",newUserDetail,{headers:{"Content-Type":"multipart/form-data"}})
    },
    checkExist:async function (checkExistData:object){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/users/check-exist",checkExistData)
    }
}