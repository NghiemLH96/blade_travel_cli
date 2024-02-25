import { userApiModule } from "./modules/user.api.module"
import { adminApiModule } from "./modules/admins/admin.api.module"
import { usersMngApiModule } from "./modules/admins/admin-user.api.module"
import { adminAccsMngApiModule } from "./modules/admins/admin-account.api.module"
import { adminProductsApiModule } from "./modules/admins/admin-product.api.module"
export const apis =  {
    userApiModule,
    adminApiModule,
    usersMngApiModule,
    adminAccsMngApiModule,
    adminProductsApiModule
}