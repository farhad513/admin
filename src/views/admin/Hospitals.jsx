// src/pages/Hospitals.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_active_hospitals } from "../../store/Reducers/hospitalReducer";
import { useSocket } from "../components/useSocket";
import SeoHelmet from "../components/SEO";

const Hospitals = () => {
  const dispatch = useDispatch();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  // Redux state
  const { hospitals, totalHospital } = useSelector((state) => state.hospital);
  console.log(totalHospital);
  // Socket hook থেকে activeHospitals নিয়ে আসা
  const { activeHospitals } = useSocket();

  useEffect(() => {
    const params = {
      parPage,
      page: currentPage,
      searchValue,
    };
    dispatch(get_active_hospitals(params));
  }, [searchValue, currentPage, parPage, dispatch]);

  // Render hospitals with active/offline status
  const renderHospitals = useMemo(() => {
    if (!hospitals || hospitals.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-8 text-gray-400">
            কোনো হাসপাতাল পাওয়া যায়নি।
          </td>
        </tr>
      );
    }

    return hospitals.map((hospital, index) => (
      <tr key={hospital._id}>
        <td className="py-2 px-4">{(currentPage - 1) * parPage + index + 1}</td>
        <td className="py-2 px-4">
          <img
            className="w-[45px] h-[45px] rounded object-cover"
            src={hospital.image}
            alt={hospital.name || "Hospail upload kore nai"}
          />
        </td>
        <td className="py-2 px-4">{hospital.name}</td>
        <td className="py-2 px-4">{hospital.email}</td>
        <td className="py-2 px-4">{hospital.division}</td>
        <td className="py-2 px-4">{hospital.district}</td>
        <td className="py-2 px-4">{hospital.upazila}</td>

        <td className="py-2 px-4">
          <div className="flex gap-3">
            <Link
              to={`/admin/dashboard/hospital/details/${hospital._id}`}
              className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 text-white"
              title="ডিটেইল দেখুন"
            >
              <FaEye />
            </Link>
          </div>
        </td>
      </tr>
    ));
  }, [hospitals, currentPage, parPage, activeHospitals]);

  const handlePerPageChange = useCallback((e) => {
    setParPage(parseInt(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="সকল হাসপাতাল | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সমস্ত পার্টনার হাসপাতালের তালিকা দেখুন। হাসপাতালের নাম, ঠিকানা, বিভাগ, ডাক্তার এবং অন্যান্য তথ্য সহজেই পরিচালনা করুন।"
        keywords="সকল হাসপাতাল, হাসপাতাল লিস্ট, হাসপাতাল ম্যানেজমেন্ট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <select
            onChange={handlePerPageChange}
            value={parPage}
            className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] outline-none focus:border-indigo-500"
          >
            <option value="5">5</option>
            <option value="15">15</option>
            <option value="25">25</option>
          </select>

          <input
            onChange={handleSearchChange}
            value={searchValue}
            type="text"
            placeholder="সার্চ করুন..."
            className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] outline-none focus:border-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Upazila</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-normal">{renderHospitals}</tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalHospital > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalHospital}
              perPageItem={parPage}
              showItem={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
