import { Carousel } from "antd"
import { useNavigate } from "react-router-dom"

export default function HeaderCarousel() {
  const navigate = useNavigate()
  return (
    <Carousel autoplay effect="fade">
      <div className='slide_container'>
        <img className='slideImg banner1' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fphoto-1528629297340-d1d466945dc5.avif?alt=media&token=84918ca7-6e27-4ee0-925e-2e2414274b2e" alt="" />
        <div className='bannerSlogan banner1'>
          <h1>Chạm tới tự do</h1>
          <p>Khám phá thế giới trên bánh xe của bạn.</p>
        </div>
        <div className='bannerBtn banner1'>
          <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
        </div>
      </div>
      <div className='slide_container'>
        <img className='slideImg banner2' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fman-riding-mountain-bike-low-angle.jpg?alt=media&token=50994900-4f49-4620-b938-0e12edc9a894" alt="" />
        <div className='bannerSlogan banner2'>
          <h1>Phiêu lưu bất tận</h1>
          <p>Khám phá nhiều hơn, đi xa hơn - cùng với xe đạp của bạn.</p>
        </div>
        <div className='bannerBtn banner2'>
          <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
        </div>
      </div>
      <div className='slide_container'>
        <img className='slideImg banner3' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fyoung-sports-man-bicycle-european-city-sports-urban-environments.jpg?alt=media&token=03071b15-8675-43d6-a127-ff5bebfcf980" alt="" />
        <div className='bannerSlogan banner3'>
          <h1>Sống theo cách riêng</h1>
          <p>Xe đạp không chỉ là phương tiện di chuyển, mà còn là cách sống.</p>
        </div>
        <div className='bannerBtn banner3'>
          <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
        </div>
      </div>
      <div>
        <div className='slide_container'>
          <img className='slideImg banner4' src="https://firebasestorage.googleapis.com/v0/b/blade-firebase.appspot.com/o/assets%2Fkenny-eliason-PSo2G2lkHPQ-unsplash.jpg?alt=media&token=060ba464-d522-4ecc-8f44-102b78a57f15" alt="" />
          <div className='bannerSlogan banner4'>
            <h1>Khơi dậy hành trình</h1>
            <p>Vững bước đi xa từ những vòng bánh đầu tiên.</p>
          </div>
          <div className='bannerBtn banner4'>
            <button onClick={() => { navigate("/products") }}>Khám phá ngay</button>
          </div>
        </div>
      </div>
    </Carousel>
  )
}
