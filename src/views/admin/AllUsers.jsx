import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { get_all_users, messageClear } from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SEO";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );
  console.log(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  // ⬇️ ইউজার লোড করার ফাংশন useCallback দিয়ে মেমো করা
  const fetchUsers = useCallback(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_all_users(params));
  }, [dispatch, parPage, currentPage, searchValue]);
  // ⬇️ ডাটা লোড useEffect
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ⬇️ মেসেজ হ্যান্ডলিং useEffect
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
  const toBanglaNumber = (number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => bnDigits[d] || d)
      .join("");
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="সকল ব্যবহারকারী | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সমস্ত ব্যবহারকারীর তালিকা দেখুন। ইউজার অ্যাকাউন্ট, প্রোফাইল তথ্য এবং অ্যাপয়েন্টমেন্ট হিস্টোরি সহজেই পরিচালনা করুন।"
        keywords="সকল ব্যবহারকারী, ইউজার লিস্ট, অ্যাডমিন ড্যাশবোর্ড, Medi Fast Health Care, ব্যবহারকারী ম্যানেজমেন্ট"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md text-[#000]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">সকল ইউজার তালিকা</h2>
          <p className="text-sm">
            মোট ইউজার:{" "}
            <span className="font-bold text-green-400">
              {toBanglaNumber(totalUsers)} জন
            </span>
          </p>
        </div>
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left">
            <thead className="text-sm uppercase border-b border-slate-700 text-center">
              <tr>
                <th className="py-3 px-4">নং</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">ইমেইল</th>
                <th className="py-3 px-4">ফোন</th>
                <th className="py-3 px-4">রেজিস্ট্রেশন তারিখ</th>
                <th className="py-3 px-4">রক্তের গ্রুপ</th>
                <th className="py-3 px-4">শেষরক্তদানের তারিখ</th>
                <th className="py-3 px-4">কর্মসূচি</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-red-500 py-4">
                    কোন ইউজার পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id} className="text-center">
                    <td className="py-2 px-4">
                      {toBanglaNumber(
                        (currentPage - 1) * parPage + (index + 1)
                      )}
                    </td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">
                      {" "}
                      {user.email ? user.email : "ইমেইল নেই"}
                    </td>

                    <td className="py-2 px-4">{user.phone}</td>
                    <td className="py-2 px-4">
                      {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                    </td>

                    <td className="py-2 px-4">{user.bloodGroup}</td>
                    <td className="py-2 px-4">
                      {" "}
                      {new Date(user.lastBloodDate).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/dashboard/user/edit/${user._id}`}
                          className="p-[6px] text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          //   onClick={() => handleDelete(user._id)}
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

        {totalUsers > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalUsers}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
