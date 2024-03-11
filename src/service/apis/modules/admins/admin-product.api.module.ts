import axios from "axios"
interface updateDetail{
    id:number
    productName:string
    material:number|null
    madeBy:number|null
    categoryId:number|null
    price:number
    brand:number|null
}

export const adminProductsApiModule = {
    productFilter:async function(data:{
        productName:string,
        material:number|null,
        status:boolean|null,
        madeBy:number|null,
        category:number|null,
        brand:number|null,
        currentPage:number,
        pageSize:number
      }){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products?name=${data.productName}&category=${data.category}&status=${data.status}&material=${data.material}&madeby=${data.madeBy}&brand=${data.brand}&current=${data.currentPage}&take=${data.pageSize}`)
    },
    changeStatus:async function(item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/status`,item)
    },
    createNew:async function(newProductDetail:any){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/create-new`,newProductDetail,{headers:{'Content-Type': 'multipart/form-data'}})
    },
    updateDetail:async function(productDetail:updateDetail){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/update-detail`,productDetail)
    },
    uploadImgs:async function(imgsList:any){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/upload`,imgsList,{headers:{'Content-Type': 'multipart/form-data'}})
    },
    delete:async function(item:{id:number}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/delete`,item)
    },
    getProductMaterial:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/material`)
    },
    changeMaterialStatus:async function (item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/material-status`,item)
    },
    addNewMaterial:async function (newMaterialName:string){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/material-new`,{newMaterialName})
    },
    deleteBrand:async function (brandId:number){
      return await axios.delete(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/brand?id=${brandId}`)
    },
    changeBrandStatus:async function (item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/brand-status`,item)
    },
    getProductBrand:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/brands`)
    },
    addNewBrand:async function (brandFormData:any){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/brand-new`,brandFormData,{headers:{'Content-Type': 'multipart/form-data'}})
    },
    deleteMaterial:async function (materialId:number){
      return await axios.delete(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/material?id=${materialId}`)
    },
    getProductCategories:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/categories`)
    },
    changeCategoryStatus:async function (item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/category-status`,item)
    },
    addNewCategory:async function (newCategoryName:any){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/category-new`,newCategoryName)
    },
    deleteCategory:async function (categoryId:number){
      return await axios.delete(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/category?id=${categoryId}`)
    },
    getProductmadeBy:async function(){
      return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/made-by`)
    },
    changeMadeByStatus:async function (item:{id:number,status:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/made-by-status`,item)
    },
    addNewMadeBy:async function (newCountry:string){
      return await axios.post(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/made-by-new`,{newCountry})
    },
    deleteMadeBy:async function (madeById:number){
      return await axios.delete(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/made-by?id=${madeById}`)
    },
    setBestSeller:async function(item:{id:number,bestSeller:boolean}){
      return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/set-BS`,item)
    }
}