import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  messageClear,
  hospital_status_update,
  get_hospital,
} from "../../store/Reducers/hospitalReducer";
import { get_user_info } from "../../store/Reducers/authReducer";
import SeoHelmet from "../components/SEO";
const HospitalsDetails = () => {
  const dispatch = useDispatch();
  const { hospital, successMessage, loading } = useSelector(
    (state) => state.hospital
  );
  const { hospitalId } = useParams();

  const [status, setStatus] = useState("");

  // হসপিটাল ডেটা লোড
  useEffect(() => {
    if (hospitalId) {
      dispatch(get_hospital(hospitalId));
    }
  }, [dispatch, hospitalId]);

  // স্ট্যাটাস সেট
  useEffect(() => {
    if (hospital?.status) {
      setStatus(hospital.status);
    }
  }, [hospital]);

  // success মেসেজ toast
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  // স্ট্যাটাস আপডেট সাবমিট
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!status) {
        toast.error("স্ট্যাটাস নির্বাচন করুন!");
        return;
      }

      try {
        const result = await dispatch(
          hospital_status_update({ hospitalId, status })
        ).unwrap();

        // ✅ এখন ইউজারের নতুন ইনফো আনুন
        await dispatch(get_user_info()); // এটা authReducer থেকে আসবে

        // toast.success("স্ট্যাটাস সফলভাবে আপডেট হয়েছে");
        
      } catch (err) {
        toast.error("স্ট্যাটাস আপডেট করতে ব্যর্থ!");
        console.error("Update error:", err);
      }
    },
    [dispatch, hospitalId, status]
  );

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="হাসপাতাল বিস্তারিত | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে নির্বাচিত হাসপাতালের বিস্তারিত তথ্য দেখুন। হাসপাতালের নাম, ঠিকানা, বিভাগ, ডাক্তার, অ্যাম্বুলেন্স, সেবা ও রেজিস্ট্রেশন তথ্য একসাথে ম্যানেজ করুন।"
        keywords="হাসপাতাল বিস্তারিত, Medi Fast Health Care অ্যাডমিন, হাসপাতাল প্রোফাইল, হাসপাতাল তথ্য, হাসপাতাল ম্যানেজমেন্ট"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md shadow-lg">
        {/* শিরোনাম */}
        <h2 className="text-xl font-semibold text-[#000] mb-4">
          হাসপাতাল বিস্তারিত
        </h2>

        {/* ডেটা কনটেইনার */}
        <div className="flex flex-col lg:flex-row flex-wrap gap-5 text-[#000]">
          {/* ছবি */}
          <div className="lg:w-3/12 w-full flex justify-center items-center">
            <div className="w-full">
              {hospital?.image ? (
                <img
                  src={hospital.image}
                  alt="Hospital"
                  className="w-full h-[220px] object-cover rounded-md border border-slate-700"
                />
              ) : (
                <div className="text-center py-10 bg-[#f1f1f1] rounded-md">
                  ছবি আপলোড করা হয়নি
                </div>
              )}
            </div>
          </div>

          {/* তথ্য তালিকা */}
          <div className="lg:w-8/12 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="নাম" value={hospital?.name} />
            <InfoItem label="ইমেইল" value={hospital?.email} />
            <InfoItem label="ফোন" value={hospital?.phone} />
            <InfoItem label="ধরন (Role)" value={hospital?.role} />
            <InfoItem label="স্ট্যাটাস" value={hospital?.status} />
            <InfoItem label="লাইসেন্স নম্বর" value={hospital?.license} />
            <InfoItem label="ওয়েবসাইট" value={hospital?.website} />
            <InfoItem label="ইমারজেন্সি সেবা" value={hospital?.emergency} />
            <InfoItem label="ওপেনিং সময়" value={hospital?.openingTime} />
            <InfoItem label="ক্লোজিং সময়" value={hospital?.closingTime} />
            <InfoItem
              label="প্যাথলজি ডিসকাউন্ট"
              value={hospital?.pathologyDiscount}
            />
            <InfoItem label="বিল ডিসকাউন্ট" value={hospital?.billDiscount} />
            <InfoItem label="বিভাগ" value={hospital?.division} />
            <InfoItem label="জেলা" value={hospital?.district} />
            <InfoItem label="উপজেলা" value={hospital?.upazila} />
            <InfoItem label="ঠিকানা" value={hospital?.address} />
            <InfoItem
              label="প্রোফাইল আপডেটেড"
              value={hospital?.profileUpdated ? "হ্যাঁ" : "না"}
            />
            <InfoItem
              label="তৈরি তারিখ"
              value={
                hospital?.createdAt
                  ? new Date(hospital.createdAt).toLocaleString("bn-BD")
                  : ""
              }
            />
            <InfoItem
              label="সর্বশেষ আপডেট"
              value={
                hospital?.updatedAt
                  ? new Date(hospital.updatedAt).toLocaleString("bn-BD")
                  : ""
              }
            />
          </div>
        </div>

        {/* স্ট্যাটাস আপডেট */}
        <div className="mt-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 items-center"
          >
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-[#f1f1f1] border border-slate-700 rounded-md text-[#000] focus:border-indigo-500 outline-none w-full md:w-auto"
              required
            >
              <option value="">-- স্ট্যাটাস নির্বাচন করুন --</option>
              <option value="active">সক্রিয়</option>
              <option value="deactive">নিষ্ক্রিয়</option>
            </select>

            <button
              type="submit"
              className={`${
                loading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-700"
              } bg-blue-600 transition text-white font-medium rounded-md px-8 py-2 w-full md:w-auto`}
              disabled={loading}
            >
               {loading ? "আপডেট হচ্ছে..." : "স্ট্যাটাস আপডেট করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ✅ ইনফো আইটেম কম্পোনেন্ট
const InfoItem = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="font-medium">{label}:</span>
    <span>{value !== undefined && value !== "" ? value : "উপলব্ধ নয়"}</span>
  </div>
);

export default HospitalsDetails;
