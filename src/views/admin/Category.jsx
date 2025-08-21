/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { GrClose } from "react-icons/gr";
import Pagination from "../Pagination";
import { BsImage } from "react-icons/bs";
import toast from "react-hot-toast";
import { overrideStyle } from "../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import {
  categoryAdd,
  messageClear,
  get_category,
  categoryEdit,
  categoryDelete,
} from "../../store/Reducers/categoryReducer";
import SeoHelmet from "../components/SEO";

// Debounce utility
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// useDebounce hook
const useDebounce = (callback, delay) => {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [callback, delay]
  );
  return debouncedFn;
};

const Category = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, categorys, totalCategory } =
    useSelector((state) => state.category);
  console.log(categorys);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImageShow] = useState(null);
  const [state, setState] = useState({ name: "", image: "", id: "" });

  // Image handle
  const imageHandle = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (imageShow) URL.revokeObjectURL(imageShow); // Clean previous URL
      const imgURL = URL.createObjectURL(selectedImage);
      setImageShow(imgURL);
      setState({ ...state, image: selectedImage });
    }
  };

  // Submit handler
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!state.name.trim()) {
      toast.error("ক্যাটেগরি নাম দিন");
      return;
    }
    if (!state.id && !state.image) {
      toast.error("চিত্র দিন");
      return;
    }
    if (state.id) {
      dispatch(categoryEdit(state));
    } else {
      dispatch(categoryAdd(state));
    }
  };

  // Reset form
  const resetForm = () => {
    if (imageShow) URL.revokeObjectURL(imageShow);
    setState({ name: "", image: "", id: "" });
    setImageShow(null);
    setShow(false);
  };

  // Message handler
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(get_category({ parPage, page: currentPage, searchValue }));
      dispatch(messageClear());
      resetForm();
    }
  }, [successMessage, errorMessage, dispatch]);

  // Load categories
  useEffect(() => {
    dispatch(get_category({ parPage, page: currentPage, searchValue }));
  }, [searchValue, currentPage, parPage, dispatch]);

  // Debounced search
  const handleSearch = useDebounce((value) => setSearchValue(value), 500);

  // Edit handler
  const handleEdit = (category) => {
    if (imageShow) URL.revokeObjectURL(imageShow);
    setState({ name: category.name, image: "", id: category._id });
    setImageShow(category.image.url);
    setShow(true);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("আপনি কি এই ক্যাটেগরি মুছে ফেলতে চান?")) {
      dispatch(categoryDelete(id));
    }
  };

  // Clean image URL on unmount
  useEffect(() => {
    return () => {
      if (imageShow) URL.revokeObjectURL(imageShow);
    };
  }, [imageShow]);

  // Memoized categories (future proofing large list)
  const paginatedCategories = useMemo(() => categorys, [categorys]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="ক্যাটাগরি ম্যানেজমেন্ট | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে ডাক্তার ও স্বাস্থ্য সেবার বিভাগ (ক্যাটাগরি) তৈরি, সম্পাদনা বা মুছে দিন। অ্যাডমিন হিসেবে সহজেই সমস্ত সেবা বিভাগের পরিচালনা করুন।"
        keywords="ক্যাটাগরি ম্যানেজমেন্ট, অ্যাডমিন ক্যাটাগরি, ডাক্তার বিভাগ, সেবা বিভাগ, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
      />

      {/* Mobile Topbar */}
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#fff] rounded-md">
        <h1 className="text-[#000] font-semibold text-lg">ক্যাটেগরি</h1>
        <button
          onClick={() => {
            resetForm();
            setShow(true);
          }}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 text-white rounded-sm text-sm"
        >
          যোগ করুন
        </button>
      </div>

      <div className="flex flex-wrap w-full">
        {/* Categories List */}
        <div className="w-full lg:w-7/12">
          <div className="w-full p-4 bg-[#fff] rounded-md">
            <div className="flex justify-between items-center mb-4">
              <select
                onChange={(e) => setParPage(parseInt(e.target.value))}
                value={parPage}
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
              >
                <option value="5">5</option>
                <option value="15">15</option>
                <option value="25">25</option>
              </select>
              <input
                onChange={(e) => handleSearch(e.target.value)}
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                type="text"
                placeholder="অনুসন্ধান করুন..."
                disabled
              />
            </div>

            <div className="relative overflow-x-auto flex justify-center">
              <table className="w-full max-w-4xl text-sm text-center text-[#000]">
                <thead className="text-sm uppercase border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">নং</th>
                    <th className="py-3 px-4">চিত্র</th>
                    <th className="py-3 px-4">নাম</th>
                    <th className="py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((c, i) => (
                      <tr key={c._id}>
                        <td className="py-1 px-4">{i + 1}</td>
                        <td className="py-1 px-4 flex justify-center">
                          <img
                            className="w-[45px] h-[45px] object-cover rounded"
                            src={c.image.url}
                            alt="category"
                          />
                        </td>
                        <td className="py-1 px-4">{c.name}</td>
                        <td className="py-1 px-4">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-[6px] bg-yellow-500 text-white rounded hover:shadow-lg hover:shadow-yellow-500/50"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
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
                      <td colSpan="4" className="text-center py-4">
                        কোনো ক্যাটেগরি পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {categorys.length > 0 && (
              <div className="flex justify-end mt-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalCategory}
                  parPage={parPage}
                  showItem={4}
                />
              </div>
            )}
          </div>
        </div>

        {/* Category Form */}
        <div
          className={`w-[320px] lg:w-5/12 fixed ${
            show ? "right-0" : "-right-[340px]"
          } top-0 z-[9999] transition-all duration-500 lg:relative lg:right-0`}
        >
          <div className="pl-5">
            <div className="bg-[#fff] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#000]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-semibold text-xl">
                  {state.id ? "ক্যাটেগরি আপডেট করুন" : "ক্যাটেগরি যোগ করুন"}
                </h1>
                <div
                  onClick={() => resetForm()}
                  className="block lg:hidden cursor-pointer"
                >
                  <GrClose />
                </div>
              </div>

              <form onSubmit={handleCategorySubmit}>
                <div className="flex flex-col gap-1 mb-3">
                  <label htmlFor="categoryName">ক্যাটেগরি নাম</label>
                  <input
                    id="categoryName"
                    value={state.name}
                    onChange={(e) =>
                      setState({ ...state, name: e.target.value })
                    }
                    className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                    type="text"
                    placeholder="ক্যাটেগরি নাম"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imageUpload"
                    className="flex flex-col items-center justify-center h-[238px] cursor-pointer border border-dashed border-[#000] hover:border-indigo-500"
                  >
                    {imageShow ? (
                      <img
                        className="w-full h-full object-cover"
                        src={imageShow}
                        alt="category"
                      />
                    ) : (
                      <>
                        <BsImage size={32} />
                        <span>চিত্র নির্বাচন করুন</span>
                      </>
                    )}
                  </label>
                  <input
                    onChange={imageHandle}
                    className="hidden"
                    type="file"
                    id="imageUpload"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loader}
                    className="bg-blue-500 w-full hover:shadow-lg hover:shadow-blue-500/20 text-white rounded-md px-7 py-2"
                  >
                    {loader ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={overrideStyle}
                      />
                    ) : state.id ? (
                      "ক্যাটেগরি আপডেট করুন"
                    ) : (
                      "ক্যাটেগরি যোগ করুন"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
