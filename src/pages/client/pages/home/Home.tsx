
import BestSeller from './components/BestSeller'
import BrandChoice from './components/BrandChoice'
import Carousel1 from './components/Carousel1'
import './home.scss'
export default function Home() {

  return (
    <div className='home_container'>
      <BrandChoice/>
      <BestSeller/>
      <Carousel1/>
      <button className='scrollTopBtn' onClick={()=>{window.scrollTo({top:0,behavior:'smooth'})}}>
          <span>Scroll to top</span>
      </button>
    </div>
  )
}
