import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import {
  GetAmbulances,
  AmbulanceDelete,
  messageClear,
} from "../../store/Reducers/ambulanceReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SEO";

const AllAmbulances = () => {
  const dispatch = useDispatch();
  const { ambulances, totalAmbulance, errorMessage, successMessage } =
    useSelector((state) => state.ambulance);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  console.log(ambulances);
  // Ambulance ডেটা লোড ফাংশন
  const fetchAmbulances = useCallback(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(GetAmbulances(params));
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "তুমি কি এই অ্যাম্বুলেন্স ডিলিট করতে চাও?"
    );
    if (confirmDelete) {
      await dispatch(AmbulanceDelete(id));
      fetchAmbulances();
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="সকল অ্যাম্বুলেন্স | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সকল অ্যাম্বুলেন্সের তালিকা দেখুন। অ্যাম্বুলেন্সের নাম, ড্রাইভার, ধরন, রেজিস্ট্রেশন এবং অন্যান্য তথ্য সহজেই পরিচালনা করুন।"
        keywords="সকল অ্যাম্বুলেন্স, অ্যাম্বুলেন্স লিস্ট, অ্যাম্বুলেন্স ম্যানেজমেন্ট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
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
                <th className="py-3 px-4">ছবি</th>
                <th className="py-3 px-4">অ্যাম্বুলেন্সের নাম</th>
                <th className="py-3 px-4">ড্রাইভারের নাম</th>
                <th className="py-3 px-4">ফোন নাম্বার</th>
                <th className="py-3 px-4">অ্যাম্বুলেন্সের ধরন</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ambulances.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-red-500 py-4">
                    কোন অ্যাম্বুলেন্স পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                ambulances.map((ambulance, index) => (
                  <tr key={ambulance._id}>
                    <td className="py-2 px-4">
                      {(currentPage - 1) * parPage + (index + 1)}
                    </td>
                    <td className="py-2 px-4">
                      <img
                        src={ambulance?.image?.url}
                        alt="ambulance"
                        className="w-[45px] h-[45px] rounded-md object-cover"
                      />
                    </td>
                    <td className="py-2 px-4">
                      {ambulance?.ambulanceName?.slice(0, 20)}...
                    </td>
                    <td className="py-2 px-4">
                      {ambulance?.driverName?.slice(0, 20)}...
                    </td>
                    <td className="py-2 px-4">{ambulance?.type}</td>
                    <td className="py-2 px-4">{ambulance?.driverPhone}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/dashboard/ambulance/edit-ambulance/${ambulance._id}`}
                          className="p-[6px] text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(ambulance._id)}
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

export default AllAmbulances;
