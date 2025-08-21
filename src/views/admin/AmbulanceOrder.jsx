/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { AdminGetAmbulances, messageClear } from "../../store/Reducers/ambulanceReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SEO";

// ইংরেজি থেকে বাংলা নম্বর কনভার্টার
const engToBanglaNumber = (number) => {
  if (number === undefined || number === null) return ""; // check for undefined/null
  const banglaNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number
    .toString()
    .split("")
    .map((char) => (char >= "0" && char <= "9" ? banglaNumbers[char] : char))
    .join("");
};


// বাংলা তারিখ
const formatBanglaDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("bn-BD", options);
};

// ২৪ ঘণ্টা → ১২ ঘণ্টা ফরম্যাট
// ২৪ ঘণ্টা → ১২ ঘণ্টা ফরম্যাট বাংলা টাইম
const formatBanglaTime = (timeString) => {
  if (!timeString) return "";

  let [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  let period = "";

  if (hour === 0) {
    period = "রাত";
    hour = 12;
  } else if (hour < 6) {
    period = "রাত";
  } else if (hour < 12) {
    period = "সকাল";
  } else if (hour === 12) {
    period = "দুপুর";
  } else if (hour < 16) {
    period = "দুপুর";
    hour -= 12;
  } else if (hour < 19) {
    period = "বিকেল";
    hour -= 12;
  } else {
    period = "রাত";
    hour -= 12;
  }

  const bh = engToBanglaNumber(hour.toString());
  const bm = engToBanglaNumber(minute.toString().padStart(2, "0"));
  return `${bh}:${bm} (${period})`;
};


// address থেকে প্রথম ২টি শব্দ
const getFirstTwoWords = (address) => {
  if (!address) return "";
  const words = address.trim().split(/\s+/);
  return words.slice(0, 2).join(" ");
};

// স্ট্যাটাসের জন্য ব্যাজ কালার
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const AmbulanceOrder = () => {
  const dispatch = useDispatch();
  const { ambulances, totalAmbulance, errorMessage, successMessage } = useSelector(
    (state) => state.ambulance
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  const fetchAmbulances = useCallback(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(AdminGetAmbulances(params));
  }, [dispatch, parPage, currentPage, searchValue]);

  useEffect(() => {
    fetchAmbulances();
  }, [fetchAmbulances]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
  title="অ্যাম্বুলেন্স বুকিং / অর্ডার | Medi Fast Health Care"
  description="আপনার Medi Fast Health Care অ্যাকাউন্ট থেকে পূর্ববর্তী এবং চলমান অ্যাম্বুলেন্স বুকিং / অর্ডারের তালিকা দেখুন। সহজেই নতুন অ্যাম্বুলেন্স বুক করুন এবং জরুরি রোগীর জন্য দ্রুত সেবা নিশ্চিত করুন।"
  keywords="অ্যাম্বুলেন্স বুকিং, অ্যাম্বুলেন্স অর্ডার, Medi Fast Health Care, ব্যবহারকারী অ্যাম্বুলেন্স, জরুরি সেবা, হাসপাতাল অ্যাম্বুলেন্স"
/>

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-sm uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">নং</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">ফোন</th>
                <th className="py-3 px-4">পিকআপ তারিখ</th>
                <th className="py-3 px-4">পিকআপ সময়</th>
                <th className="py-3 px-4 max-w-[140px]">পিকআপ ঠিকানা</th>
                <th className="py-3 px-4 max-w-[140px]">ড্রপ ঠিকানা</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">দেখুন</th>
              </tr>
            </thead>
            <tbody>
              {ambulances.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-red-500 py-4">
                    কোনো অ্যাম্বুলেন্স বুকিং পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                ambulances.map((ambulance, index) => (
                  <tr key={ambulance._id} className="hover:bg-[#0b7ec1] hover:text-white">
                    <td className="py-2 px-4">{engToBanglaNumber((currentPage - 1) * parPage + (index + 1))}</td>
                    <td className="py-2 px-4">{ambulance.name}</td>
                    <td className="py-2 px-4">{engToBanglaNumber(ambulance.phone)}</td>
                    <td className="py-2 px-4">{formatBanglaDate(ambulance.pickupDate)}</td>
                    <td className="py-2 px-4">{formatBanglaTime(ambulance.pickupTime)}</td>
                    <td className="py-2 px-4 max-w-[140px] truncate" title={ambulance.pickupAddress}>
                      {getFirstTwoWords(ambulance.pickupAddress)}
                    </td>
                    <td className="py-2 px-4 max-w-[140px] truncate" title={ambulance.dropAddress}>
                      {getFirstTwoWords(ambulance.dropAddress)}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ambulance.status)}`}
                      >
                        {ambulance.status === "pending" && "পেন্ডিং"}
                        {ambulance.status === "confirmed" && "কনফার্মড"}
                        {ambulance.status === "completed" && "কমপ্লিটেড"}
                        {ambulance.status === "cancelled" && "বাতিল"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/dashboard/ambulance/view-ambulance/${ambulance._id}`}
                          className="p-[6px] text-white bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalAmbulance > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalAmbulance}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceOrder;
