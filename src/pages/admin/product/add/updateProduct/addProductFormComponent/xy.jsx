import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './HeroSection.css'
import MainSearch from './MainSearch'

const HeroSection = () => {
   const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const popularTags = [
    { label: 'Affordable Motorcycles', url: '#' },
    { label: 'Smart Electronics', url: '#' },
    { label: 'Trendy Fashion', url: '#' },
    { label: 'Kitchen Essentials', url: '#' },
    { label: 'Fitness Gear', url: '#' },
    { label: 'Portable Tools', url: '#' },
  ];

  return (
    <div className="biz-banner en-layout " style={{marginTop:"%"}} >
      <img
        // src="https://www.micstatic.com/landing/business/assets/banner.webp"
        src={isSmallScreen ? '/ecommerce-1.jpg' : '/ecommerce.jpg'}
        alt="Business Banner"
        className="biz-banner-img"
        loading="eager"
      />
      <div className="biz-body">
        <div className="biz-banner-content mt-8">
          {/* <h1 className="en-title text-white">SHOP SMART, LIVE BETTER</h1> */}
          <h1 className="en-title text-white md:text-[4rem] text-[2rem]">Pakistan's <br/> E-commerce Hub</h1>

          <h2>Smart Shopping, Endless Opportunities</h2>



          <div className="biz-banner-entrace">
            <div className="w-full max-w-2xl mb-6 px-4 sm:px-0">
              <MainSearch />
            </div>

            {/* Sign Up for Free Button */}
            <Link
  to="/customer/auth/sign-up"
  className="inline-flex items-center bg-primary-500 h-12 ml-5 hover:bg-white hover:border-primary-500 text-white hover:text-primary-500 font-medium text-lg px-4 py-2 rounded-full shadow-md transition-all ease-in-out gap-4"
>
  <span>Sign Up for Free</span>
  <FaArrowRight />
</Link>

          </div>

          {/* <div className="biz-banner-popular">
            <span className="biz-banner-popular-label">Trending now:</span>
            <div className="popular-tags">
              {popularTags.map((tag, index) => (
                <a
                  key={index}
                  href={tag.url}
                  className="popular-tag"
                  rel="nofollow"
                >
                  {tag.label}
                </a>
              ))}
            </div>
          </div> */}
                </div>
            </div>
        </div>
    )
}

export default HeroSection



@media all {
    .biz-banner {
        padding-top: 2.2rem;
        width: 100%;
        height: 80vh !important;
        background-repeat: no-repeat;
        background-position: center 2.2rem;
        background-size: auto calc(100% - 2.2rem);
        background-color: #24221e;
        position: relative;
        z-index: 1;
    }

    .biz-banner .biz-banner-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: fill;
        z-index: -1;
    }

    .biz-banner-content {
        padding: 40px 40px 38px;
    }

    .biz-banner h1 {
        margin: 0;
        line-height: 1.2;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.02em;
    }

    .biz-banner h2 {
        color: #fff;
        margin-top: 8px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        text-shadow: 1px 1px 7.5px rgba(0, 0, 0, 0.15);
    }

    .biz-banner-entrace {
        position: relative;
        margin-top: 40px;
    }

    .ft-btn-primary {
        color: #fff;
    }

    .ft-icon {
        font-family: ft-icon;
        font-weight: 400;
        font-size: 24px;
        line-height: 1.5;
    }

    .biz-banner-search-group.ft-input-group {
        width: 505px;
        display: flex;
        border-radius: 100px 0 0 100px;
        background: 0 0;
        overflow: hidden;
    }
}

@media only screen and (min-width: 1024px) {
    .biz-banner {
        padding-top: 72px;
        height: 600px;
        background-position: center top;
        background-size: auto 100%;
    }

    .biz-banner-content {
        padding: 40px 20px 0;
    }

    .biz-banner h2 {
        margin-top: 10px;
        font-weight: 300;
        text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.15);
    }

    .biz-banner-entrace {
        display: flex;
    }

    .biz-banner-popular {
        width: 718px;
        display: flex;
        margin-top: 30px;
    }

    .biz-banner-search-group.ft-input-group {
        width: 578px;
    }

    .biz-banner-search-btn {
        padding: 15px 30px 15px 25px;
    }
}

@media only screen and (min-width: 1280px) {
    .biz-banner {
        height: 620px;
    }

    .biz-banner h2 {
        font-size: 44px;
    }

    .biz-banner-popular {
        width: 844px;
    }

    .biz-banner-search-group.ft-input-group {
        width: 704px;
    }
}

@media only screen and (min-width: 1366px) {
    .biz-banner {
        height: 680px;
    }

    .biz-banner h2 {
        font-size: 48px;
    }

    .biz-banner-popular {
        width: 898px;
    }

    .biz-banner-search-group.ft-input-group {
        width: 758px;
    }
}

@media only screen and (max-width: 1023px) {
    .biz-banner {
        padding-top: 50px;
        height: 300px;
    }

    .biz-banner h1 {
        font-size: 36px;
        text-align: center;
    }

    .biz-banner h2 {
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
    }

    .biz-banner-entrace {
        padding: 0 20px;
        text-align: center;
    }

    .biz-banner-popular {
        display: none;
    }

    .biz-banner-search-group.ft-input-group {
        width: 100%;
        border-radius: 50px;
    }

    .biz-banner-entrace .join-free-btn.ft-btn:hover {
        background-color: rgba(0, 0, 0, 0.7);
        color: #ccc;
    }
}
