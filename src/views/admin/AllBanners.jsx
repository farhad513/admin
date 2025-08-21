import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import {
  get_banners,
  messageClear,delete_banner
} from "../../store/Reducers/bannerReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SEO";

// Helper function: ইংরেজি সংখ্যাকে বাংলা সংখ্যায় কনভার্ট করবে
const toBanglaNumber = (number) => {
  const engToBngDigits = {
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
  return number.toString().replace(/\d/g, (digit) => engToBngDigits[digit]);
};

// Helper function: Date string (যেমন "2025-01-19") কে "১৯.০১.২০২৫" ফরম্যাটে রূপান্তর করবে
const formatDateToBangla = (dateStr) => {
  if (!dateStr) return "—";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return "—";

  const day = toBanglaNumber(dateObj.getDate().toString().padStart(2, "0"));
  const month = toBanglaNumber((dateObj.getMonth() + 1).toString().padStart(2, "0"));
  const year = toBanglaNumber(dateObj.getFullYear());

  return `${day}.${month}.${year}`;
};

const AllBanners = () => {
  const dispatch = useDispatch();
  const { banners, totalBanner, errorMessage, successMessage } = useSelector(
    (state) => state.banner
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  // ডেটা লোড ফাংশন
  const fetchBanners = useCallback(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_banners(params));
  }, [dispatch, parPage, currentPage, searchValue]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "তুমি কি এই ব্যানার ডিলিট করতে চাও?"
    );
    if (confirmDelete) {
      await dispatch(delete_banner(id));
      fetchBanners();
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
  title="সকল ব্যানার | Medi Fast Health Care অ্যাডমিন"
  description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সকল ব্যানারের তালিকা দেখুন। হোমপেজ ও অন্যান্য পেজে প্রদর্শিত ব্যানারগুলো সহজেই ম্যানেজ করুন।"
  keywords="সকল ব্যানার, ব্যানার লিস্ট, ব্যানার ম্যানেজমেন্ট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
/>

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-sm uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">নং</th>
                <th className="py-3 px-4">আইডি</th>
                <th className="py-3 px-4">ছবি</th>
                <th className="py-3 px-4">বৈধতা</th>
                <th className="py-3 px-4">মেয়াদ উত্তীর্ণ</th>
                <th className="py-3 px-4">কর্মক্রম</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-red-500 py-4">
                    কোন ব্যানার পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr key={banner._id}>
                    <td className="py-2 px-4">
                      {toBanglaNumber(
                        (currentPage - 1) * parPage + (index + 1)
                      )}
                    </td>
                    <td className="py-2 px-4">{banner._id}</td>
                    <td className="py-2 px-4">
                      <img
                        src={banner?.image?.url}
                        alt="banner"
                        className="w-[60px] h-[40px] rounded-md object-cover"
                      />
                    </td>
                    <td className="py-2 px-4">{banner.validity || "—"}</td>
                    <td className="py-2 px-4">
                      {formatDateToBangla(banner.expiryDate)}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/dashboard/edit-banner/${banner._id}`}
                          className="p-[6px] text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-[6px] text-white bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalBanner > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalBanner}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBanners;
