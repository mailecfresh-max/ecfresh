import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import { Banner } from '../../types';

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  const activeBanners = banners.filter(banner => banner.isActive);

  if (activeBanners.length === 0) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to ECFresh</h2>
          <p className="text-green-100">Fresh vegetables delivered to your doorstep</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
          bulletActiveClass: '!bg-white'
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        loop={activeBanners.length > 1}
        className="rounded-2xl overflow-hidden"
      >
        {activeBanners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-full aspect-video bg-gradient-to-br from-green-400 to-green-600"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p className="text-white/90">Fresh & Ready to Cook</p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;