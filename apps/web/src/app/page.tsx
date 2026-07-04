import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServiceCategories from '../components/home/ServiceCategories';
import PopularServices from '../components/home/PopularServices';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import LiveStatistics from '../components/home/LiveStatistics';
import RecentOrders from '../components/home/RecentOrders';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <HeroSection />
      <ServiceCategories />
      <PopularServices />
      <WhyChooseUs />
      <LiveStatistics />
      <RecentOrders />
      <CustomerReviews />
      <FAQSection />
    </div>
  );
}
