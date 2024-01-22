import axios from "axios"

export const userApiModule = {
    createNew:async function (newUserDetail:object){
        return await axios.post(import.meta.env.PROTOCOL+import.meta.env.HOST+"/users",newUserDetail)
    }
}