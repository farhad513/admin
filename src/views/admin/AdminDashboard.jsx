import React, { useEffect, useMemo } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import {
  FaHospital,
  FaUsers,
  FaStethoscope,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import Chart from "react-apexcharts";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import seller from "../../assets/seller.png";

import { get_admin_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";
import SeoHelmet from "../components/SEO";
import AllUsers from "./AllUsers";

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    totalDoctor,
    totalAppoinment,
    totalHospital,
    recentAppoinments,
    totalUser,
    loading,
  } = useSelector((state) => state.dashboardIndex);
  console.log(recentAppoinments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_admin_dashboard_index_data());
  }, []);

  const convertToBengaliNumber = (number) => {
    const engToBn = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };
    return String(number)
      .split("")
      .map((char) => engToBn[char] || char)
      .join("");
  };
  return (
    <div className="px-2 md:px-7 py-5">
      <SeoHelmet
        title="অ্যাডমিন ড্যাশবোর্ড | Medi Fast Health Care"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে হাসপাতাল, ডাক্তার, অ্যাপয়েন্টমেন্ট, অ্যাম্বুলেন্স এবং রিপোর্টিংসহ সকল কার্যক্রম সহজেই ম্যানেজ করুন। দ্রুত, নিরাপদ এবং অপ্টিমাইজড সিস্টেম।"
        keywords="অ্যাডমিন ড্যাশবোর্ড, হাসপাতাল ম্যানেজমেন্ট, ডাক্তার ম্যানেজমেন্ট, অ্যাপয়েন্টমেন্ট, অ্যাম্বুলেন্স, Medi Fast Health Care"
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="flex justify-between items-center p-5 bg-[#fff] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#000]">
            <h2 className="text-3xl font-bold">
              {convertToBengaliNumber(totalHospital)}
            </h2>
            <span className="text-md font-medium">মোট হাসপাতাল </span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <FaHospital className="text-[#7367f0] text-2xl shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#fff] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#000]">
            <h2 className="text-3xl font-bold">
              {convertToBengaliNumber(totalDoctor)}
            </h2>
            <span className="text-md font-medium">মোট ডাক্তার </span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <FaStethoscope className="text-[#cd00e8] shadow-lg text-[24px]" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#fff] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#000]">
            <h2 className="text-3xl font-bold">
              {convertToBengaliNumber(totalAppoinment)}
            </h2>
            <span className="text-md font-medium">মোট অ্যাপয়েন্টমেন্ট </span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <FaRegCalendarCheck className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#fff] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#000]">
            <h2 className="text-3xl font-bold">
              {convertToBengaliNumber(totalUser)}
            </h2>
            <span className="text-md font-medium">নিবন্ধিত ব্যবহারকারী</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#7367f01f] flex justify-center items-center text-xl">
            <AiOutlineUser className="text-[#7367f0] shadow-lg text-[24px]" />
          </div>
        </div>
      </div>
      <AllUsers/>
    </div>
  );
};

export default AdminDashboard;
