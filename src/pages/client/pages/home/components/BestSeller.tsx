import { apis } from "@/service/apis";
import { StoreType } from "@/store";
import { Card, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const { Meta } = Card;

export default function BestSeller() {
    useEffect(() => {
        getProducts()
    }, [])
    const [bestSellerList, setBestSellerList] = useState([])

    const userStore = useSelector((store: StoreType) => store.userStore)


    const getProducts = async () => {
        try {
            const result = await apis.productCliApi.getBestSeller()
            if (result.status == 200) {
                setBestSellerList(result.data.data)
            }
        } catch (error) {
            setBestSellerList([])
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
        <section className='banner_container bestSeller'>
            <h3 className='banner_title'>Sản phẩm bán chạy</h3>
            <div className="bestSeller-display">
                <div className="bestSeller-slideList" id="bestSeller-slideList">
                    {bestSellerList.map(item => (
                        <div key={Math.random() * Date.now()} className="bestSeller_slide">
                            <Card
                                hoverable
                                style={{ width: '270px', objectFit: 'cover' }}
                                cover={<img alt="example" src={(item as any).avatar} />}
                            >
                                <div className="brandLogo-container">
                                    <img className="brandLogo" src={(item as any).FK_products_brands.brandLogo} alt="" />
                                </div>
                                <div className="bestSeller-mark">
                                    <p className="bestSeller-text">Best Seller</p>
                                </div>
                                <Meta title={(item as any).productName} description={
                                    <div className="card-description">
                                        <p>{`Giá: ${(item as any).price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}`}</p><br />
                                        <p>{`Thương hiệu: ${(item as any).FK_products_brands.brandName}`}</p><br />
                                        <p>{`Xuất xứ: ${(item as any).FK_products_madeBy.country}`}</p><br />
                                        <p>{`Chất liệu: ${(item as any).FK_products_material.material}`}</p><br />
                                    </div>
                                } />
                                <button className="addCart-btn" onClick={() => { addToCart((item as any).id) }}>Thêm vào giỏ</button>
                            </Card>
                        </div>
                    ))
                    }
                </div>
            </div>
        </section>
    )
}
