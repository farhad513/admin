import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import { get_hospital_request } from "../../store/Reducers/hospitalReducer";
import { debounce } from "lodash";
import SeoHelmet from "../components/SEO";

// Loader component
const Loader = () => (
  <div className="text-center py-6 text-white">লোড হচ্ছে...</div>
);

const HospitalRow = React.memo(({ d, i, currentPage, parPage }) => (
  <tr className="border-b border-slate-700">
    <td className="py-2 px-4">{(currentPage - 1) * parPage + (i + 1)}</td>
    <td className="py-2 px-4">{d.name}</td>
    <td className="py-2 px-4">{d.email}</td>
    <td className="py-2 px-4">{d.status}</td>
    <td className="py-2 px-4">
      <div className="flex gap-4">
        <Link
          to={`/admin/dashboard/hospital/details/${d._id}`}
          className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 text-white"
        >
          <FaEye />
        </Link>
      </div>
    </td>
  </tr>
));

const HospitalRequest = () => {
  const dispatch = useDispatch();
  const { hospitals, totalHospital, loading } = useSelector(
    (state) => state.hospital
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  const fetchData = useCallback(() => {
    dispatch(get_hospital_request({ parPage, searchValue, page: currentPage }));
  }, [dispatch, parPage, searchValue, currentPage]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleParPageChange = useCallback((parPage) => {
    setParPage(parPage);
    setCurrentPage(1);
  }, []);

  // Debounce Search input handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchValue(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  const tableHeaders = useMemo(
    () => ["নং", "নাম", "ইমেইল", "স্ট্যাটাস", "অ্যাকশন"],
    []
  );

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="হাসপাতাল রিকোয়েস্ট ম্যানেজমেন্ট | Medi Fast Health Care"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে আসা নতুন হাসপাতালের রিকোয়েস্ট রিভিউ, অনুমোদন বা বাতিল করুন। পার্টনার হাসপাতাল ম্যানেজমেন্ট আরও সহজ ও দ্রুত করুন।"
        keywords="হাসপাতাল রিকোয়েস্ট, অ্যাডমিন প্যানেল, Medi Fast Health Care, হাসপাতাল অনুমোদন, হাসপাতাল ম্যানেজমেন্ট"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <Search
          setParPage={handleParPageChange}
          setSearchValue={debouncedSearch}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-xs text-[#000] uppercase border-b border-slate-700">
              <tr>
                {tableHeaders.map((header, i) => (
                  <th key={i} className="py-3 px-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-sm font-normal">
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <Loader />
                  </td>
                </tr>
              ) : hospitals.length > 0 ? (
                hospitals.map((d, i) => (
                  <HospitalRow
                    key={d._id}
                    d={d}
                    i={i}
                    currentPage={currentPage}
                    parPage={parPage}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    কোনো হাসপাতাল পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalHospital > parPage && (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={handlePageChange}
              totalItem={totalHospital}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalRequest;
