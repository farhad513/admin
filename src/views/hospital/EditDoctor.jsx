/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { get_category } from "../../store/Reducers/categoryReducer";
import {
  get_doctor,
  messageClear,
  update_doctor,
  doctor_image_update,
} from "../../store/Reducers/doctorReducer";
import JoditEditor from "jodit-react";
import { overrideStyle } from "../../utils/utils";
import { IoCloseSharp } from "react-icons/io5";
import SeoHelmet from "../components/SEO";

const EditDoctor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { doctorId } = useParams();
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { doctor, loader, errorMessage, successMessage } = useSelector(
    (state) => state.doctor
  );
  console.log(categorys);
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState({ day: "", startTime: "", endTime: "" });
  const handleSlotChange = (e) => {
    setSlot((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const addSlot = () => {
    if (slot.day && slot.startTime && slot.endTime) {
      setSlots((prev) => [...prev, slot]);
      setSlot({ day: "", startTime: "", endTime: "" });
    } else {
      toast.error("দয়া করে সব স্লট ফিল্ড পূর্ণ করুন");
    }
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    dispatch(get_category({ searchValue: "", parPage: "", page: "" }));
  }, []);

  const [state, setState] = useState({
    name: "",
    description: "",
    experience: "",
    fee: "",
    qualification: "",
  });
  const isBengali = (text) => /^[\u0980-\u09FF\s,।ঃ().]*$/.test(text);

  const inputHandle = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (
        (name === "name" || name === "qualification") &&
        value &&
        !isBengali(value)
      ) {
        toast.error("অনুগ্রহ করে বাংলা অক্ষরে  লিখুন।");
        return;
      }
      if (
        (name === "experience" || name === "fee") &&
        value &&
        !isBengali(value)
      ) {
        toast.error("অনুগ্রহ করে বাংলা অক্ষরে  লিখুন।");
        return;
      }

      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [] // empty dependencies to avoid re-renders
  );
  useEffect(() => {
    dispatch(get_doctor(doctorId));
  }, [doctorId]);

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [imageShow, setImageShow] = useState([]);
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
      doctor_image_update({
        oldPublicId: img.public_id, // ✅ must use public_id here
        newImage: file,
        doctorId: doctorId,
      })
    );
  };

  useEffect(() => {
    setState({
      name: doctor.name,
      description: doctor.description,
      experience: doctor.experience,
      fee: doctor.fee,
      qualification: doctor.qualification,
    });
    setContent(doctor.description);
    setCategory(doctor.category);
    setImageShow(doctor.image);
    setSlots(doctor.slots || []);
  }, [doctor]);
  useEffect(() => {
    if (categorys.length > 0) {
      setAllCategory(categorys);
    }
  }, [categorys]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const update = (e) => {
    e.preventDefault();
    if (
      !state.name ||
      !state.fee ||
      !state.qualification ||
      !state.experience ||
      !category ||
      !content
    ) {
      toast.error("অনুগ্রহ করে সব ফিল্ড পূর্ণ করুন!");
      return;
    }

    const obj = {
      name: state.name,
      description: content,
      experience: state.experience,
      fee: state.fee,
      qualification: state.qualification,
      doctorId: doctorId,
      slots,
      category,
    };
    dispatch(update_doctor(obj));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="ডাক্তার তথ্য সম্পাদনা | Medi Fast Health Care"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে বিদ্যমান ডাক্তারের নাম, বিভাগ, অভিজ্ঞতা, যোগ্যতা ও প্রোফাইল তথ্য সহজেই আপডেট বা সম্পাদনা করুন।"
        keywords="ডাক্তার এডিট, ডাক্তার সম্পাদনা, ডাক্তার আপডেট, Medi Fast Health Care, ডাক্তার ম্যানেজমেন্ট"
        url="https://medifasthealthcare.com/hospital/dashboard/edit-doctor/"
      />

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000] text-xl font-semibold">
            ডাক্তারের তথ্য সম্পাদনা করুন
          </h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/hospital/dashboard/doctors"
          >
            সকল ডাক্তার
          </Link>
        </div>

        <form onSubmit={update}>
          {/* নাম ও অভিজ্ঞতা */}
          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000]">
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="name">ডাক্তারের নাম</label>
              <input
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.name}
                type="text"
                placeholder="ডাক্তারের নাম"
                name="name"
                id="name"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="experience">অভিজ্ঞতা (বছর)</label>
              <input
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.experience}
                type="text"
                min="0"
                placeholder="অভিজ্ঞতা"
                name="experience"
                id="experience"
                maxLength={2}
              />
            </div>
          </div>

          {/* ক্যাটাগরি ও কোয়ালিফিকেশন */}
          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000]">
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="category">বিশেষত্ব</label>
              <input
                readOnly
                onClick={() => setCateShow(!cateShow)}
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
                value={category}
                type="text"
                placeholder="-- ক্যাটাগরি নির্বাচন করুন --"
                id="category"
              />
              <div
                className={`absolute top-[101%] bg-white w-full transition-all ${
                  cateShow ? "scale-100 z-[100000]" : "scale-0"
                }`}
              >
                <div className="w-full px-4 py-2 fixed">
                  <input
                    value={searchValue}
                    onChange={categorySearch}
                    className="px-3 py-1 w-full border border-slate-700 rounded-md"
                    type="text"
                    placeholder="ক্যাটাগরি খুঁজুন..."
                  />
                </div>
                <div className="pt-14"></div>
                <div className="flex flex-col h-[200px] overflow-y-scroll">
                  {allCategory.map((c, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${
                        category === c.name && "bg-indigo-500"
                      }`}
                      onClick={() => {
                        setCateShow(false);
                        setCategory(c.name);
                        setSearchValue("");
                        setAllCategory(categorys);
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-1">
              <label htmlFor="qualification">যোগ্যতা</label>
              <input
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.qualification}
                placeholder="ডাক্তারের যোগ্যতা"
                name="qualification"
                id="qualification"
              />
            </div>
          </div>

          {/* ফি */}
          <div className="flex flex-col mb-3 w-full text-[#000]">
            <label htmlFor="fee">পরামর্শ ফি (টাকা)</label>
            <input
              className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md"
              onChange={inputHandle}
              value={state.fee}
              type="text"
              maxLength={4}
              placeholder="ফি"
              name="fee"
              id="fee"
            />
          </div>

          {/* বিবরণ */}
          <div className="flex flex-col w-full gap-1 text-[#000] mb-5">
            <label htmlFor="description">ডাক্টরের বর্ণনা দিন</label>
            <JoditEditor
              ref={editor}
              value={content}
              config={{
                height: 350,
                theme: "default",
                style: {
                  color: "#000",
                  backgroundColor: "#fff",
                },
                placeholder: "এখানে ডাক্তার বর্ণনা লিখুন...",
              }}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          <div className="mb-5 text-[#000]">
            <h2 className="text-lg mb-2">ডাক্তারের সিডিউল / স্লট</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-3">
              <select
                name="day"
                value={slot.day}
                onChange={handleSlotChange}
                className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
              >
                <option value="">দিন নির্বাচন করুন</option>
                <option value="শনিবার">শনিবার</option>
                <option value="রবিবার">রবিবার</option>
                <option value="সোমবার">সোমবার</option>
                <option value="মঙ্গলবার">মঙ্গলবার</option>
                <option value="বুধবার">বুধবার</option>
                <option value="বৃহস্পতিবার">বৃহস্পতিবার</option>
                <option value="শুক্রবার">শুক্রবার</option>
              </select>
              <input
                type="time"
                name="startTime"
                value={slot.startTime}
                onChange={handleSlotChange}
                className="px-4 time-input py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                placeholder="শুরু সময়"
              />
              <input
                type="time"
                name="endTime"
                value={slot.endTime}
                onChange={handleSlotChange}
                className="px-4 py-2 time-input bg-[#fff] border border-slate-700 rounded-md text-[#000]"
                placeholder="শেষ সময়"
              />
              <button
                type="button"
                onClick={addSlot}
                className="bg-[#0b7ec1] px-4 py-2 rounded-md text-white"
              >
                স্লট যুক্ত করুন
              </button>
            </div>
            <div className="grid gap-2">
              {slots.map((s, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#f1f1f1] px-4 py-2 rounded"
                >
                  <span>{`${s.day} | ${s.startTime} - ${s.endTime}`}</span>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500"
                  >
                    <IoCloseSharp />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* ছবি */}
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 w-full text-[#000] mb-4">
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

          {/* সাবমিট */}
          <div className="flex">
            <button
              disabled={loader}
              className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "আপডেট করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctor;
