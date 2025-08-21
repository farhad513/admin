import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { blogAdd, messageClear } from "../../store/Reducers/blogReducer";
import toast from "react-hot-toast";
import { MdPostAdd } from "react-icons/md";
import SeoHelmet from "../components/SEO";

const AddBlogPage = () => {
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const { successMessage, errorMessage } = useSelector((state) => state.blog);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      title,
      image,
      content,
      metaTitle,
      metaDescription,
    };
    dispatch(blogAdd(blogData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      setTitle("");
      setImage(null);
      setContent("");
      setMetaTitle("");
      setMetaDescription("");
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <SeoHelmet
        title="নতুন ব্লগ যুক্ত করুন | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে নতুন ব্লগ পোস্ট তৈরি করুন। স্বাস্থ্য ও মেডিকেল বিষয়ক তথ্য শেয়ার করে ইউজারদের জন্য দরকারি কনটেন্ট প্রকাশ করুন।"
        keywords="নতুন ব্লগ, ব্লগ যুক্ত করুন, ব্লগ ম্যানেজমেন্ট, Medi Fast Health Care, স্বাস্থ্য ব্লগ, অ্যাডমিন ড্যাশবোর্ড"
      />

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl p-8 text-center shadow-lg mb-10">
        <h1 className="text-4xl font-extrabold mb-2">📝 নতুন ব্লগ লিখুন</h1>
        <p className="text-lg font-medium">
          আপনার গল্প, অভিজ্ঞতা আর তথ্য সকলের সাথে ভাগ করুন!
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        {/* Meta Title */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            মেটা টাইটেল
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="SEO টাইটেল লিখুন"
            required
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            মেটা ডিসক্রিপশন
          </label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="SEO ডিসক্রিপশন লিখুন"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            ব্লগ টাইটেল
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="এখানে ব্লগের শিরোনাম লিখুন"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            ফিচার ইমেজ
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-green-100 file:text-green-700
              hover:file:bg-green-200"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="mt-4 w-72 rounded-xl shadow border"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            ব্লগ কনটেন্ট
          </label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 text-white text-lg font-semibold py-3 rounded-lg transition duration-200 
            ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          <MdPostAdd size={22} />
          {loading ? "সাবমিট হচ্ছে..." : "ব্লগ সাবমিট করুন"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
