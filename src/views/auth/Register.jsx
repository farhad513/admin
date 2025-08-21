import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  hospital_register,
} from "../../store/Reducers/authReducer";
import Loading from "../components/Loading";
import SeoHelmet from "../components/SEO";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  // 🔹 Bangla → English digit converter
  const convertBanglaToEnglish = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .split("")
      .map((char) => {
        const index = banglaDigits.indexOf(char);
        return index !== -1 ? index.toString() : char;
      })
      .join("");
  };

  // 🔹 Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const banglaPattern = /^[\u0980-\u09FF ]*$/; // শুধু বাংলা অক্ষর
      if (!value || banglaPattern.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        toast.error("ভাই/আপু, শুধু বাংলা অক্ষর লিখুন!");
      }
    } else if (name === "phone") {
      const onlyDigitPattern = /^[০-৯0-9]*$/; // বাংলা + ইংরেজি ডিজিট
      if (!value || onlyDigitPattern.test(value)) {
        if (value.length > 11) {
          toast.error("ফোন নম্বর ১১ সংখ্যার বেশি হবে না!");
          return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        toast.error("ফোন নম্বর শুধুমাত্র সংখ্যা লিখুন (বাংলা/ইংরেজি)!");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, password } = formData;

    // ফোন নম্বর convert করা হলো
    const convertedPhone = convertBanglaToEnglish(phone);
    const phonePattern = /^01[3-9]\d{8}$/;

    if (!name.trim()) return toast.error("নাম দিন!");
    if (!email.trim()) return toast.error("ইমেইল দিন!");
    if (password.length < 6)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন!");
    if (!phonePattern.test(convertedPhone)) {
      return toast.error("সঠিক ফরম্যাটে ফোন নম্বর দিন (01XXXXXXXXX)");
    }

    dispatch(hospital_register({ ...formData, phone: convertedPhone }));
  };

  // 🔹 Success / Error Handling
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);
  return (
    <div className="font-[sans-serif] p-4 mt-6">
      <SeoHelmet
        title="হাসপাতাল রেজিস্ট্রেশন | আপনার হাসপাতাল যুক্ত করুন"
        description="বাংলাদেশের সকল হাসপাতাল এখন আমাদের প্ল্যাটফর্মে যুক্ত করুন। দ্রুত রেজিস্ট্রেশন করুন।"
        keywords="হাসপাতাল রেজিস্ট্রেশন, বাংলাদেশ হাসপাতাল, নতুন হাসপাতাল"
        url="https://www.medifasthealthcare.com/register"
      />
      {loader && <Loading />}
      <div className="flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto shadow-[0_2px_10px_-2px_rgba(195,169,50,0.5)] p-8 relative mt-12 rounded-lg bg-white">
          <div className="w-28 h-28 border-4 border-[#c3a932] absolute left-0 right-0 mx-auto -top-14 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="https://i.ibb.co/Ld6LSNjq/logo-2.png"
              alt="logo"
              className="w-full h-full object-contain animate-spin-slow"
            />
          </div>
          <form onSubmit={handleSubmit} className="mt-12 space-y-4">
            <h3 className="text-xl font-bold text-blue-600 mb-6 text-center">
              হাসপাতাল রেজিস্ট্রেশন করুন
            </h3>
            <input
              onChange={handleInputChange}
              value={formData.name}
              name="name"
              type="text"
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="হাসপাতালের নাম (শুধু বাংলা)"
              required
            />
            <input
              onChange={handleInputChange}
              value={formData.email}
              name="email"
              type="email"
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="ইমেইল ঠিকানা লিখুন"
              required
            />
            <input
              onChange={handleInputChange}
              value={formData.phone}
              name="phone"
              type="text"
              maxLength={11}
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="ফোন নম্বর (বাংলা/ইংরেজি সংখ্যা)"
              required
            />
            <input
              onChange={handleInputChange}
              value={formData.password}
              name="password"
              type="password"
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="পাসওয়ার্ড"
              required
            />

            <button
              type="submit"
              className="w-full py-3 text-sm tracking-wide text-white bg-black hover:bg-[#111] focus:outline-none cursor-pointer"
            >
              রেজিস্টার করুন
            </button>

            <p className="text-sm mt-6 text-center text-gray-800">
              ইতিমধ্যে অ্যাকাউন্ট আছে?
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                এখানে লগইন করুন
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
