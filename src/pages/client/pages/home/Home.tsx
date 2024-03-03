
import { useEffect, useState } from 'react'
import './home.scss'
import { apis } from '@/service/apis'
export default function Home() {
  //get Api
  useEffect(()=>{
    getBrandList()
  },[])

  const [brandList , setBrandList] = useState([])

  const getBrandList = async () => {
    try {
      const result = await apis.adminProductsApiModule.getProductBrand()
      console.log(result);
      
      if (result.status == 200) {
        setBrandList(result.data.data)
      }
    } catch (error) {
      
    }
  }
  return (
    <div className='home_container'>
      <section className='brandChoices_container'>
          <h3>Khám phá nhãn hiệu</h3>
          <div className='brandChoices_showList'>
            {brandList.map(brand => (
              <div className='brandChoices_button'>
                <img src={(brand as any).avatar} alt="" />
                <p className='brandChoices_name'>{(brand as any).brandName}</p>
              </div>
            ))}
          </div>
      </section>
    </div>
  )
}
