import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { overrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import {
  add_banner,
  messageClear,
  get_banner,
  update_banner,
} from "../../store/Reducers/bannerReducer";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import SeoHelmet from "../components/SEO";

const AddBanner = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageShow, setImageShow] = useState("");
  const [image, setImage] = useState("");
  const [validity, setValidity] = useState("");

  const { loader, successMessage, errorMessage, banner } = useSelector(
    (state) => state.banner
  );
  console.log(banner, "banner id");
  useEffect(() => {
    if (id) {
      dispatch(get_banner(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (banner) {
      setImageShow(banner?.banner?.image?.url || "");
      setValidity(banner?.banner?.validity || "");
    }
  }, [banner]);

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  const add = (e) => {
    e.preventDefault();
    if (!validity) {
      toast.error("Please select a validity period.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("validity", validity);
    dispatch(add_banner(formData));
  };

  const update = (e) => {
    e.preventDefault();
    if (!validity) {
      toast.error("Please select a validity period.");
      return;
    }
    const formData = new FormData();
    if (image) formData.append("image", image); // optionally update image only if changed
    formData.append("validity", validity);
    dispatch(update_banner({ id, info: formData })); // send id with formData
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setImageShow("");
      setImage("");
      setValidity("");
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <SeoHelmet
        title="নতুন ব্যানার যুক্ত করুন | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে নতুন ব্যানার যুক্ত করুন। হোমপেজ বা অন্যান্য পেজে প্রচারের জন্য ব্যানার ম্যানেজমেন্ট সহজভাবে করুন।"
        keywords="নতুন ব্যানার, ব্যানার যুক্ত করুন, ব্যানার ম্যানেজমেন্ট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
      />

      <div className="w-full p-4  bg-[#fff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000] text-xl font-semibold">
            {id ? "Edit banner" : "Add banner"}
          </h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/admin/dashboard/all-banners"
          >
            Banners
          </Link>
        </div>

        {!id && (
          <form onSubmit={add}>
            {/* Image input */}
            <div className="mb-6">
              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#000]"
                htmlFor="image"
              >
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <span>Select banner image</span>
              </label>
              <input
                required
                onChange={imageHandle}
                className="hidden"
                type="file"
                id="image"
              />
            </div>

            {imageShow && (
              <div className="mb-4">
                <img className="w-full h-auto" src={imageShow} alt="banner" />
              </div>
            )}

            {/* Validity Dropdown */}
            <div className="mb-6">
              <label className="text-[#000] block mb-2">
                Select Validity Period
              </label>
              <select
                className="w-full p-2 rounded bg-[#fff] text-[#000] border border-gray-500"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                <option value="1_month">1 Month</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
              </select>
            </div>

            <button
              disabled={loader}
              className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Add banner"
              )}
            </button>
          </form>
        )}

        {id && banner && (
          <form onSubmit={update}>
            {/* <div className='mb-4'>
              <img className='w-full h-auto' src={imageShow} alt="current banner" />
            </div> */}

            <div className="mb-6">
              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#000]"
                htmlFor="image"
              >
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <span>Select new banner image (optional)</span>
              </label>
              <input
                onChange={imageHandle}
                className="hidden"
                type="file"
                id="image"
              />
            </div>

            {imageShow && (
              <div className="mb-4">
                <img className="w-full h-auto" src={imageShow} alt="preview" />
              </div>
            )}

            <div className="mb-6">
              <label className="text-[#000] block mb-2">
                Select Validity Period
              </label>
              <select
                className="w-full p-2 rounded bg-[#fff] text-[#000] border border-gray-500"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                <option value="1_month">1 Month</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
              </select>
            </div>

            <button
              disabled={loader}
              className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Update banner"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBanner;
