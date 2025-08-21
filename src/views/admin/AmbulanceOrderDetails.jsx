/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  admin_ambulance_get,
  admin_ambulance_status_update,
  messageClear,
} from "../../store/Reducers/ambulanceReducer";
import toast from "react-hot-toast";
import SeoHelmet from "../components/SEO";

// ইংরেজি নাম্বার -> বাংলা নাম্বার
const engToBanglaNumber = (number) => {
  const banglaNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number
    .toString()
    .split("")
    .map((char) => (char >= "0" && char <= "9" ? banglaNumbers[char] : char))
    .join("");
};

// তারিখ ফরম্যাট
const formatBanglaDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("bn-BD", options);
};

// সময় ফরম্যাট
const formatBanglaTime = (timeString) => {
  if (!timeString) return "";
  let [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  let period = "";
  if (hour === 0) (period = "রাত"), (hour = 12);
  else if (hour < 6) period = "রাত";
  else if (hour < 12) period = "সকাল";
  else if (hour === 12) period = "দুপুর";
  else if (hour < 16) (period = "দুপুর"), (hour -= 12);
  else if (hour < 19) (period = "বিকেল"), (hour -= 12);
  else (period = "রাত"), (hour -= 12);
  const bh = engToBanglaNumber(hour.toString());
  const bm = engToBanglaNumber(minute.toString().padStart(2, "0"));
  return `${bh}:${bm} (${period})`;
};

const AmbulanceDetails = () => {
  const { ambulanceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ambulance, successMessage, errorMessage } = useSelector(
    (state) => state.ambulance
  );

  const [localAmbulance, setLocalAmbulance] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(admin_ambulance_get(ambulanceId));
  }, [dispatch, ambulanceId]);

  useEffect(() => {
    if (ambulance) {
      setLocalAmbulance(ambulance);
      setStatus(ambulance.status);
    }
  }, [ambulance]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    cancelled: "bg-red-500",
  };

  const status_update = (e) => {
    const newStatus = e.target.value;
    dispatch(
      admin_ambulance_status_update({
        ambulanceId,
        status: { status: newStatus },
      })
    ).then(() => {
      setStatus(newStatus);
      setLocalAmbulance({ ...localAmbulance, status: newStatus });
    });
  };

  return (
    <div className="px-4 py-6">
      <SeoHelmet
        title="অ্যাম্বুলেন্স স্ট্যাটাস আপডেট | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে ব্যবহারকারীদের অ্যাম্বুলেন্স বুকিং স্ট্যাটাস সহজেই আপডেট করুন। পেন্ডিং, কনফার্মড, চলমান বা সম্পন্ন স্ট্যাটাস পরিবর্তন করে দ্রুত এবং সুরক্ষিত সেবা নিশ্চিত করুন।"
        keywords="অ্যাম্বুলেন্স স্ট্যাটাস আপডেট, অ্যাম্বুলেন্স বুকিং, Medi Fast Health Care, অ্যাডমিন অ্যাম্বুলেন্স, অ্যাম্বুলেন্স ম্যানেজমেন্ট"
      />

      <div className="max-w-3xl mx-auto bg-[#fff] p-8 rounded-xl shadow-xl text-[#000]">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          অ্যাম্বুলেন্স বুকিং ডিটেইলস
        </h2>

        {localAmbulance && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info
                label="অ্যাম্বুলেন্স টাইপ"
                value={localAmbulance.ambulanceType}
              />
              <Info label="নাম" value={localAmbulance.name} />
              <Info
                label="মোবাইল"
                value={engToBanglaNumber(localAmbulance.phone)}
              />
              <Info
                label="অ্যাম্বুলেন্সের ধরণ"
                value={localAmbulance.ambulanceType}
              />

              <Info
                label="পিকআপ তারিখ"
                value={formatBanglaDate(localAmbulance.pickupDate)}
              />
              <Info
                label="পিকআপ সময়"
                value={formatBanglaTime(localAmbulance.pickupTime)}
              />
              <Info
                label="পিকআপ ঠিকানা"
                value={localAmbulance.pickupAddress}
                className="whitespace-pre-line break-words"
              />
              <Info
                label="ড্রপ ঠিকানা"
                value={localAmbulance.dropAddress}
                className="whitespace-pre-line break-words"
              />
              <Info
                label="বয়স"
                value={
                  localAmbulance.age
                    ? engToBanglaNumber(localAmbulance.age)
                    : "—"
                }
              />
              <div>
                <p className="font-semibold mb-1">স্ট্যাটাস:</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[localAmbulance.status]
                  }`}
                >
                  {localAmbulance.status === "pending" && "পেন্ডিং"}
                  {localAmbulance.status === "confirmed" && "কনফার্মড"}
                  {localAmbulance.status === "cancelled" && "বাতিল"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-semibold mb-2 text-black">
                স্ট্যাটাস পরিবর্তন করুন:
              </label>
              <select
                value={status}
                onChange={status_update}
                className="text-black p-3 rounded-lg border outline-none w-full"
              >
                <option value="pending">পেন্ডিং</option>
                <option value="confirmed">কনফার্মড</option>
                <option value="cancelled">বাতিল</option>
              </select>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 px-5 py-3 rounded-lg text-white font-semibold hover:from-indigo-500 hover:to-indigo-700"
            >
              ⬅️ পিছনে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value, className = "" }) => (
  <div>
    <p className="font-semibold mb-1 text-black">{label}:</p>
    <p className={`text-lg ${className}`}>{value}</p>
  </div>
);

export default AmbulanceDetails;
