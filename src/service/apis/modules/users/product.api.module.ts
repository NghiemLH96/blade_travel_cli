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
    },
    addToCart:async function(itemId:number,userId:number|undefined){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/products/add-to-cart",{itemId,userId})
    },
    getCart:async function(userId:number){
        return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/products/get-cart",{userId})
    } ,
    cartIncrease:async function(itemId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/products/cart-increase",{itemId})
    },
    cartDecrease:async function(itemId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+"/api/v1/products/cart-decrease",{itemId})
    },
    removeCartItem:async function(itemId:number){
        return await axios.delete(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/products/cart-remove/${itemId}`)
    }
}