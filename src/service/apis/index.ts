import { userApiModule } from "./modules/users/user.api.module"
import { adminApiModule } from "./modules/admins/admin.api.module"
import { usersMngApiModule } from "./modules/admins/admin-user.api.module"
import { adminAccsMngApiModule } from "./modules/admins/admin-account.api.module"
import { adminProductsApiModule } from "./modules/admins/admin-product.api.module"
import { productCliApi } from "./modules/users/product.api.module"
import { adminReceiptMngApiModule } from "./modules/admins/admin-receipt.api.module"

export const apis =  {
    userApiModule,
    adminApiModule,
    usersMngApiModule,
    adminAccsMngApiModule,
    adminProductsApiModule,
    adminReceiptMngApiModule,
    productCliApi
}