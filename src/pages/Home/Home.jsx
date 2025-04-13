import React from 'react';
import Banner from '../../components/Banner/Banner';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import RecentListings from '../../components/RecentListings/RecentListings';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Comparison from '../../components/Comparison/Comparison';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WhyChooseUs></WhyChooseUs>
            <RecentListings></RecentListings>
            <HowItWorks></HowItWorks>
            <Comparison></Comparison>
        </div>
    );
};

export default Home;