import axios from "axios"

export const adminProductsApiModule = {
    search:async function(searchOption:{
        productName:string,
        material:string|null,
        status:boolean|null,
        madeBy:string|null,
        category:string|null,
        brand:string|null,
        currentPage:number,
        pageSize:number
      }){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/search`,searchOption)
    }
}