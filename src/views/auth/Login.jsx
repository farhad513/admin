import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { messageClear, hospital_login } from "../../store/Reducers/authReducer";
import SeoHelmet from "../components/SEO";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(hospital_login(state));
  };

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
        title="হাসপাতাল লগইন | অ্যাকাউন্টে প্রবেশ করুন"
        description="বাংলাদেশের সকল হাসপাতাল এখন আমাদের প্ল্যাটফর্মে লগইন করুন এবং পরিচালনা করুন।"
        keywords="হাসপাতাল লগইন, বাংলাদেশ হাসপাতাল লগইন, একাউন্ট প্রবেশ"
        url="https://www.medifasthealthcare.com/login"
      />

      <div className="flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto shadow-[0_2px_10px_-2px_rgba(195,169,50,0.5)] p-8 relative mt-12 rounded-lg bg-white">
          <div className="w-28 h-28 border-4 border-[#c3a932] absolute left-0 right-0 mx-auto -top-14 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="https://i.ibb.co/Ld6LSNjq/logo-2.png"
              alt="logo"
              className="w-full h-full object-contain animate-spin-slow"
            />
          </div>

          <form onSubmit={submit} className="mt-12 space-y-4">
            <h3 className="text-xl font-bold text-blue-600 mb-6 text-center">
            হাসপাতাল লগইন করুন
            </h3>

            <input
              onChange={inputHandle}
              value={state.email}
              name="email"
              type="email"
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="ইমেইল"
              required
            />

            <input
              onChange={inputHandle}
              value={state.password}
              name="password"
              type="password"
              className="bg-gray-100 w-full text-sm px-4 py-3 border focus:bg-transparent focus:border-black outline-none transition-all"
              placeholder="পাসওয়ার্ড"
              required
            />

            <button
              type="submit"
              disabled={loader ? true : false}
              className="w-full py-3 text-sm tracking-wide text-white bg-black hover:bg-[#111] focus:outline-none cursor-pointer"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "লগইন করুন"
              )}
            </button>

            <p className="text-sm mt-6 text-center text-gray-800">
              একাউন্ট নেই?
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                রেজিস্টার করুন
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
