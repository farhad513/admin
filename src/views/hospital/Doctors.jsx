import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { get_doctors, delete_doctor } from "../../store/Reducers/doctorReducer";
import { TbCurrencyTaka } from "react-icons/tb";
import toast from "react-hot-toast";
import SeoHelmet from "../components/SEO";

// Image fallback
const handleImageError = (e) => {
  e.target.src = "/default-doctor.png";
};

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, totalDoctor, loading } = useSelector(
    (state) => state.doctor
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  // Fetch doctors
  useEffect(() => {
    dispatch(
      get_doctors({
        parPage: Number(parPage),
        page: Number(currentPage),
        searchValue,
      })
    );
  }, [dispatch, parPage, currentPage, searchValue]);

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিত ডিলিট করতে চান?");
    if (confirmDelete) {
      const res = await dispatch(delete_doctor(id));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("ডাক্তার ডিলিট করা হয়েছে!");
        // রিফ্রেশ doctor list
        dispatch(
          get_doctors({
            parPage: Number(parPage),
            page: Number(currentPage),
            searchValue,
          })
        );
      } else {
        toast.error("ডিলিট করতে সমস্যা হয়েছে।");
      }
    }
  };
  const toBanglaNumber = (number) => {
    const engToBangla = {
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
      .map((digit) => engToBangla[digit] || digit)
      .join("");
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="সকল ডাক্তার | Medi Fast Health Care"
        description="Medi Fast Health Care-এ সকল বিশেষজ্ঞ ডাক্তারদের তালিকা দেখুন। অভিজ্ঞতা, বিভাগ, যোগ্যতা এবং প্রোফাইল তথ্য অনুযায়ী ডাক্তার খুঁজে নিন ও সহজেই অ্যাপয়েন্টমেন্ট বুক করুন।"
        keywords="সকল ডাক্তার, ডাক্তার তালিকা, ডাক্তার খুঁজুন, বিশেষজ্ঞ ডাক্তার, Medi Fast Health Care, হাসপাতাল ডাক্তার, অ্যাপয়েন্টমেন্ট"
        url="https://medifasthealthcare.com/hospital/doctors"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        {/* সার্চ */}
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          setCurrentPage={setCurrentPage}
        />

        {/* ডাক্তার টেবিল */}
        <div className="relative overflow-x-auto mt-5">
          {loading ? (
            <div className="text-center py-5 text-gray-400">লোড হচ্ছে...</div>
          ) : (
            <table className="w-full text-sm text-left text-[#000]">
              <thead className="text-sm uppercase border-b border-slate-700">
                <tr className="text-center">
                  <th className="py-3 px-4">নং</th>
                  <th className="py-3 px-4">ছবি</th>
                  <th className="py-3 px-4">নাম</th>
                  <th className="py-3 px-4">স্পেশালিটি</th>
                  <th className="py-3 px-4">ফি</th>
                  <th className="py-3 px-4 ">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {doctors?.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <tr key={doctor._id} className="text-center">
                      <td className="py-1 px-4">
                        {toBanglaNumber(
                          (currentPage - 1) * parPage + index + 1
                        )}
                      </td>
                      <td className="py-1 px-4">
                        <div className="flex justify-center">
                          <img
                            className="w-[45px] h-[45px] rounded-md object-cover"
                            src={doctor.image?.url}
                            alt={doctor.name}
                            onError={handleImageError}
                          />
                        </div>
                      </td>
                      <td className="py-1 px-4">{doctor.name}</td>
                      <td className="py-1 px-4">{doctor.category}</td>
                      <td className="py-1 px-4">
                        <div className="flex justify-center items-center">
                          <TbCurrencyTaka size={18} />
                          <span className="ml-1">{doctor.fee}</span>
                        </div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="flex justify-center items-center gap-4 ">
                          <Link
                            to={`/hospital/dashboard/edit-doctor/${doctor._id}`}
                            className="p-[6px] text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="p-[6px] text-white bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      কোনো ডাক্তার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalDoctor > parPage && (
          <div className="flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalDoctor}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
