/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_all_doctor_admin } from "../../store/Reducers/doctorReducer";
import SeoHelmet from "../components/SEO";
import { get_category } from "../../store/Reducers/categoryReducer";

const AllDoctors = () => {
  const dispatch = useDispatch();
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [parPage, setParPage] = useState(12);

  const [filterData, setFilterData] = useState({
    division: "",
    district: "",
    upazila: "",
    category: "",
  });
  useEffect(() => {
    dispatch(get_category());
  }, []);
  const { doctors, totalDoctor, loading } = useSelector(
    (state) => state.doctor
  );
  console.log(doctors);
  const { categorys, totalCategory } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(
      get_all_doctor_admin({
        parPage: parseInt(parPage),
        page: parseInt(pageNumber),
        division: filterData.division,
        district: filterData.district,
        upazila: filterData.upazila,
        category: filterData.category,
      })
    );
  }, [pageNumber, filterData]);

  const handleSearch = () => {
    const divisionName = divisions.find(
      (d) => d.id === selectedDivision
    )?.bn_name;
    const districtName = districts.find(
      (d) => d.id === selectedDistrict
    )?.bn_name;
    const upazilaName = upazilas.find((u) => u.id === selectedUpazila)?.bn_name;

    setFilterData({
      division: divisionName || "",
      district: districtName || "",
      upazila: upazilaName || "",
      category: selectedCategory || "",
    });

    setPageNumber(1);
  };

// Helper function: 12-ঘন্টা ফরম্যাটে বাংলা সময় দেখাবে
const formatBanglaTime12Hour = (time) => {
  if (!time) return "N/A";
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minuteStr = minute;

  // সময়ের ভাগ (সকাল, দুপুর, বিকাল, রাত)
  let partOfDay = "";
  if (hour >= 5 && hour < 12) partOfDay = "সকাল";
  else if (hour >= 12 && hour < 15) partOfDay = "দুপুর";
  else if (hour >= 15 && hour < 18) partOfDay = "বিকাল";
  else partOfDay = "রাত";

  // 12-ঘণ্টার রূপান্তর
  let displayHour = hour % 12 || 12;

  // বাংলায় সংখ্যা রূপান্তর
  const toBanglaNumber = (num) =>
    num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  return `${partOfDay} ${toBanglaNumber(displayHour)}:${toBanglaNumber(
    minuteStr
  )}`;
};




// ✅ Doctor Card Renderer
const renderDoctors = () => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="grid place-items-center min-h-[200px] col-span-full">
        <p className="text-center text-xl text-red-500">
          কোনো ডাক্তার পাওয়া যায়নি। আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return doctors.map((doctor, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
    >
      <img
        src={doctor.doctorImage}
        alt={doctor.doctorName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-800">
          {doctor.doctorName}
        </h2>
        <p className="text-sm text-gray-600">
          {doctor?.doctorCategory || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">অভিজ্ঞতা:</span>{" "}
          {doctor.doctorExperience || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          {doctor.hospitalName || "N/A"}
        </p>
        <div>
          {doctor.doctorSlots && doctor.doctorSlots.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
{doctor.doctorSlots.map((slot, idx) => (
  <span
    key={idx}
    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
  >
    {slot.day} - {formatBanglaTime12Hour(slot.startTime)} -{" "}
    {formatBanglaTime12Hour(slot.endTime)}
  </span>
))}
            </div>
          ) : (
            <span className="ml-2 text-gray-500">N/A</span>
          )}
        </div>
      </div>
    </div>
  ));
};


  // Load divisions
  useEffect(() => {
    fetch("https://bdapi.vercel.app/api/v.1/division")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDivisions(data.data);
        }
      })
      .catch((err) => console.error("Divisions Fetch Error:", err));
  }, []);

  // Load districts
  useEffect(() => {
    if (selectedDivision) {
      fetch(`https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDistricts(data.data);
          }
        })
        .catch((err) => console.error("Districts Fetch Error:", err));
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [selectedDivision]);

  // Load upazilas
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUpazilas(data.data);
          }
        })
        .catch((err) => console.error("Upazilas Fetch Error:", err));
    } else {
      setUpazilas([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: 0,
    });
  }, []);

  return (
    <div>
      <SeoHelmet
        title={"ডাক্তার লিস্ট | আপনার নিকটস্থ ডাক্তার খুঁজুন - স্বাস্থ্য সেবা"}
        description={
          "বাংলাদেশের সকল বিভাগের ডাক্তারদের তালিকা দেখুন। আপনার এলাকার সেরা ডাক্তার খুঁজুন এবং তাদের অভিজ্ঞতা ও যোগাযোগের বিস্তারিত তথ্য জেনে নিন।"
        }
        keywords={
          "বাংলাদেশ ডাক্তার, ডাক্তার তালিকা, স্বাস্থ্য সেবা, ঢাকা ডাক্তার, চক্ষু ডাক্তার, শিশু বিশেষজ্ঞ, চিকিৎসা কেন্দ্র, ডাক্তার ঠিকানা"
        }
        url={"https://medifasthealthcare.com/our-doctors"}
      />

      {/* Filters */}
      {doctors && (
        <div className="max-w-7xl max-lg:max-w-2xl mx-auto px-3">
          <div className="grid lg:grid-cols-5 sm:grid-cols-2 gap-2 max-sm:max-w-sm max-sm:mx-auto mt-5">
            {/* Division */}
            <select
              className="border p-2 rounded w-full mb-3"
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option value="">-- বিভাগ নির্বাচন করুন --</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.bn_name}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              className="border p-2 rounded w-full mb-3"
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

            {/* Upazila */}
            <select
              className="border p-2 rounded w-full mb-3"
              disabled={!selectedDistrict}
              onChange={(e) => setSelectedUpazila(e.target.value)}
            >
              <option value="">-- উপজেলা নির্বাচন করুন --</option>
              {upazilas.map((upa) => (
                <option key={upa.id} value={upa.id}>
                  {upa.bn_name}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              className="border p-2 rounded w-full mb-3"
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={
                !selectedDivision || !selectedDistrict || !selectedUpazila
              }
            >
              <option value="">
                {!selectedDivision || !selectedDistrict || !selectedUpazila
                  ? "-- আগে বিভাগ, জেলা ও উপজেলা নির্বাচন করুন --"
                  : "-- ক্যাটাগরি নির্বাচন করুন --"}
              </option>
              {selectedDivision &&
                selectedDistrict &&
                selectedUpazila &&
                categorys.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>

            {/* Search button */}
            <button
              onClick={handleSearch}
              type="button"
              disabled={
                loading ||
                !selectedDivision ||
                !selectedDistrict ||
                !selectedUpazila
              }
              className={`px-2 h-10 font-semibold w-full tracking-wide ml-auto outline-none border-none rounded
    ${
      loading || !selectedDivision || !selectedDistrict || !selectedUpazila
        ? "bg-gray-400 cursor-not-allowed text-white "
        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
    }
  `}
            >
              {loading ? " অপেক্ষা করুন..." : "অনুসন্ধান করুন"}
            </button>
          </div>
        </div>
      )}

      {/* Doctors List */}
      <div className="font-[sans-serif]">
        <div className="p-4 mx-auto lg:max-w-7xl md:max-w-4xl sm:max-w-xl max-sm:max-w-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {renderDoctors()}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {/* Pagination */}
      {totalDoctor > parPage && doctors.length > 0 && (
        <div className="mt-6 pb-5  flex justify-center">
          <Pagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalItem={totalDoctor}
            parPage={parPage}
            showItem={Math.floor(totalDoctor / parPage)}
          />
        </div>
      )}
    </div>
  );
};

export default AllDoctors;
