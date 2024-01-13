import { useNavigate } from 'react-router-dom'
import banner1 from '@pics/Banner1.jpg'
import logo from '@pics/logo.png'

export default function Header() {
    const navigate = useNavigate()
    return (
        <header>
            <img className='header_background' src={banner1} alt="" />
            <div className='header_top'>
                <section className='header_top_left'>
                    <img className='logo' src={logo} alt="" />
                </section>
                <section className='header_top_middle'>
                    <div className='nav'>
                        <span>Trang chủ</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Khách Sạn</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Tour</span>
                        <div className='navLine'></div>
                    </div>
                    <div className='nav'>
                        <span>Hỗ trợ</span>
                        <div className='navLine'></div>
                    </div>
                </section>
                <section className='header_top_right'>
                    <div className='languageBtn'>
                        <span className="material-symbols-outlined languageIcon">
                            language
                        </span>
                        <div className='langMenu_dropDown'>
                            <span>Tiếng Việt</span>
                            <span>Tiếng Anh</span>
                            <span>Tiếng Trung</span>
                        </div>
                    </div>
                    <div className='accountMenu'>
                        <div className='accountMenu_btn'>
                            <span className="material-symbols-outlined menuIcon">
                                menu
                            </span>
                            <img className='userAvatar' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAACUCAMAAAC+99ssAAAAOVBMVEV1dXXAwMBycnK9vb3Dw8N/f3+4uLi1tbV7e3tvb2+Dg4OqqqqwsLCMjIx4eHiZmZmjo6OSkpJqamq7vN+tAAAEdElEQVR4nO2c0XKsIAyGJSCKoEDf/2FP8Gx3u2e1K3ETnTn+N+1FZ/pNSAgmgaa5dOnSpUuXDhMUNU3fT0eTvAhg6occY0wh+BGOxvkhcK4Zou+sVkYpY1Q+muhbAK4fU0AwZbTW1mpjz2E69LJ2jB1aC+1VVOhUN5wArqDl1M1gWqu77HQCODdl32lzQ3rQmfB1NBqyxaCNUa8y1h1sO2iSXUSbFQ4NCuizXUMrDmhU7I/iA8jh2dNe8NB8B4Ut9FGtrukP5xvhAD7XBqPtit1+WFDp2MjjZV0Swlvb4Z+YIO18Lm9Y1Rsd4rWieAhXIyOb0vL7JX2WIB4MXSWc5OJitNbSyeFBrMH69gHjRc4EMNQ63Q0vSxjPxfp1nWUl1hZopkMlfjoYiaZD4/FvKy5R4ZSK3HBN48lwJnGzQR/odJ67NABtdZ540IWem66/6Mh0e1a2a89MZ/9zusFedBfdRXfRfYyOfDSWoBsvuovuorvojqfTInRWbSgXL8BpfWLbXXTwtYeu420NQPbUQsVMN7Aar9eGFhMznVKWtRXfbuyhLNLNP5Ljo5voR8+/MpGRDgi9gGdxrqzze+k4i7Nut+1Y6c5tu7STTnP2LFzeSWc5K8c7mhWzTMeayoaddJ5xu8NkoXfhGc5UgcmC3kuZ6ThTBaqqN/tKxzxdsaPIU4KClQ21Zz9mbyDvqpCx9yvweEw/4kn03vXa1Ng70wn0thvwhnh4lzCdi0Q6mamFgfbhY4LMWPmWybYFOgm3Q3WkqDUyg1pAPILKTB8DaZiH+fD0EKmUYrIQ3UTJtSL7SRFhabVin5S50w2rE9rreHJD5SVqq/Y8rZPcDR9o7eoA+QqeyGjgTa7yy5F/AuoZr25HttLT2mnz2uKfSe113yqTblvpmCsAi3hxa9haJZXEHpqS2Wi7U9OhhQ+g82emK1dTTktXcu2p6TbuKPqAqCi9xq22Y67a7aJjrykuKZ+ZrlwBOTFdOYCelQ7A19B9iR4DppwrBntNyIL3yaD1tSU8L3gbj1Cq8Nwj7neRSsdSX4x198lukrmv1RCrPEbgTs9fOkqFjP9OzzcdqQTVyXzRukyrast8NVKnPqwEHYwkNi1TN3bUDq3x7HTgaF28eUSr5X05AKAdidcYy8sCfuz5+ACGGOYhMkLIzjfzdYiDYwkOB6Ont2ZvrzIYZX1uPs0H0JdnbchwP4SAsf/s2xBDUuuvoFTzGfTA9jOAaLbsf3mhhQiIHrifD3eQFPZNyKwJPXDa5YHg+qQ/424LMipkID/dA9MYDLXLvhUwDSQ0aHOJUlqneKPmPTCNtTkEMErJG2+lcIFjTQSXULBs7rbE16V2Yw4BTApKwmjPCuMGPJiGYGSW9K7ZtXGBx98P94Bh6gWX9E53S8I+/3KIgWZk2nnf0D1+wwBZXmD0t6CZt5C3wgCJ/QIf3PxNPByehf/95Xmrsr99ONGTVe5OxZ8lK2hTfaefU+h/D4ebS4WH+ts/0krfd7j5Q2bDi2dywtD8A1glOycxTXjaAAAAAElFTkSuQmCC" alt="" />
                        </div>
                        <div className='accountMenu_dropDown'>
                            <span onClick={()=>{navigate("/register")}}>Đăng ký</span>
                            <span onClick={()=>{navigate("/login")}}>Đăng nhập</span>
                            <span onClick={()=>{navigate("/booking")}}>Đơn Hàng</span>
                            <span onClick={()=>{navigate("/business")}}>Truy cập trang quản lý</span>
                            <span>Thoát</span>
                        </div>
                    </div>
                </section>
            </div>

        </header>
    )
}
