import { apis } from "@/service/apis";
import { Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

export default function BestSeller() {
    useEffect(() => {
        getProducts()
    }, [])
    const [bestSellerList, setBestSellerList] = useState([])
    useEffect(()=>{
        console.log("catList",bestSellerList);
    },[bestSellerList])
    
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

    const navigate = useNavigate()
    return (
        <section className='banner_container bestSeller'>
            <h3 className='banner_title'>Sản phẩm bán chạy</h3>
            <div className="bestSeller-display">
                <div className="bestSeller-slideList" id="bestSeller-slideList">
                    {bestSellerList.map(item => (
                        <div key={Math.random() * Date.now()} className="bestSeller_slide" onClick={() => { navigate(`/product?id=${(item as any).id}`) }}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
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
                                        <p>{`Giá: ${(item as any).price}`}</p><br />
                                        <p>{`Thương hiệu: ${(item as any).FK_products_brands.brandName}`}</p><br />
                                        <p>{`Xuất xứ: ${(item as any).FK_products_madeBy.country}`}</p><br />
                                        <p>{`Chất liệu: ${(item as any).FK_products_material.material}`}</p><br />
                                    </div>
                                } />
                                <button className="addCart-btn">Thêm vào giỏ</button>
                            </Card>
                        </div>
                    ))
                    }
                </div>
            </div>
        </section>
    )
}
