import { Button, Card, Flex, Input, Pagination, PaginationProps, Select, message } from 'antd'
import './products.scss'
import { useEffect, useState } from 'react'
import { apis } from '@/service/apis'
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;
export default function Products() {
    const navigate = useNavigate()
    const [renderProductList, setRenderProductList] = useState<Array<any>>([])
    const [categoriesList, setCategoriesList] = useState<Array<any>>([])
    const [materialList, setMaterialList] = useState<Array<any>>([])
    const [madeByList, setMadeByList] = useState<Array<any>>([])
    const [brandsList, setBrandsList] = useState<Array<any>>([])

    const [categoriesOption, setCategoriesOption] = useState<Array<{ value: number | null, label: string }>>([])
    const [materialOption, setMaterialOption] = useState<Array<{ value: number | null, label: string }>>([])
    const [brandsOption, setBrandsOption] = useState<Array<{ value: number | null, label: string }>>([])
    const [madeByOption, setMadeByOption] = useState<Array<{ value: number | null, label: string }>>([])


    const [resultCount, setResultCount] = useState<number>(0)
    const pageSize = 10

    const [current, setCurrent] = useState(1);

    const onChange: PaginationProps['onChange'] = (page) => {
        setCurrent(page);
      };
      
    useEffect(() => {
        getPageProductList()
        getSearchSelector(null)
    }, [current])

    const getSearchSelector = async (type: number | null) => {
        try {
            let material;
            let categories;
            let madeBy;
            let brands;
            switch (type) {
                case null:
                    material = await apis.adminProductsApiModule.getProductMaterial()
                    categories = await apis.adminProductsApiModule.getProductCategories()
                    madeBy = await apis.adminProductsApiModule.getProductmadeBy()
                    brands = await apis.adminProductsApiModule.getProductBrand()
                    break;
                case 1:
                    material = await apis.adminProductsApiModule.getProductMaterial()
                    break;
                case 2:
                    categories = await apis.adminProductsApiModule.getProductCategories()
                    break;
                case 3:
                    madeBy = await apis.adminProductsApiModule.getProductmadeBy()
                    break;
                case 4:
                    brands = await apis.adminProductsApiModule.getProductBrand()
                    break;
                default:
                    break;
            }

            setBrandsList(brands?.data.data || [])
            setCategoriesList(categories?.data.data || [])
            setMadeByList(madeBy?.data.data || [])
            setMaterialList(material?.data.data || [])
        } catch (err) {
            console.log(err);

            message.error('lấy dữ liệu thất bại')
        }
    }

    const getPageProductList = async () => {
        try {
            const searchOption = {
                productName: searchName,
                material: searchMaterial,
                madeBy: searchMadeBy,
                category: searchCategory,
                brand: searchBrand,
                currentPage: current,
                pageSize
            }

            const result = await apis.productCliApi.getProductsByOption(searchOption)

            setResultCount(result.data.count)
            setRenderProductList(result.data.data)
        } catch (error) {
            console.log("error", error);

        }
    }

    const clearSearch = () => {
        setSearchName("");
        setSearchMaterial(null);
        setSearchMadeBy(null);
        setSearchCategory(null)
        setSearchBrand(null)
    }
    useEffect(() => {
        let cateOption = categoriesList.map(item => {
            return { value: item.id, label: item.categoryName }
        });
        setCategoriesOption(cateOption);

        let mateOption = materialList.map(item => {
            return { value: item.id, label: item.material }
        });
        setMaterialOption(mateOption);

        let brandOption = brandsList.map(item => {
            return { value: item.id, label: item.brandName }
        });
        setBrandsOption(brandOption)

        let countryOption = madeByList.map(item => {
            return { value: item.id, label: item.country }
        });
        setMadeByOption(countryOption)

    }, [categoriesList, madeByList, materialList, brandsList])

    const boxStyle: React.CSSProperties = {
        width: '100%',
        height: 50,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 6,
        border: '1px solid #40a9ff',
        backgroundColor: '#FFFFFF'
    };
    const [searchName, setSearchName] = useState<string>("")
    const [searchMaterial, setSearchMaterial] = useState<number | null>(null)
    const handleMaterialSelector = (value: number | null) => {
        setSearchMaterial(value)
    }

    const [searchMadeBy, setSearchMadeBy] = useState<number | null>(null)
    const handleMadeBySelector = (value: number | null) => {
        setSearchMadeBy(value)
    };

    const [searchCategory, setSearchCategory] = useState<number | null>(null)
    const handleCategoryChange = (value: number | null) => {
        setSearchCategory(value)
    };

    const [searchBrand, setSearchBrand] = useState<number | null>(null)
    const handleBrandChange = (value: number | null) => {
        setSearchBrand(value)
    };
    return (
        <div className='page-container'>
            <div className='page-title'>
                <h2>Sản phẩm xe đạp</h2>
            </div>
            <div className='searchBar-container'>
                <Flex gap="middle" align="start" vertical>
                    <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
                        <span style={{fontSize:"14px"}}>Kết quả : {resultCount} sản phẩm</span>
                        <Input style={{ width: 120 }} value={searchName} size="small" type="text" placeholder="Tên sản phẩm" onChange={(e) => { setSearchName(e.target.value) }} />
                        <Select
                            value={searchMaterial}
                            style={{ width: 140, height: 25 }}
                            onChange={handleMaterialSelector}
                            size="small"
                            options={[{ value: null, label: "Chọn chất liệu" }, ...materialOption]}
                        />
                        <Select
                            value={searchMadeBy}
                            style={{ width: 140, height: 25 }}
                            onChange={handleMadeBySelector}
                            size="small"
                            options={[{ value: null, label: "Chọn xuất xứ" }, ...madeByOption]}
                        />
                        <Select
                            value={searchBrand}
                            style={{ width: 140, height: 25 }}
                            onChange={handleBrandChange}
                            size="small"
                            options={[{ value: null, label: "Chọn nhãn hiệu" }, ...brandsOption]}
                        />
                        <Select
                            value={searchCategory}
                            style={{ width: 140, height: 25 }}
                            onChange={handleCategoryChange}
                            size="small"
                            options={[{ value: null, label: "Chọn thể loại" }, ...categoriesOption]}
                        />
                        <Button danger size={"small"} onClick={() => { getPageProductList() }}>
                            Tìm kiếm
                        </Button>
                        <Button type="default" size={"small"} onClick={() => { clearSearch() }}>
                            Làm mới
                        </Button>
                    </Flex>
                </Flex>
            </div>
            <div className='productsDisplay-container'>
                {renderProductList?.map(item => (
                    <div onClick={() => { navigate(`/product?id=${(item as any).id}`) }}>
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
                                <p className="bestSeller-text" style={{lineHeight: "0px",margin:'0px'}}>Best Seller</p>
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
                            <button className="addCart-btn">Thêm vào giỏ</button>
                        </Card>
                    </div>
                ))}
            </div>
            <Pagination defaultCurrent={current} total={resultCount} onChange={onChange} />
        </div>
    )
}
