import React from "react";
import { Link } from "react-router-dom";
import { FaBan } from "react-icons/fa";

const UnAuthorized = () => {
  return (
    <div className="flex w-screen h-screen bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#1F2937] flex-col justify-center items-center px-4 text-[#D0D2D6] animate-fadeIn">
      <div className="bg-[#fff] p-8 rounded-xl shadow-2xl border border-slate-700 max-w-lg w-full text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <FaBan className="text-red-500 text-6xl" />
          <h2 className="text-4xl font-bold">অনুমতি নেই!</h2>
          <p className="text-slate-400 text-base">
            দুঃখিত, আপনি এই পেজে প্রবেশের অনুমতি পাননি। অনুগ্রহ করে ড্যাশবোর্ডে ফিরে যান।
          </p>
        </div>

        <Link
          to={"/hospital/dashboard"}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-blue-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ড্যাশবোর্ডে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default UnAuthorized;
