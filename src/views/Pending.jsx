import React from "react";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import SeoHelmet from "./components/SEO";

const Pending = () => {
  return (
    <>
      <SeoHelmet
        title="অ্যাকাউন্ট পেন্ডিং | হাসপাতাল প্রোফাইল আপডেট করুন"
        description="আপনার হাসপাতাল প্রোফাইল বর্তমানে পেন্ডিং অবস্থায় রয়েছে। দ্রুত তথ্য আপডেট করে একাউন্ট অ্যাক্টিভ করুন।"
        keywords="হাসপাতাল একাউন্ট পেন্ডিং, প্রোফাইল আপডেট, হাসপাতাল একাউন্ট এক্টিভেশন"
        url="https://medifasthealthcare.com/hospital/dashboard/pending"
      />

      <div className="min-h-screen bg-gradient-to-br bg-[#f1f1f1] flex justify-center items-center px-6 py-12">
        <div className="bg-[#fff] p-8 rounded-xl text-[#000] shadow-2xl border border-slate-700 max-w-xl w-full animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <FaInfoCircle className="text-yellow-400 text-3xl" />
            <h2 className="text-3xl font-extrabold text-[#000]">
              অ্যাকাউন্ট স্থিতি: <span className="text-yellow-400">পেন্ডিং</span>
            </h2>
          </div>

          <p className="mb-4 leading-relaxed text-base">
            আপনার হাসপাতাল প্রোফাইলটি বর্তমানে{" "}
            <span className="text-yellow-400 font-semibold">পেন্ডিং</span>{" "}
            অবস্থায় আছে। দয়া করে নিচের বাটনে ক্লিক করে আপনার প্রয়োজনীয় সকল তথ্য দিন এবং একাউন্ট অ্যাক্টিভ করুন।
          </p>

          <p className="mb-6 leading-relaxed text-base">
            অ্যাডমিন আপনার প্রোফাইল রিভিউ করে এক্টিভ করবে। প্রয়োজনীয় তথ্য না দিলে একাউন্ট এক্টিভ হবে না।
          </p>

          <div className="flex gap-3">
            <Link
              to={"/hospital/dashboard/profile"}
              className="bg-[#0b7ec1] hover:bg-blue-700 transition-all duration-300 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-blue-500/30"
            >
              তথ্য আপডেট করুন
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-600 pt-4 text-sm text-slate-400">
            <p>
              আপনার সকল তথ্য যাচাই করার জন্য আমাদের সাপোর্ট টিম ২৪ ঘণ্টার মধ্যে
              যোগাযোগ করবে। প্রয়োজনে ইমেইল ও ফোন কলের মাধ্যমে জানানো হবে।
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pending;
