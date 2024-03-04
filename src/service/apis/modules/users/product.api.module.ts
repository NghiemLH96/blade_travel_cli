import axios from "axios"

export const productCliApi = {
    getBestSeller:async function(){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/products/best-seller")
    },
    getProductsByOption:async function(data:{
        productName:string,
        material:number|null,
        madeBy:number|null,
        category:number|null,
        brand:number|null,
        currentPage:number,
        pageSize:number
      }){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/products?name=${data.productName}&category=${data.category}&material=${data.material}&madeby=${data.madeBy}&brand=${data.brand}&current=${data.currentPage}&take=${data.pageSize}`)
    }
}