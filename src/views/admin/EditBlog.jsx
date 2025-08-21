/* eslint-disable no-undef */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  get_blog,
  messageClear,
  update_Blog,
  blog_image_update,
} from "../../store/Reducers/blogReducer";
import JoditEditor from "jodit-react";
import { overrideStyle } from "../../utils/utils";
import SeoHelmet from "../components/SEO";

const EditBlog = () => {
  const editor = useRef(null);
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const { blog, loader, errorMessage, successMessage } = useSelector(
    (state) => state.blog
  );

  const [state, setState] = useState({
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [content, setContent] = useState("");
  const [imageShow, setImageShow] = useState([]);

  const memoizedImages = useMemo(
    () =>
      blog.image?.url
        ? [blog.image.url]
        : Array.isArray(blog.image)
        ? blog.image
        : [],
    [blog.image]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback(
    (img, files) => {
      if (files.length > 0) {
        dispatch(
          blog_image_update({
            oldImage: img,
            newImage: files[0],
            blogId,
          })
        );
      }
    },
    [dispatch, blogId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      update_Blog({
        ...state,
        content,
        blogId,
      })
    );
  };

  useEffect(() => {
    dispatch(get_blog(blogId));
  }, [dispatch, blogId]);

  useEffect(() => {
    if (blog?.title) {
      setState({
        title: blog.title,
        description: blog.description,
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
      });
      setContent(blog.content);
      setImageShow(memoizedImages);
    }
  }, [blog, memoizedImages]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="ব্লগ সম্পাদনা করুন | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে বিদ্যমান ব্লগ পোস্ট সহজেই সম্পাদনা করুন। স্বাস্থ্য ও মেডিকেল বিষয়ক তথ্য আপডেট করে ইউজারদের জন্য আরও মূল্যবান কনটেন্ট প্রদান করুন।"
        keywords="ব্লগ এডিট, ব্লগ সম্পাদনা, ব্লগ আপডেট, Medi Fast Health Care, স্বাস্থ্য ব্লগ, অ্যাডমিন ড্যাশবোর্ড"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000] text-xl font-semibold">এডিট ব্লগ</h1>
          <Link
            to="/blog"
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2"
          >
            সব ব্লগ
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col mb-3 text-[#000]">
            <label htmlFor="title">ব্লগ টাইটেল</label>
            <input
              className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
              type="text"
              name="title"
              id="title"
              value={state.title}
              onChange={handleInputChange}
              placeholder="ব্লগ টাইটেল"
              required
            />
          </div>

          {/* Meta Title */}
          <div className="flex flex-col mb-3 text-[#000]">
            <label htmlFor="metaTitle">মেটা টাইটেল</label>
            <input
              className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
              type="text"
              name="metaTitle"
              id="metaTitle"
              value={state.metaTitle}
              onChange={handleInputChange}
              placeholder="মেটা টাইটেল"
            />
          </div>

          {/* Meta Description */}
          <div className="flex flex-col mb-3 text-[#000]">
            <label htmlFor="metaDescription">মেটা ডিসক্রিপশন</label>
            <textarea
              className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
              name="metaDescription"
              id="metaDescription"
              rows="3"
              value={state.metaDescription}
              onChange={handleInputChange}
              placeholder="মেটা ডিসক্রিপশন"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col mb-5 text-[#000]">
            <label>ব্লগ কনটেন্ট</label>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onChange={setContent}
            />
          </div>

          {/* Images */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-5">
            {imageShow.map((img, i) => (
              <div key={i}>
                <label
                  htmlFor={`image-${i}`}
                  className="block h-[180px] cursor-pointer"
                >
                  <img
                    src={img}
                    alt="Blog"
                    className="h-full w-full object-cover rounded-md"
                  />
                </label>
                <input
                  id={`image-${i}`}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageChange(img, e.target.files)}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loader}
              className="bg-blue-500 w-[190px] hover:shadow-blue-500/30 hover:shadow-lg text-white rounded-md px-7 py-2"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "আপডেট করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
