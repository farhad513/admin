import React from 'react';
import { FiAlertTriangle, FiPhoneCall } from 'react-icons/fi';

const Deactive = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f1f1] px-5">
      <div className="bg-[#fff] max-w-md w-full p-8 rounded-2xl text-[#000] shadow-lg border border-[#353D55]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 p-3 rounded-full">
            <FiAlertTriangle className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white">অ্যাকাউন্ট নিষ্ক্রিয়</h2>
        </div>

        <p className="text-[#B0B3C2] leading-relaxed mb-6">
          প্রিয় গ্রাহক, আপনার <span className="text-red-400 font-semibold">Medifast Healthcare</span> অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় রয়েছে। 
          অনুগ্রহ করে সরাসরি আমাদের হেল্পলাইন নম্বরে কল করে বিস্তারিত জানুন।
        </p>

        <a
          href="tel:01708769513"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300"
        >
          <FiPhoneCall size={20} /> ০১৭০৮-৭৬৯৫১৩ কল করুন
        </a>
      </div>
    </div>
  );
};

export default Deactive;
