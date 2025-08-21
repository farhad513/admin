import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdLocalHospital } from "react-icons/md";
import {
  GetAmbulance,
  update_ambulance,
  ambulance_image_update,
  messageClear,
} from "../../store/Reducers/ambulanceReducer";
import SeoHelmet from "../components/SEO";

const EditAmbulancePage = () => {
  const dispatch = useDispatch();
  const { ambulanceId } = useParams();

  const { ambulance, successMessage, errorMessage } = useSelector(
    (state) => state.ambulance
  );
  const [formData, setFormData] = useState({
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
  });

  const [imageShow, setImageShow] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    dispatch(GetAmbulance(ambulanceId));
  }, [dispatch, ambulanceId]);

  useEffect(() => {
    if (ambulance) {
      setFormData({
        ambulanceName: ambulance.ambulanceName || "",
        driverName: ambulance.driverName || "",
        driverPhone: ambulance.driverPhone || "",
        registrationNumber: ambulance.registrationNumber || "",
        type: ambulance.type || "",
        chargePerKm: ambulance.chargePerKm || "",
        baseCharge: ambulance.baseCharge || "",
        insuranceExpiry: ambulance.insuranceExpiry?.slice(0, 10) || "",
        joiningDate: ambulance.joiningDate?.slice(0, 10) || "",
        nidNumber: ambulance.nidNumber || "",
        category: ambulance.category || "",
        oxygenSupport: ambulance.oxygenSupport || "",
        emergencyPhone: ambulance.emergencyPhone || "",
      });
      setImageShow(ambulance.image);
    }
  }, [ambulance]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 আলাদা Image Update Function
  const changeImage = (img, files) => {
    if (files.length === 0) {
      toast.error("অনুগ্রহ করে একটি ছবি সিলেক্ট করুন।");
      return;
    }

    const file = files[0];

    // Check file type (only image)
    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে।");
      return;
    }

    // Optional: Check file size (e.g. 2MB max)
    const maxSizeInMB = 2;
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error(`ইমেজ ${maxSizeInMB}MB এর বেশি হতে পারবে না।`);
      return;
    }

    // dispatch data with validation
    dispatch(
      ambulance_image_update({
        oldPublicId: img.public_id, // ✅ must use public_id here
        newImage: file,
        ambulanceId: ambulanceId,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(
      update_ambulance({
        ...formData,
        ambulanceId,
      })
    );
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      setLoading(false);
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setLoading(false);
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <SeoHelmet
  title="অ্যাম্বুলেন্স সম্পাদনা করুন | Medi Fast Health Care অ্যাডমিন"
  description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে বিদ্যমান অ্যাম্বুলেন্সের তথ্য সহজেই আপডেট করুন। ড্রাইভার, ধরন, রেজিস্ট্রেশন ও অন্যান্য তথ্য পরিবর্তন করে দ্রুত এবং সুরক্ষিত সেবা নিশ্চিত করুন।"
  keywords="অ্যাম্বুলেন্স এডিট, অ্যাম্বুলেন্স সম্পাদনা, অ্যাম্বুলেন্স আপডেট, Medi Fast Health Care, অ্যাডমিন ড্যাশবোর্ড"
/>

      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl p-8 text-center shadow-lg mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          🚑 অ্যাম্বুলেন্স আপডেট করুন
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <FormGroup
          label="অ্যাম্বুলেন্সের নাম"
          name="ambulanceName"
          value={formData.ambulanceName}
          onChange={handleChange}
        />
        <FormGroup
          label="ড্রাইভারের নাম"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
        />
        <FormGroup
          label="ড্রাইভারের ফোন"
          name="driverPhone"
          value={formData.driverPhone}
          onChange={handleChange}
        />
        <FormGroup
          label="রেজিস্ট্রেশন নাম্বার"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
        <SelectGroup
          label="গাড়ির ধরন"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
        />
        <FormGroup
          label="প্রতি কিলোমিটারে চার্জ"
          name="chargePerKm"
          value={formData.chargePerKm}
          onChange={handleChange}
        />
        <FormGroup
          label="বেস চার্জ"
          name="baseCharge"
          value={formData.baseCharge}
          onChange={handleChange}
        />
        <FormGroup
          label="ইন্সুরেন্স মেয়াদ"
          name="insuranceExpiry"
          value={formData.insuranceExpiry}
          onChange={handleChange}
          type="date"
        />
        <FormGroup
          label="জয়েনিং তারিখ"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          type="date"
        />
        <FormGroup
          label="পরিচয়পত্র নাম্বার"
          name="nidNumber"
          value={formData.nidNumber}
          onChange={handleChange}
        />
        <FormGroup
          label="জরুরি ফোন"
          name="emergencyPhone"
          value={formData.emergencyPhone}
          onChange={handleChange}
        />
        <SelectGroup
          label="ক্যাটাগরি"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
        />
        <SelectGroup
          label="অক্সিজেন সাপোর্ট"
          name="oxygenSupport"
          value={formData.oxygenSupport}
          onChange={handleChange}
          options={oxygenSupportOptions}
        />

        {/* Image Upload */}
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 w-full text-[#d0d2d6] mb-4">
          {imageShow && imageShow.url && (
            <div>
              <label className="h-[180px]" htmlFor="doctor-image">
                <img
                  className="h-full w-full object-cover"
                  src={imageShow.url}
                  alt=""
                />
              </label>
              <input
                onChange={(e) => changeImage(imageShow, e.target.files)}
                type="file"
                id="doctor-image"
                className="hidden"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 text-white text-lg font-semibold py-3 rounded-lg ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <MdLocalHospital size={22} />
          {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
        </button>
      </form>
    </div>
  );
};

const FormGroup = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-lg font-bold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
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

export default EditAmbulancePage;
