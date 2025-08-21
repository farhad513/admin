import React, { useState, useEffect, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import { get_admin_appoinments } from "../../store/Reducers/AppoinmentReducer";
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

// তারিখ ও সময় → বাংলা ফরম্যাট
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
  const { totalAppoinments, myAppoinments } = useSelector(
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
        get_admin_appoinments({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
        })
      );
    }
  }, [dispatch, parPage, currentPage, searchValue, userInfo]);

  const renderedAppoinments = useMemo(() => {
    return myAppoinments.map((item, index) => (
      <tr key={item._id} className="text-center wrapper">
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          #{item._id.toUpperCase()}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item?.userId?.name
            ? item?.userId?.name.split(" ").slice(0, 2).join(" ")
            : "নাম নেই"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item?.userId?.phone}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item?.patientName
            ? item.patientName.split(" ").slice(0, 2).join(" ")
            : "নাম নেই"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.phone || "ডাক্তার নেই"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.doctorId?.name.split(" ").slice(0, 2).join(" ") ||
            "ডাক্তার নেই"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.hospitalId?.name || "হাসপাতাল নেই"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.doctorId?.category.split(" ").slice(0, 2).join(" ") ||
            "নির্ধারিত নয়"}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {item.appointmentDate ? formatBanglaDate(item.appointmentDate) : ""}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap">
          {convertStatusToBangla(item.status)}
        </td>
        <td className="py-3 px-4 font-medium whitespace-nowrap ps-5 text-center">
          {item.status === "confirmed"
            ? convertToBanglaNumber(item.serial || "নাই")
            : "—"}
        </td>
      </tr>
    ));
  }, [myAppoinments]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="অ্যাডমিন অ্যাপয়েন্টমেন্টস | Medi Fast Health Care"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সকল রোগীর অ্যাপয়েন্টমেন্ট তালিকা দেখুন, স্ট্যাটাস আপডেট করুন এবং দ্রুত সেবা ব্যবস্থাপনা নিশ্চিত করুন।"
        keywords="অ্যাডমিন অ্যাপয়েন্টমেন্ট, অ্যাপয়েন্টমেন্ট ম্যানেজমেন্ট, Medi Fast Health Care, ডাক্তার অ্যাপয়েন্টমেন্ট, হাসপাতাল অ্যাপয়েন্টমেন্ট"
      />
      <div className="mb-5 flex flex-col md:flex-row md:justify-between gap-3">
        <div className="bg-[#f0f4f8] p-4 rounded-md shadow-md flex-1 flex items-center justify-center">
          <span className="text-lg font-medium">
            মোট অ্যাপয়েন্টমেন্ট:{" "}
            <span className="text-blue-600">
              {convertToBanglaNumber(totalAppoinments || 0)}
            </span>
          </span>
        </div>
      </div>

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto pt-5">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-sm text-[#000] uppercase border-b border-slate-700 text-center whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">
                  অ্যাপয়েন্টমেন্ট আইডি
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  ব্যবহারকারীর নাম
                </th>
                <th className="py-3 px-4 whitespace-nowrap">ফোন নাম্বার</th>
                <th className="py-3 px-4 whitespace-nowrap">রোগীর নাম</th>
                <th className="py-3 px-4 whitespace-nowrap">
                  {" "}
                  অ্যাপয়েন্টমেন্ট নাম্বার
                </th>
                <th className="py-3 px-4  whitespace-nowrap">ডাক্তার নাম</th>
                <th className="py-3 px-4 whitespace-nowrap">হাসপাতালের নাম</th>

                <th className="py-3 px-4 whitespace-nowrap">ক্যাটাগরি</th>
                <th className="py-3 px-4 whitespace-nowrap">তারিখ ও সময়</th>
                <th className="py-3 px-4 whitespace-nowrap">অবস্থা</th>
                <th className="py-3 px-4 whitespace-nowrap">সিরিয়াল</th>
              </tr>
            </thead>
            <tbody>
              {myAppoinments.length > 0 ? (
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
