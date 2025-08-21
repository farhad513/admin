import React, { useEffect, useState, lazy } from "react";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { admin_login, messageClear } from "../../store/Reducers/authReducer";
const SeoHelmet = lazy(() => import("../components/SEO"));

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  // Input handle optimization
  const inputHandle = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(admin_login(state));
  };

  // Success and error message handling
  useEffect(() => {
    if (successMessage || errorMessage) {
      toast[successMessage ? "success" : "error"](successMessage || errorMessage);
      dispatch(messageClear());
      if (successMessage) navigate("/");
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className="font-[sans-serif] p-4 mt-6">
      <SeoHelmet
        title="অ্যাডমিন লগইন | অ্যাকাউন্টে প্রবেশ করুন"
        description="অ্যাডমিন হিসেবে আমাদের প্ল্যাটফর্মে লগইন করুন এবং প্রশাসনিক কাজ পরিচালনা করুন।"
        keywords="অ্যাডমিন লগইন, প্ল্যাটফর্ম অ্যাকাউন্ট লগইন, একাউন্ট প্রবেশ"
        url="https://www.medifasthealthcare.com/admin-login"
      />

      <div className="flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto shadow-[0_2px_10px_-2px_rgba(195,169,50,0.5)] p-8 relative mt-12 rounded-lg bg-white">
          <div className="w-28 h-28 border-4 border-[#c3a932] absolute left-0 right-0 mx-auto -top-14 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="https://i.ibb.co/Ld6LSNjq/logo-2.png"
              alt="Logo"
              className="w-full h-full object-contain animate-spin-slow"
            />
          </div>

          <form onSubmit={submit} className="mt-12 space-y-4">
            <h3 className="text-xl font-bold text-blue-600 mb-6 text-center">
              অ্যাডমিন লগইন
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
              disabled={loader}
              className="w-full py-3 text-sm tracking-wide text-white bg-black hover:bg-[#111] focus:outline-none cursor-pointer"
            >
              {loader ? (
                <PropagateLoader
                  color="#fff"
                  cssOverride={{
                    display: "flex",
                    margin: "0 auto",
                    height: "24px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              ) : (
                "লগইন করুন"
              )}
            </button>

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
