import axios from "axios"

export const adminProductsApiModule = {
    search:async function(searchOption:{
        productName:string,
        material:number|null,
        status:boolean|null,
        madeBy:number|null,
        category:number|null,
        brand:number|null,
        currentPage:number,
        pageSize:number
      }){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/search`,searchOption)
    },
    getProductBrand:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/brands`)
    },
    getProductmadeBy:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/made-by`)
    },
    getProductMaterial:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/material`)
    },
    getProductCategories:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/categories`)
    },
    changeStatus:async function(item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/status`,item)
    },
    createNew:async function(newProductDetail:any){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/create-new`,newProductDetail,{headers:{'Content-Type': 'multipart/form-data'}})
    },
    delete:async function(item:{id:number}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/delete`,item)
    }
}