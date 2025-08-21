import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import Search from "../components/Search";
import {
  get_blogs,
  delete_blog,
  messageClear,
} from "../../store/Reducers/blogReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SEO";

const AllBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, totalBlog, errorMessage, successMessage } = useSelector(
    (state) => state.blog
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  // ⬇️ ব্লগ লোড করার ফাংশন আলাদা করে useCallback দিয়ে মেমো করা
  const fetchBlogs = useCallback(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_blogs(params));
  }, [dispatch, parPage, currentPage, searchValue]);

  // ⬇️ ডাটা লোড useEffect
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  // ⬇️ ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("তুমি কি এই ব্লগ ডিলিট করতে চাও?");
    if (confirmDelete) {
      await dispatch(delete_blog(id));
      fetchBlogs();
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="সকল ব্লগ | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে সকল ব্লগের তালিকা দেখুন। স্বাস্থ্য ও মেডিকেল বিষয়ক ব্লগগুলো পরিচালনা, সম্পাদনা এবং প্রকাশ সহজভাবে করুন।"
        keywords="সকল ব্লগ, ব্লগ লিস্ট, ব্লগ ম্যানেজমেন্ট, Medi Fast Health Care, স্বাস্থ্য ব্লগ, অ্যাডমিন ড্যাশবোর্ড"
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
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Meta Title</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-red-500 py-4">
                    কোন ব্লগ পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td className="py-2 px-4">
                      {(currentPage - 1) * parPage + (index + 1)}
                    </td>
                    <td className="py-2 px-4">
                      <img
                        src={blog.image.url}
                        alt="blog"
                        className="w-[45px] h-[45px] rounded-md object-cover"
                      />
                    </td>
                    <td className="py-2 px-4">{blog.title.slice(0, 20)}...</td>
                    <td className="py-2 px-4">
                      {blog.metaTitle.slice(0, 20)}...
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/dashboard/blog/edit-blog/${blog._id}`}
                          className="p-[6px] text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
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

        {totalBlog > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalBlog}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
