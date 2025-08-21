import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdLocalHospital } from "react-icons/md";
import {
  AmbulanceAdd,
  messageClear,
} from "../../store/Reducers/ambulanceReducer";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import SeoHelmet from "../components/SEO";

const initialState = {
  ambulanceName: "",
  driverName: "",
  driverPhone: "",
  registrationNumber: "",
  type: "AC",
  chargePerKm: "",
  baseCharge: "",
  insuranceExpiry: "",
  joiningDate: "",
  nidNumber: "",
  category: "Hospital Owned",
  oxygenSupport: "Yes",
  emergencyPhone: "",
};

const AddAmbulancePage = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { successMessage, errorMessage } = useSelector(
    (state) => state.ambulance
  );
  const [formData, setFormData] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memoize options for select fields to prevent unnecessary recalculations
  const typeOptions = useMemo(
    () => [
      { value: "AC", label: "এসি" },
      { value: "Non-AC", label: "নন-এসি" },
      { value: "ICU", label: "আইসিইউ" },
      { value: "Deadbody Carry", label: "মৃতদেহ বহন" },
      { value: "Normal", label: "নরমাল" },
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { value: "Hospital Owned", label: "হাসপাতাল মালিকানাধীন" },
      { value: "Rented", label: "ভাড়াকৃত" },
      { value: "Private Contract", label: "প্রাইভেট কন্ট্রাক্ট" },
    ],
    []
  );

  const oxygenSupportOptions = useMemo(
    () => [
      { value: "Yes", label: "হ্যাঁ" },
      { value: "No", label: "না" },
    ],
    []
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    const banglaOnlyFields = [
      "ambulanceName",
      "driverName",
      "registrationNumber",
      "nidNumber",
      "emergencyPhone",
    ];

    const banglaNumberOnlyFields = ["chargePerKm", "baseCharge"];

    const englishCharRegex = /[a-zA-Z]/;
    const englishNumberRegex = /[0-9]/;
    const nonBanglaNumberRegex = /[^০-৯]/;

    // বাংলা অক্ষরের জন্য
    if (banglaOnlyFields.includes(name)) {
      if (englishCharRegex.test(value) || englishNumberRegex.test(value)) {
        toast.error("অনুগ্রহ করে শুধু বাংলা অক্ষর লিখুন।");
        return;
      }
    }

    // বাংলা সংখ্যার জন্য
    if (banglaNumberOnlyFields.includes(name)) {
      if (nonBanglaNumberRegex.test(value)) {
        toast.error("অনুগ্রহ করে শুধু বাংলা সংখ্যা লিখুন।");
        return;
      }
    }

    if (["driverPhone", "emergencyPhone"].includes(name)) {
      if (nonBanglaNumberRegex.test(value)) {
        toast.error("অনুগ্রহ করে শুধু বাংলা সংখ্যা লিখুন।");
        return;
      }

      if (value.length >= 2) {
        if (!value.startsWith("০১")) {
          toast.error("ফোন নাম্বার অবশ্যই ০১ দিয়ে শুরু হতে হবে।");
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const imageHandle = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        toast.error(
          "শুধুমাত্র JPG, JPEG, PNG অথবা WEBP ফরম্যাটের ছবি আপলোড করুন।"
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error("ছবির সাইজ ২MB এর বেশি হওয়া যাবে না।");
        return;
      }

      // Optional: convert to webp or resize
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 600; // desired max width
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              setImage(blob);
              setImagePreview(URL.createObjectURL(blob));
            },
            "image/webp",
            0.8 // quality (optional)
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!image) {
        toast.error("অনুগ্রহ করে অ্যাম্বুলেন্সের ছবি নির্বাচন করুন।");
        return; // সাবমিট বন্ধ হবে যদি ছবি না থাকে
      }
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) data.append("image", image);

      setLoading(true);
      dispatch(AmbulanceAdd(data));
      console.log(data);
    },
    [dispatch, formData, image]
  );

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      setLoading(false);
    }
    if (successMessage) {
      toast.success(successMessage);
      setFormData(initialState);
      setImagePreview(null);
      setImage(null);
      dispatch(messageClear());
      setLoading(false);
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <SeoHelmet
        title="নতুন অ্যাম্বুলেন্স যুক্ত করুন | Medi Fast Health Care অ্যাডমিন"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে নতুন অ্যাম্বুলেন্স যুক্ত করুন। অ্যাম্বুলেন্সের নাম, ড্রাইভার, রেজিস্ট্রেশন নম্বর, ধরন এবং অন্যান্য তথ্য সহজেই যোগ করুন।"
        keywords="নতুন অ্যাম্বুলেন্স, অ্যাম্বুলেন্স যুক্ত করুন, অ্যাম্বুলেন্স ম্যানেজমেন্ট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
      />

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl p-8 text-center shadow-lg mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          🚑 নতুন অ্যাম্বুলেন্স যোগ করুন
        </h1>
        <p className="text-lg font-medium">
          নতুন অ্যাম্বুলেন্সের তথ্য যুক্ত করুন দ্রুত ও সহজে!
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        {/** Form Groups */}
        <FormGroup
          label="অ্যাম্বুলেন্সের নাম"
          name="ambulanceName"
          value={formData.ambulanceName}
          onChange={handleChange}
          placeholder="অ্যাম্বুলেন্সের নাম লিখুন"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup
            label="ড্রাইভারের নাম"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            placeholder="ড্রাইভারের নাম"
            required
          />
          <FormGroup
            label="ড্রাইভারের ফোন"
            name="driverPhone"
            value={formData.driverPhone}
            onChange={handleChange}
            placeholder="ফোন নাম্বার"
            required
            maxLength={11}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup
            label="গাড়ির রেজিস্ট্রেশন নাম্বার"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="রেজিস্ট্রেশন নাম্বার"
            required
          />
          <SelectGroup
            label="গাড়ির ধরন"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup
            label="প্রতি কিলোমিটারে চার্জ"
            name="chargePerKm"
            value={formData.chargePerKm}
            onChange={handleChange}
            placeholder="চার্জ (৳)"
            type="text"
            required
          />
          <FormGroup
            label="বেস চার্জ"
            name="baseCharge"
            value={formData.baseCharge}
            onChange={handleChange}
            placeholder="বেস চার্জ (৳)"
            type="text"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup
            label="ইন্সুরেন্স মেয়াদ"
            name="insuranceExpiry"
            value={formData.insuranceExpiry}
            onChange={handleChange}
            type="date"
            required
          />
          <FormGroup
            label="জয়েনিং তারিখ"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            type="date"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup
            label="পরিচয়পত্র নাম্বার"
            name="nidNumber"
            value={formData.nidNumber}
            onChange={handleChange}
            placeholder="পরিচয়পত্র নাম্বার"
            required
          />
          <FormGroup
            label="জরুরি যোগাযোগ নাম্বার"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="ফোন নাম্বার"
            required
            maxLength={11}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup
            label="অ্যাম্বুলেন্স ক্যাটাগরি"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
          />
          <SelectGroup
            label="অক্সিজেন সাপোর্ট আছে?"
            name="oxygenSupport"
            value={formData.oxygenSupport}
            onChange={handleChange}
            options={oxygenSupportOptions}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="image" className="mb-4">
            অ্যাম্বুলেন্স ছবির যোগ করুন
          </label>
          <div className="relative mb-4">
            <input
              type="file"
              id="image"
              name="image"
              onChange={imageHandle}
              accept="image/*"
              className="hidden"
            />
            <div className="border border-dashed p-4 rounded-md">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full"
                  >
                    <IoCloseSharp />
                  </button>
                </div>
              ) : (
                <label htmlFor="image" className="cursor-pointer ">
                  <BsImages size={40} />
                  <p>ছবি নির্বাচন করুন</p>
                </label>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 text-white text-lg font-semibold py-3 rounded-lg transition duration-200 ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <MdLocalHospital size={22} />
          {loading ? "যোগ করা হচ্ছে..." : "অ্যাম্বুলেন্স যোগ করুন"}
        </button>
      </form>
    </div>
  );
};

const FormGroup = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  maxLength,
}) => (
  <div>
    <label className="block text-lg font-bold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className="w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
    />
  </div>
);

const SelectGroup = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-lg font-bold text-gray-700 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default AddAmbulancePage;
