import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { get_hospital_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";
import moment from "moment";
import { BsCalendarCheckFill } from "react-icons/bs";
import { FaEye, FaUserMd } from "react-icons/fa";
import Loading from "../components/Loading";
import SeoHelmet from "../components/SEO";

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
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

// বাংলা মাস এবং AM/PM ম্যাপিং
const enToBnMonth = (enMonth) => {
  const months = {
    January: "জানুয়ারি",
    February: "ফেব্রুয়ারি",
    March: "মার্চ",
    April: "এপ্রিল",
    May: "মে",
    June: "জুন",
    July: "জুলাই",
    August: "আগস্ট",
    September: "সেপ্টেম্বর",
    October: "অক্টোবর",
    November: "নভেম্বর",
    December: "ডিসেম্বর",
    AM: "এএম",
    PM: "পিএম",
  };
  return months[enMonth] || enMonth;
};

// বাংলা তারিখ ফরম্যাটিং
const formatDateToBangla = (date) => {
  const formatted = moment(date).format("DD MMMM YYYY, h:mm A");
  const parts = formatted.split(/[\s,]+/);
  const day = convertToBanglaNumber(parts[0]);
  const month = enToBnMonth(parts[1]);
  const year = convertToBanglaNumber(parts[2]);
  const time = convertToBanglaNumber(parts[3]);
  const meridian = enToBnMonth(parts[4]);
  return `${day} ${month} ${year}, ${time} ${meridian}`;
};

// Appointment এর status বাংলা ম্যাপিং
const statusBanglaMap = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  cancelled: "বাতিল",
};

const HospitalDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalDoctor,
    totalAppoinment,
    completeAppoinment,
    totalPendingAppoinment,
    recentAppoinments,
    loading,
  } = useSelector((state) => state.dashboardIndex);
  useEffect(() => {
    dispatch(get_hospital_dashboard_index_data());

    const interval = setInterval(() => {
      dispatch(get_hospital_dashboard_index_data());
    }, 111000);

    return () => clearInterval(interval);
  }, [dispatch]);
  if (!loading) {
    <Loading />;
  }
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
  // সাম্প্রতিক অ্যাপয়েন্টমেন্ট টেবিলের ডেটা প্রসেস করা
  const renderedAppointments = useMemo(() => {
    return recentAppoinments.map((d) => {
      const formattedDate = formatDateToBangla(d.createdAt);
      const formatName = (fullName) => {
        if (!fullName) return "নাম নেই";
        const parts = fullName.split(" ");
        return parts.slice(0, 2).join(" ");
      };
      return (
        <tr className="text-center" key={d._id}>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            #{d._id.toUpperCase()}
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            {formatName(d?.appoinmentId?.patientName)}
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            {d?.doctorId?.name || "ডাক্তার নাম নেই"}
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            {d?.doctorId?.category.split(" ").slice(0, 2).join(" ") ||
              "নির্ধারিত না"}
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            {d.appoinmentId.appointmentDate
              ? formatBanglaDate(d.appoinmentId.appointmentDate)
              : ""}
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap">
            <span>{statusBanglaMap[d.status] || "অজানা"}</span>
          </td>
          <td className="py-3 px-4 font-medium whitespace-nowrap text-center ps-8">
            <Link
              to={`/hospital/dashboard/appoinment/details/${d._id}`}
              className="p-[6px] w-[30px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
            >
              <FaEye />
            </Link>
          </td>
        </tr>
      );
    });
  }, [recentAppoinments]);

  return (
    <div className="px-2 md:px-7 py-5">
      <SeoHelmet
        title="হাসপাতাল ড্যাশবোর্ড | Medi Fast Health Care"
        description="আপনার হাসপাতাল ড্যাশবোর্ড থেকে ডাক্তার ম্যানেজমেন্ট, অ্যাপয়েন্টমেন্ট, অ্যাম্বুলেন্স, ইনভেন্টরি, বিলিং ও রিপোর্টিং সহজেই পরিচালনা করুন। নিরাপদ ও দ্রুত ব্যবস্থাপনায় Medi Fast Health Care আপনার সাথেই আছে।"
        keywords="হাসপাতাল ড্যাশবোর্ড, ডাক্তার ম্যানেজমেন্ট, অ্যাপয়েন্টমেন্ট, অ্যাম্বুলেন্স ম্যানেজমেন্ট, ইনভেন্টরি, বিলিং, রিপোর্ট"
        url="https://medifasthealthcare.com/hospital/dashboard"
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <DashboardCard
          title="ডাক্তার"
          value={totalDoctor}
          icon={<FaUserMd className="text-[#28c76f] shadow-lg" />}
          iconBg="bg-[#e000e808]"
        />
        <DashboardCard
          title="সম্পন্ন অ্যাপয়েন্টমেন্ট"
          value={completeAppoinment}
          icon={<BsCalendarCheckFill className="text-[#28c76f] shadow-lg" />}
          iconBg="bg-[#28c76f1f]"
        />
        <DashboardCard
          title="মোট অ্যাপয়েন্টমেন্ট"
          value={totalAppoinment}
          icon={<BsCalendarCheckFill className="text-[#00cfe8] shadow-lg" />}
          iconBg="bg-[#00cfe81f]"
        />
        <DashboardCard
          title="পেন্ডিং অ্যাপয়েন্টমেন্ট"
          value={totalPendingAppoinment}
          icon={<BsCalendarCheckFill className="text-[#7367f0] shadow-lg" />}
          iconBg="bg-[#7367f01f]"
        />
      </div>

      <div className="w-full p-4 bg-[#fff] rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#000] pb-3">
            সাম্প্রতিক অ্যাপয়েন্টমেন্ট
          </h2>
          <Link
            to="/hospital/dashboard/appoinments"
            className="font-semibold text-sm text-[#000]"
          >
            সব দেখুন
          </Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-sm text-[#000] uppercase border-b border-slate-700 text-center">
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
              {recentAppoinments.length > 0 ? (
                renderedAppointments
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-lg text-[#000]"
                  >
                    কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card কম্পোনেন্ট
const DashboardCard = ({ title, value, icon, iconBg }) => (
  <div className="flex justify-between items-center p-5 bg-[#fff] rounded-md gap-3">
    <div className="flex flex-col justify-start items-start text-[#000]">
      <h2 className="text-3xl font-bold">{convertToBanglaNumber(value)}</h2>
      <span className="text-md font-medium">{title}</span>
    </div>
    <div
      className={`w-[46px] h-[47px] rounded-full ${iconBg} flex justify-center items-center text-xl`}
    >
      {icon}
    </div>
  </div>
);

export default HospitalDashboard;
