import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-7xl font-extrabold text-indigo-600 dark:text-indigo-400 drop-shadow-lg">404</h2>
          <p className="mt-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">পেজ পাওয়া যায়নি!</p>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            দুঃখিত, আপনি যে পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি।
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/hospital/dashboard"
            className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m-9-9l9 9-9 9" />
            </svg>
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
              যদি এটা কোনো ভুল হয়ে থাকে, আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
