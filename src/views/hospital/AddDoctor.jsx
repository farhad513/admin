import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import JoditEditor from "jodit-react";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_doctor, messageClear } from "../../store/Reducers/doctorReducer";
import SeoHelmet from "../components/SEO";

const AddDoctor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { successMessage, errorMessage, loader } = useSelector(
    (state) => state.doctor
  );

  const [state, setState] = useState({
    name: "",
    description: "",
    fee: "",
    experience: "",
    qualification: "",
  });

  // Bengali char check
 const isBengali = (text) => /^[\u0980-\u09FF\s,।ঃ().]*$/.test(text);




  // Optimized input handling
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

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState(categorys);
  const [searchValue, setSearchValue] = useState("");
  // console.log(allCategory)
  const categorySearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      setAllCategory(
        value
          ? categorys.filter((c) =>
              c.name.toLowerCase().includes(value.toLowerCase())
            )
          : categorys
      );
    },
    [categorys] // dependencies updated for category change
  );

  useEffect(() => {
    dispatch(
      get_category()
    );
  }, [dispatch]);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

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
      const exists = slots.some(
        (s) =>
          s.day === slot.day &&
          s.startTime === slot.startTime &&
          s.endTime === slot.endTime
      );
      if (exists) {
        toast.error("এই স্লটটি ইতিমধ্যে যোগ করা হয়েছে।");
        return;
      }
      setSlots((prev) => [...prev, slot]);
      setSlot({ day: "", startTime: "", endTime: "" });
    } else {
      toast.error("দয়া করে সব স্লট ফিল্ড পূর্ণ করুন");
    }
  };
  

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageHandle = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB
  
      if (!validTypes.includes(file.type)) {
        toast.error("শুধুমাত্র JPG, JPEG, PNG অথবা WEBP ফরম্যাটের ছবি আপলোড করুন।");
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
  };
  
  
  const add = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !state.name ||
      !state.fee ||
      !state.qualification ||
      !state.experience ||
      !category ||
      !content ||
      !image ||
      slots.length === 0
    ) {
      toast.error("অনুগ্রহ করে সব ফিল্ড পূর্ণ করুন!");
      return;
    }

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", content);
    formData.append("fee", state.fee);
    formData.append("qualification", state.qualification);
    formData.append("category", category);
    formData.append("experience", state.experience);
    if (image) {
      formData.append("image", image);
    }
    formData.append("slots", JSON.stringify(slots));

    await dispatch(add_doctor(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        fee: "",
        experience: "",
        qualification: "",
      });
      setContent("");
      setImagePreview(null);
      setImage(null);
      setCategory("");
      setSlots([]);
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
  title="নতুন ডাক্তার যুক্ত করুন | Medi Fast Health Care"
  description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে নতুন ডাক্তার যুক্ত করুন। ডাক্তারের নাম, বিভাগ, অভিজ্ঞতা, শিক্ষাগত যোগ্যতা ও প্রোফাইল তথ্য সহজেই যোগ করতে পারবেন।"
  keywords="ডাক্তার যুক্ত করুন, নতুন ডাক্তার, ডাক্তার ম্যানেজমেন্ট, Medi Fast Health Care, হাসপাতাল ম্যানেজমেন্ট"
  url="https://medifasthealthcare.com/hospital/add-doctor"
/>

      <div className="w-full p-4 bg-[#fff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000] text-xl font-semibold">
            ডাক্তার যোগ করুন
          </h1>
          <Link
            className="bg-[#0b7ec1] hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/hospital/dashboard/doctors"
          >
            ডাক্তার
          </Link>
        </div>
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              {/* Form Inputs */}
              <div className="flex flex-col w-full gap-1">
                <label className="text-black" htmlFor="name">ডাক্তারের নাম</label>
                <input
                  className="px-4 py-2 focus:border-[#0b7ec1] outline-none bg-[#fffff] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  placeholder="ডাক্তারের নাম"
                  name="name"
                  id="name"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label className="text-black" htmlFor="experience">ডাক্তারের অভিজ্ঞতা</label>
                <input
                  className="px-4 py-2 focus:border-[#0b7ec1] outline-none bg-[#fffff] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.experience}
                  type="text"
                  placeholder="ডাক্তারের অভিজ্ঞতা"
                  name="experience"
                  id="experience"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              {/* Category Dropdown */}
              <div className="flex flex-col w-full gap-1 relative">
                <label className="text-black" htmlFor="category">ডাক্তারের বিশেষত্ব</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-[#0b7ec1] outline-none bg-[#fffff] border z-[10000] border-slate-700 rounded-md text-[#000]"
                  value={category}
                  type="text"
                  placeholder="-- ক্যাটাগরি নির্বাচন করুন --"
                />
                <div
                  className={`absolute top-[101%] bg-white w-full text-black transition-all ${
                    cateShow ? "scale-100 z-[100000]" : "scale-0"
                  }`}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <div className="w-full px-4 py-2">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="z-[10000] px-3 py-1 w-full focus:border-[#0b7ec1] outline-none bg-transparent border border-slate-700 rounded-md text-[#000] overflow-hidden"
                      type="text"
                      placeholder="অনুসন্ধান করুন"
                    />
                  </div>
                  <div className="flex justify-start items-start flex-col">
                    {allCategory.map((c, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 hover:bg-[#0b7ec1] hover:text-white hover:shadow-lg  w-full cursor-pointer ${
                          category === c.name && "bg-[#0b7ec1]"
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

              {/* Qualification Input */}
              <div className="flex flex-col w-full gap-1">
                <label className="text-black" htmlFor="qualification">ডাক্তারের যোগ্যতা</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#fffff] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.qualification}
                  placeholder="ডাক্তারের যোগ্যতা"
                  name="qualification"
                  id="qualification"
                />
              </div>
            </div>
            {/* Fee Input */}
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label className="text-black" htmlFor="fee">কনসালটেশন ফি</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#fffff] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.fee}
                  type="text"
                  placeholder="কনসালটেশন ফি"
                  name="fee"
                  id="fee"
                  maxLength={4}
                />
              </div>
            </div>
            {/* Description Editor */}
            <div className="flex flex-col w-full gap-1 text-[#d0d2d6] mb-5">
              <label className="text-black" htmlFor="description">ডাক্টরের বর্ণনা দিন</label>
              <JoditEditor
                ref={editor}
                config={{
                  height: 350,
                  theme: "default",
                  style: {
                    color: "#00000",
                    backgroundColor: "#fffff",
                  },
                  placeholder: "এখানে ডাক্তার বর্ণনা লিখুন...",
                }}
                value={content}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>
            {/* Slot Section */}
            <div className="mb-5 text-[#000]">
              <h2 className="text-lg mb-2">ডাক্তারের সিডিউল / স্লট</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-3">
                <select
                  name="day"
                  value={slot.day}
                  onChange={handleSlotChange}
                  className="px-4 py-2 bg-[#fffff] border border-slate-700 rounded-md text-[#000]"
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
                  className="px-4 time-input py-2 bg-[#fffff] border border-slate-700 rounded-md text-[#000]"
                  placeholder="শুরু সময়"
                />
                <input
                  type="time"
                  name="endTime"
                  value={slot.endTime}
                  onChange={handleSlotChange}
                  className="px-4 py-2 time-input bg-[#fffff] border border-slate-700 rounded-md text-[#000]"
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
                    className="flex justify-between items-center bg-[#f1f1f1]  px-4 py-2 rounded"
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
            {/* Image Upload */}
            <div className="mb-5">
              <label className="text-black" htmlFor="image">
                ডাক্তার ছবির যোগ করুন
              </label>
              <div className="relative">
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
                    <label
                      htmlFor="image"
                      className="cursor-pointer text-black"
                    >
                      <BsImages size={40} />
                      <p>ছবি নির্বাচন করুন</p>
                    </label>
                  )}
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#0b7ec1] text-white px-6 py-2 rounded-md"
                disabled={loader}
              >
                {loader ? (
                  <PropagateLoader color="#ffffff" size={12} />
                ) : (
                  "জমা দিন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
