/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { BsImages } from "react-icons/bs";
import { PropagateLoader, FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { overrideStyle } from "../../utils/utils";
import {
  profile_image_upload,
  messageClear,
  profile_info_add,
} from "../../store/Reducers/authReducer";
import SeoHelmet from "../components/SEO";

const Profile = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [license, setLicense] = useState("");
  const [website, setWebsite] = useState("");
  const [emergency, setEmergency] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [pathologyDiscount, setPathologyDiscount] = useState("");
  const [billDiscount, setBillDiscount] = useState("");
  const dispatch = useDispatch();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  console.log(userInfo);
  const banglaTimes = [
    "সকাল ৬টা",
    "সকাল ৭টা",
    "সকাল ৮টা",
    "সকাল ৯টা",
    "সকাল ১০টা",
    "সকাল ১১টা",
    "দুপুর ১২টা",
    "দুপুর ১টা",
    "দুপুর ২টা",
    "দুপুর ৩টা",
    "বিকেল ৪টা",
    "বিকেল ৫টা",
    "সন্ধ্যা ৬টা",
    "সন্ধ্যা ৭টা",
    "রাত ৮টা",
    "রাত ৯টা",
    "রাত ১০টা",
    "রাত ১১টা",
  ];

  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      dispatch(profile_image_upload(formData));
    }
  };

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

  const add = (e) => {
    e.preventDefault();
    if (!type) {
      toast.error("দয়া করে হাসপাতালের ধরণ নির্বাচন করুন!");
      return;
    }
    if (!license) {
      toast.error("দয়া করে হাসপাতালের লাইসেন্স নম্বর বাংলায় লিখুন!");
      return;
    }

    if (website && !validateWebsiteURL(website)) {
      toast.error("দয়া করে একটি সঠিক ওয়েবসাইট লিংক দিন!");
      return;
    }

    if (!emergency) {
      toast.error("দয়া করে হাসপাতালের জরুরি সেবার অবস্থা লিখুন!");
      return;
    }
    if (!openingTime) {
      toast.error("দয়া করে হাসপাতালের খোলার সময় দিন!");
      return;
    }
    if (!closingTime) {
      toast.error("দয়া করে হাসপাতালের বন্ধের সময় দিন!");
      return;
    }
    if (!pathologyDiscount) {
      toast.error("দয়া করে প্যাথলজি ডিসকাউন্টের তথ্য দিন!");
      return;
    }
    if (type == "সাধারণ হাসপাতাল" && !billDiscount) {
      toast.error("দয়া করে বিল ডিসকাউন্ট সিলেক্ট করুন!");
      return;
    }
    if (!address) {
      toast.error("দয়া করে হাসপাতালের ঠিকানা বাংলায় লিখুন!");
      return;
    }

    const divisionName = divisions.find(
      (d) => d.id === selectedDivision
    )?.bn_name;
    const districtName = districts.find(
      (d) => d.id === selectedDistrict
    )?.bn_name;
    const upazilaName = upazilas.find((u) => u.id === selectedUpazila)?.bn_name;

    const obj = {
      division: divisionName,
      district: districtName,
      upazila: upazilaName,
      address,
      type,
      license,
      website,
      emergency,
      openingTime,
      closingTime,
      billDiscount,
      pathologyDiscount,
    };
    dispatch(profile_info_add(obj));
  };

  useEffect(() => {
    fetch("https://bdapi.vercel.app/api/v.1/division")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDivisions(data.data);
      })
      .catch((err) => console.error("বিভাগ লোড করতে সমস্যা হয়েছে:", err));
  }, []);

  useEffect(() => {
    if (selectedDivision) {
      fetch(`https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setDistricts(data.data);
        })
        .catch((err) => console.error("জেলা লোড করতে সমস্যা হয়েছে:", err));
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [selectedDivision]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUpazilas(data.data);
        })
        .catch((err) => console.error("উপজেলা লোড করতে সমস্যা হয়েছে:", err));
    } else {
      setUpazilas([]);
    }
  }, [selectedDistrict]);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    const banglaPattern = /^[\u0980-\u09FF\s,.\-()]+$/;

    if (value === "" || banglaPattern.test(value)) {
      setAddress(value);
    } else {
      toast.error("শুধুমাত্র বাংলায় লিখুন!");
    }
  };
  const handleLicenseChange = (e) => {
    const value = e.target.value;
    const banglaPattern = /^[\u0980-\u09FF\s,.\-()]+$/;

    if (value === "" || banglaPattern.test(value)) {
      setLicense(value);
    } else {
      toast.error("শুধুমাত্র বাংলায় লাইসেন্স নম্বর লিখুন!");
    }
  };
  const handleWebsiteChange = (e) => {
    const value = e.target.value;
    const banglaPattern = /[\u0980-\u09FF]/;

    if (banglaPattern.test(value)) {
      toast.error("দয়া করে সঠিক ওয়েবসাইট লিংক ইংরেজিতে দিন!");
      return;
    }

    setWebsite(value);
  };

  const validateWebsiteURL = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-./?%&=]*)?$/i;
    return urlPattern.test(url);
  };
  return (
    <div className="px-2 lg:px-7 py-5">
      <SeoHelmet
        title="প্রোফাইল | Medi Fast Health Care"
        description="Medi Fast Health Care প্রোফাইল পেজ থেকে আপনার ব্যক্তিগত তথ্য, যোগাযোগের নম্বর, পাসওয়ার্ড ও অন্যান্য সেটিংস সহজেই ম্যানেজ করুন।"
        keywords="প্রোফাইল, ইউজার প্রোফাইল, অ্যাকাউন্ট সেটিংস, Medi Fast Health Care, ইউজার ড্যাশবোর্ড"
        url="https://medifasthealthcare.com/hospital/dashboard/profile"
      />

      <div className="w-full flex flex-wrap">
        <div className="w-full ">
          <div className="w-full p-4 bg-[#fff] rounded-md text-[#000]">
            <div className="py-2 flex gap-2 items-center justify-start">
              <marquee behavior="scroll" direction="left">
                ব্যবহারকারীর নিরাপত্তার কারণে এই তথ্য আপডেট করার সুবিধা বন্ধ
                রয়েছে। অনুগ্রহ করে অ্যাডমিনের সহায়তা নিন। মোবাইল:- ০১৭০৮-৭৬৯৫১৩
              </marquee>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center py-5 gap-5">
              {/* Image Upload Section */}
              <div className="flex justify-center items-center w-full md:w-6/12">
                {userInfo?.image ? (
                  <label
                    htmlFor="img"
                    className="h-[210px] w-[350px] relative p-3 cursor-pointer overflow-hidden md:px-5"
                  >
                    <img
                      className="w-full h-full rounded-md"
                      src={userInfo.image}
                      alt="Profile"
                    />
                    {loader && (
                      <div className="absolute inset-0 bg-slate-600 opacity-70 flex justify-center items-center z-20">
                        <FadeLoader color="#fff" />
                      </div>
                    )}
                  </label>
                ) : (
                  <label
                    htmlFor="img"
                    className="flex flex-col items-center justify-center h-[210px] w-[350px] cursor-pointer border border-dashed hover:border-indigo-500 border-[#000] relative rounded-md"
                  >
                    <BsImages className="text-4xl mb-2" />
                    <span className="text-sm">ছবি নির্বাচন করুন</span>
                    {loader && (
                      <div className="absolute inset-0 bg-slate-600 opacity-70 flex justify-center items-center z-20">
                        <FadeLoader color="#fff" />
                      </div>
                    )}
                  </label>
                )}
                <input
                  onChange={add_image}
                  type="file"
                  className="hidden"
                  id="img"
                />
              </div>

              <div className="w-full md:w-6/12 px-2 md:px-5">
                <div className="flex flex-col gap-2 p-4 bg-[#f2f2f2] rounded-md text-sm text-black relative">
                  <div className="flex gap-2">
                    <span className="font-medium">নাম :</span>
                    <span>{userInfo.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">ইমেইল :</span>
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">রোল :</span>
                    <span>{userInfo.role}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">স্ট্যাটাস :</span>
                    <span>{userInfo.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-0 md:px-5 py-2">
              {userInfo?.profileUpdated !== true ? (
                <form onSubmit={add}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col w-full gap-1">
                      <label>হাসপাতালের ধরণ</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                      >
                        <option value="">হাসপাতাল নির্বাচন করুন</option>
                        <option value="সরকারি">সরকারি</option>
                        <option value="বেসরকারি">বেসরকারি</option>
                        <option value="ডায়াগনস্টিক সেন্টার">
                          ডায়াগনস্টিক সেন্টার
                        </option>
                        <option value="সাধারণ হাসপাতাল">সাধারণ হাসপাতাল</option>
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>লাইসেন্স নম্বর</label>
                      <input
                        type="text"
                        value={license}
                        onChange={handleLicenseChange}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                        placeholder="লাইসেন্স নম্বর"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>ওয়েবসাইট লিঙ্ক</label>
                      <input
                        type="text"
                        value={website}
                        onChange={handleWebsiteChange}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                        placeholder="ওয়েবসাইট লিঙ্ক"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="text-[#000]">
                        ইমারজেন্সি সেবা (আছে/নেই)
                      </label>
                      <select
                        value={emergency}
                        onChange={(e) => setEmergency(e.target.value)}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                      >
                        <option value="">সিলেক্ট করুন</option>
                        <option value="আছে">আছে</option>
                        <option value="নেই">নেই</option>
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>ওপেনিং সময়</label>
                      <select
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                      >
                        <option value="">ওপেনিং সময় নির্বাচন করুন</option>
                        {banglaTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full gap-1">
                      <label>ক্লোজিং সময়</label>
                      <select
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                      >
                        <option value="">ক্লোজিং সময় নির্বাচন করুন</option>
                        {banglaTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full gap-1">
                      <label className="text-[#000]">
                        ডিসকাউন্ট (প্যাথলজি টেস্ট)
                      </label>
                      <select
                        value={pathologyDiscount}
                        onChange={(e) => setPathologyDiscount(e.target.value)}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                      >
                        <option value="">ডিসকাউন্ট সিলেক্ট করুন</option>
                        <option value="১০%">১০%</option>
                        <option value="২০%">২০%</option>
                        <option value="৩০%">৩০%</option>
                        <option value="৪০%">৪০%</option>
                        <option value="৫০%">৫০%</option>
                        <option value="৬০%">৬০%</option>
                      </select>
                    </div>
                    {type == "সাধারণ হাসপাতাল" && (
                      <div className="flex flex-col w-full gap-1">
                        <label className="text-[#000]">
                          হাসপাতাল বিল ডিসকাউন্ট
                        </label>
                        <select
                          value={billDiscount}
                          onChange={(e) => setBillDiscount(e.target.value)}
                          className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] w-full"
                        >
                          <option value="">ডিসকাউন্ট সিলেক্ট করুন</option>
                          <option value="১০%">১০%</option>
                          <option value="২০%">২০%</option>
                          <option value="৩০%">৩০%</option>
                          <option value="৪০%">৪০%</option>
                          <option value="৫০%">৫০%</option>
                          <option value="৬০%">৬০%</option>
                        </select>
                      </div>
                    )}
                    <div className="flex flex-col w-full gap-1">
                      <label>বিভাগ</label>
                      <select
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                        onChange={(e) => setSelectedDivision(e.target.value)}
                      >
                        <option value="">-- বিভাগ নির্বাচন করুন --</option>
                        {divisions.map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.bn_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>জেলা</label>
                      <select
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedDivision}
                      >
                        <option value="">-- জেলা নির্বাচন করুন --</option>
                        {districts.map((dist) => (
                          <option key={dist.id} value={dist.id}>
                            {dist.bn_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>উপজেলা</label>
                      <select
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                        onChange={(e) => setSelectedUpazila(e.target.value)}
                        disabled={!selectedDistrict}
                      >
                        <option value="">-- উপজেলা নির্বাচন করুন --</option>
                        {upazilas.map((upa) => (
                          <option key={upa.id} value={upa.id}>
                            {upa.bn_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label>ঠিকানা</label>
                      <input
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                        className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                        placeholder="ঠিকানা বাংলায় লিখুন"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loader}
                    className="bg-blue-500 w-[190px] text-white rounded-md px-7 py-2 mt-4 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    {loader ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={overrideStyle}
                      />
                    ) : (
                      "সংরক্ষণ করুন"
                    )}
                  </button>
                </form>
              ) : (
                <div className="w-full md:w-6/12 px-2 md:px-5">
                  <div className="flex flex-col gap-2 p-4 bg-[#f2f2f2] rounded-md text-sm text-black relative">
                    <div className="flex gap-2">
                      <span className="font-medium">হাসপাতালের ধরণ :</span>
                      <span>{userInfo.type}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">লাইসেন্স নম্বর :</span>
                      <span>{userInfo.license}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">ওয়েবসাইট লিঙ্ক :</span>
                      <span>{userInfo.website}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">
                        ইমারজেন্সি সেবা (আছে/নেই) :
                      </span>
                      <span>{userInfo.emergency}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">ওপেনিং সময় :</span>
                      <span>{userInfo.openingTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">ক্লোজিং সময় :</span>
                      <span>{userInfo.closingTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">
                        ডিসকাউন্ট (প্যাথলজি টেস্ট) :
                      </span>
                      <span>{userInfo.pathologyDiscount}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">
                        ডিসকাউন্ট (প্যাথলজি টেস্ট) :
                      </span>
                      <span>{userInfo.billDiscount}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">বিভাগ :</span>
                      <span>{userInfo.division}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">জেলা :</span>
                      <span>{userInfo.district}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">উপজেলা :</span>
                      <span>{userInfo.upazila}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">ঠিকানা :</span>
                      <span>{userInfo.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
