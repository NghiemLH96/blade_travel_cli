import { apis } from '@/service/apis';
import { Carousel } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const contentStyle: React.CSSProperties = {
    height:'700px',
    objectFit:'cover',
    width:'100vw',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    position: 'relative',
    cursor:'pointer',
    objectPosition:'0px 0px'
  };

export default function Carousel1() {
    useEffect(()=>{
        getCatList()
    },[])
    const [ catList , setCatList ] = useState([])
    const getCatList = async() => {
        try {
            const result = await apis.adminProductsApiModule.getProductCategories()
            if (result.status ==200) {
                setCatList(result.data.data)
            }else{
                setCatList([])
            }
        } catch (error) {
            setCatList([])
        }
    }
    const navigate = useNavigate()
  return (
    <div className='carousel_container'>
        <Carousel autoplay>
            {catList?.map(item => (
                <div key={Math.random()*Date.now()} onClick={()=>{navigate(`/products?category=${(item as any).id}`)}}>
                    <img style={contentStyle} src={(item as any).avatar} alt=""/>
                </div>
            ))}
        </Carousel> 
    </div>
  )
}
