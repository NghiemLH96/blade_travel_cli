import { apis } from "@/service/apis"
import { StoreType } from "@/store"
import { Card, message } from "antd"
import Meta from "antd/es/card/Meta"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import '../products/products.scss'

export default function Brand() {
    const userStore = useSelector((store: StoreType) => store.userStore)
    const {id} = useParams()
    const [brandProductsList,setBrandProductsList] = useState([])
    const [brandDetail,setBrandDetail]=useState()

    useEffect(()=>{
        getBrandProducts()
        getBrandDetail()
    },[])
    
    const getBrandDetail = async() =>{
        try {
            const result = await apis.productCliApi.getBrandDetail(Number(id))
            if (result.status==200) {
                setBrandDetail(result.data.data[0])
            }else{
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }
    const getBrandProducts = async()=>{
        try {
            const result = await apis.productCliApi.getProductByBrand(Number(id))
            if (result.status==200) {
                console.log(result.data.data);
                
                setBrandProductsList(result.data.data)
            }else{
                message.error("Lấy dữ liệu thất bại")
            }
        } catch (error) {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    const addToCart = async (itemId: number) => {
        try {
            if (localStorage.getItem('token')) {
                if (userStore.data) {
                    const result = await apis.productCliApi.addToCart(itemId, userStore.data?.id)
                    if (result.status == 200) {
                        message.success("Thêm sản phẩm thành công")
                    } else {
                        message.error("Thêm sản phẩm thất bại")
                    }
                }
            } else {
                message.error("Quý khách cần đăng nhập trước khi thêm sản phẩm")
                return
            }
        } catch (error) {
            message.error("Lỗi gì đó")
        }
    }

  return (
    <div className='page-container'>
            <div style={{width:'100%',height:'150px'}} className="brandTitle" onClick={()=>{console.log(brandDetail);
            }}>
                <img style={{width:'100%',height:'120px',objectFit:'contain'}} src={(brandDetail as any)?.brandLogo} alt="" />
            </div>
            <div style={{display:'flex',justifyContent:'center'}} className="productsDisplay-container">
                {brandProductsList.length!=0 ? brandProductsList.map(item =>(
                    <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={(item as any).avatar} />}
                >
                    <div className="brandLogo-container">
                        <img className="brandLogo" src={(item as any).FK_products_brands.brandLogo} alt="" />
                    </div>
                    {
                        (item as any).bestSeller &&
                        <div className="bestSeller-mark">
                            <p className="bestSeller-text" style={{ lineHeight: "0px", margin: '0px' }}>Best Seller</p>
                        </div>
                    }
                    <Meta title={(item as any).productName} description={
                        <div className="card-description">
                            <p>{`Giá: ${(item as any).price}`}</p><br />
                            <p>{`Thương hiệu: ${(item as any).FK_products_brands.brandName}`}</p><br />
                            <p>{`Xuất xứ: ${(item as any).FK_products_madeBy.country}`}</p><br />
                            <p>{`Chất liệu: ${(item as any).FK_products_material.material}`}</p><br />
                        </div>
                    } />
                    <button onClick={() => { addToCart((item as any).id) }} className="addCart-btn">Thêm vào giỏ</button>
                </Card>
                )):<img style={{width:'100%' , height:'200px'}} src="https://www.bangladesh-made.com/assets/images/no-product-found.png"/>}
            </div>
    </div>
  )
}
