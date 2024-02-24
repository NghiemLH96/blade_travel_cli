import './scss/footer.scss'
export default function Footer() {
  return (
    <section className='footer_container'>
      <div className='footer_top'>
        <div className='footer_list'>
          <span>Giới thiệu về Blade</span>
          <ul>
            <li>Về chúng tôi</li>
            <li>Tài nguyên và chính sách</li>
            <li>Liên hệ với chúng tôi</li>
          </ul>
        </div>
        <div className='footer_list'>
          <span>Đối tác</span>
          <ul>
            <li>Đăng ký nhà cung cấp</li>
            <li>Đối tác đăng nhập</li>
            <li>Đối tác liên kết</li>
            <li>Chương trình cho đại lý</li>
          </ul>
        </div>
        <div className='footer_list'>
          <span>Liên hệ</span>
          <p>Địa chỉ : tầng 3 toà nhà ASC , đường Lê Trung Nghĩa , phường ??? , quận Tân Bình , thành phố Hồ Chí Minh</p>
          <p>Số điện thoại : 0767552364</p>
        </div>
        <div className='footer_subcribe'>
          <input type="text" placeholder='example@gmail.com'/>
          <button>Subcribe</button>
        </div>
      </div>
      <div className='footer_bottom'>
        <div className='footer_social'>
          <i className="fa fa-instagram social_icon"></i>
          <i className="fa fa-facebook-official social_icon"></i>
          <i className="fa fa-youtube social_icon"></i>
        </div>
        <p>© 2024 BladeTravel, Inc.</p>
      </div>
    </section>
  )
}
