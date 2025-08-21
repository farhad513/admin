import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  get_hospital_appoinment,
  hospital_appoinment_status_update,
} from "../../store/Reducers/AppoinmentReducer";
import moment from "moment";
import "moment/locale/bn";
import SeoHelmet from "../components/SEO";

const AppoinmentDetails = () => {
  const { appoinmentId } = useParams();
  const dispatch = useDispatch();
  const { appoinment, errorMessage, successMessage } = useSelector(
    (state) => state.appoinment
  );
  console.log(appoinment, "appoinment");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  moment.locale("bn");

  // Initial load
  useEffect(() => {
    dispatch(get_hospital_appoinment(appoinmentId));
  }, [appoinmentId]);

  // API থেকে ডাটা আসলে state সেট করো
  useEffect(() => {
    if (appoinment) {
      setStatus(appoinment?.status || "");
      setSerialNumber(appoinment?.appoinmentId?.serial || "");
      setAppointmentDate(
        appoinment?.date
          ? moment(appoinment.date).locale("en").format("YYYY-MM-DD") // Force English digits
          : ""
      );
      setAppointmentTime(appoinment?.time || "");
    }
  }, [appoinment]);

  // Status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (newStatus === "confirmed") {
      setShowModal(true); // শুধু modal খুলো, state আগেই সেট আছে
    } else {
      dispatch(
        hospital_appoinment_status_update({
          appoinmentId,
          info: { status: newStatus },
        })
      );
    }
  };

  // Confirm button inside modal
  const handleConfirm = () => {
    if (!serialNumber || !appointmentDate || !appointmentTime) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    const isoDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    dispatch(
      hospital_appoinment_status_update({
        appoinmentId,
        info: {
          status: "confirmed",
          serial: serialNumber,
          appointmentDate, // backend এই নামেই expect করছে
          time: isoDateTime, // same as date, অথবা আলাদা রাখতে চাইলে নতুন Date object বানাও
        },
      })
    );

    setShowModal(false);
  };

  // Toast messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const getBanglaStatus = (status) => {
    const statusMap = {
      pending: "অপেক্ষমান",
      confirmed: "নিশ্চিত",
      cancelled: "বাতিল",
    };
    return statusMap[status] || "অজানা";
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
        title="অ্যাপয়েন্টমেন্ট স্ট্যাটাস আপডেট | Medi Fast Health Care"
        description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে রোগীর অ্যাপয়েন্টমেন্ট সহজেই আপডেট করুন। পেন্ডিং, কনফার্মড, ক্যান্সেলড বা কমপ্লিটেড স্ট্যাটাস পরিবর্তন করে সঠিক সেবা ব্যবস্থাপনা নিশ্চিত করুন।"
        keywords="অ্যাপয়েন্টমেন্ট আপডেট, অ্যাপয়েন্টমেন্ট এডিট, স্ট্যাটাস পরিবর্তন, Medi Fast Health Care, ডাক্তার অ্যাপয়েন্টমেন্ট ম্যানেজমেন্ট"
        url="https://medifasthealthcare.com/hospital/edit-appointment"
      />

      <div className="w-full p-4 bg-[#ffff] rounded-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
          <h2 className="text-xl text-[#000]">অ্যাপয়েন্টমেন্ট ডিটেইলস</h2>
          <select
            onChange={handleStatusChange}
            value={status}
            disabled={status === "confirmed"} // Disable if confirmed
            className="px-4 py-2 bg-[#ffff] border border-slate-700 rounded-md text-[#000] outline-none"
          >
            <option value="pending">অপেক্ষমান</option>
            <option value="confirmed">নিশ্চিত</option>
            <option value="cancelled">বাতিল</option>
          </select>
        </div>

        {/* Appointment Info */}
        <div className="p-4 flex flex-wrap gap-4 text-[#000]">
          <div className="w-full md:w-[48%]">
            <p className="mb-2 font-semibold">
              রোগীর নাম : {appoinment?.appoinmentId?.patientName}
            </p>
            <p className="mb-2">
              সিরিয়াল নাম্বার : {appoinment?.appoinmentId?.serial || "0"}
            </p>
          </div>
          <div className="w-full md:w-[48%]">
            <p className="mb-2">ডাক্তারের নাম : {appoinment?.doctorId?.name}</p>
            <p>ক্যাটাগরি : {appoinment?.doctorId?.category}</p>
          </div>
          <div className="w-full md:w-[48%]">
            <p>
              অ্যাপয়েন্টমেন্ট তারিখ :{" "}
              {moment(appoinment?.date).format("D MMMM YYYY")}
            </p>
          </div>
          <div className="w-full md:w-[48%]">
            <p>অবস্থা : {getBanglaStatus(appoinment?.status)}</p>
          </div>
        </div>
      </div>

      {/* Modal for Confirmed status */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              অ্যাপয়েন্টমেন্ট কনফার্ম করুন
            </h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">সিরিয়াল নাম্বার</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                অ্যাপয়েন্টমেন্ট তারিখ
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">সময়</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                কনফার্ম
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppoinmentDetails;
