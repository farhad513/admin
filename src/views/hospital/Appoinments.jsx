import React, { useState, useEffect, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import { get_hospital_appoinments } from "../../store/Reducers/AppoinmentReducer";
import SeoHelmet from "../components/SEO";

// ইংরেজি সংখ্যা → বাংলা সংখ্যা রূপান্তর
const convertToBanglaNumber = (number) => {
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
  return number
    .toString()
    .split("")
    .map((digit) => engToBn[digit] || digit)
    .join("");
};

// তারিখ ও সময় → বাংলা ফরম্যাট: "১৮ মে ২০২৫, ৪:৩৬ দুপুর"
// শুধুমাত্র তারিখ → বাংলা ফরম্যাট: "১৮ মে ২০২৫"
const formatBanglaDate = (dateString) => {
  const date = new Date(dateString);

  const day = convertToBanglaNumber(date.getDate());
  const year = convertToBanglaNumber(date.getFullYear());

  const banglaMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const month = banglaMonths[date.getMonth()];

  return `${day} ${month} ${year}`;
};

// Status → বাংলা
const convertStatusToBangla = (status) => {
  const statusMap = {
    pending: "অপেক্ষমাণ",
    confirmed: "নিশ্চিত",
    cancelled: "বাতিল",
  };
  return statusMap[status] || status;
};

const Appoinments = () => {
  const dispatch = useDispatch();
  const { totalAppoinments, myAppoinments, loading } = useSelector(
    (state) => state.appoinment
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  console.log(myAppoinments);
  useEffect(() => {
    if (userInfo?._id) {
      dispatch(
        get_hospital_appoinments({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          hospitalId: userInfo._id,
        })
      );
    }
  }, [dispatch, parPage, currentPage, searchValue, userInfo]);

  const renderedAppoinments = useMemo(() => {
    return myAppoinments.map((item) => (
      <tr key={item._id} className="text-center">
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          #{item._id.toUpperCase()}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.appoinment.patientName
            ? item.appoinment.patientName.split(" ").slice(0, 2).join(" ")
            : "নাম নেই"}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.doctor?.name.split(" ").slice(0, 2).join(" ") || "ডাক্তার নেই"}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.doctor?.category.split(" ").slice(0, 3).join(" ") ||
            "নির্ধারিত নয়"}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.appoinment.appointmentDate
            ? formatBanglaDate(item.appoinment.appointmentDate)
            : ""}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {convertStatusToBangla(item.status)}
        </td>

        <td className="py-3 px-4 font-medium whitespace-nowrap ps-8">
          <Link
            to={`/hospital/dashboard/appoinment/details/${item._id}`}
            className="p-[6px] w-[30px] text-white bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
          >
            <FaEye />
          </Link>
        </td>
      </tr>
    ));
  }, [myAppoinments]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="অ্যাপয়েন্টমেন্ট | Medi Fast Health Care"
        description="Medi Fast Health Care থেকে অনলাইনে সহজেই ডাক্তার অ্যাপয়েন্টমেন্ট বুক করুন। বিশেষজ্ঞ ডাক্তার নির্বাচন করে আপনার সুবিধাজনক তারিখ ও সময় অনুযায়ী সেবা গ্রহণ করুন।"
        keywords="অ্যাপয়েন্টমেন্ট, ডাক্তার অ্যাপয়েন্টমেন্ট, অনলাইন বুকিং, Medi Fast Health Care, ডাক্তার সেবা, হাসপাতাল অ্যাপয়েন্টমেন্ট"
        url="https://medifasthealthcare.com/dashboard/appointments"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto pt-5">
          <table className="w-full text-sm text-left text-[#000] ">
            <thead className="text-sm text-[#000] uppercase border-b border-slate-700 text-center ">
              <tr>
                <th className="py-3 px-4">অ্যাপয়েন্টমেন্ট আইডি</th>
                <th className="py-3 px-4">রোগীর নাম</th>
                <th className="py-3 px-4">ডাক্তার নাম</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">তারিখ ও সময়</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-0">
                    <div className="w-full text-center py-8 text-blue-400 font-semibold flex flex-col items-center justify-center gap-2 min-h-[150px]">
                      <span className="text-3xl animate-spin">🔄</span>
                      <span>লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : myAppoinments.length > 0 ? (
                renderedAppoinments
              ) : (
                <tr>
                  <td colSpan="8" className="p-0">
                    <div className="w-full text-center py-8 text-red-500 font-semibold flex flex-col items-center justify-center gap-2 min-h-[150px]">
                      <span className="text-3xl">😕</span>
                      <span>কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalAppoinments > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalAppoinments}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Appoinments;
