import axios from "axios"

export const adminReceiptMngApiModule = {
    getReceipts:async function (searchName:string,searchStatus:string,current:number,pageSize:number){
        return await axios.get(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/receipts?userName=${searchName}&status=${searchStatus != "null" ? searchStatus:""}&current=${current}&size=${pageSize}`)
      },
    cancelReceipt:async function(receiptId:number){
        return await axios.patch(import.meta.env.VITE_PROTOCOL+import.meta.env.VITE_HOST+`/api/v1/admin-products/cancel-receipt`,{receiptId})
    }
}