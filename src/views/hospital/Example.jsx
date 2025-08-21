import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, get_seller_order, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import moment from 'moment';
import 'moment/locale/bn'; // বাংলা লোকেল

const AppoinmentDetails = () => {
  const { appoinmentId } = useParams();
  const dispatch = useDispatch();
  const { order, errorMessage, successMessage } = useSelector(state => state.order);

  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(get_seller_order(appoinmentId));
  }, [appoinmentId]);

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  const status_update = (e) => {
    dispatch(seller_order_status_update({ appoinmentId, info: { status: e.target.value } }));
    setStatus(e.target.value);
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
  }, [successMessage, errorMessage]);

  const getBanglaStatus = (status) => {
    const statusMap = {
      pending: 'অপেক্ষমান',
      confirmed: 'নিশ্চিত',
      cancelled: 'বাতিল'
    };
    return statusMap[status] || 'অজানা';
  };

  moment.locale('bn');

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#283046] rounded-md'>
        <div className='flex flex-col md:flex-row justify-between items-center p-4 gap-4'>
          <h2 className='text-xl text-[#d0d2d6]'>অ্যাপয়েন্টমেন্ট ডিটেইলস</h2>
          <select
            onChange={status_update}
            value={status}
            className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
          >
            <option value="pending">অপেক্ষমান</option>
            <option value="confirmed">নিশ্চিত</option>
            <option value="cancelled">বাতিল</option>
          </select>
        </div>

        <div className='p-4 flex flex-wrap gap-4 text-[#d0d2d6]'>
          <div className='w-full md:w-[48%]'>
            <h3 className='text-lg font-semibold mb-2'>অ্যাপয়েন্টমেন্ট আইডি : #{order?._id}</h3>
            <p className='text-md'>তারিখ : {moment(order?.date).format("D MMM YY, h:mm A")}</p>
          </div>

          <div className='w-full md:w-[48%]'>
            <h3 className='text-lg font-semibold mb-2'>অবস্থা : {getBanglaStatus(order?.delivery_status)}</h3>
          </div>

          <div className='w-full md:w-[48%]'>
            <h3 className='text-lg font-semibold mb-2'>ডাক্তারের নাম : {order?.doctor?.name}</h3>
            <p className='text-md'>ক্যাটাগরি : {order?.doctor?.category}</p>
          </div>

          <div className='w-full md:w-[48%]'>
            <h3 className='text-lg font-semibold mb-2'>রোগীর নাম : {order?.patientName}</h3>
          </div>

          <div className='w-full'>
            <h3 className='text-lg font-semibold mb-2'>সমস্যার বিবরণ :</h3>
            <p className='text-md'>{order?.problemDescription || "বিবরণ নেই।"}</p>
          </div>

          <div className='w-full'>
            <h3 className='text-lg font-semibold mb-2'>অ্যাপয়েন্টমেন্ট ফি : {order?.fee} টাকা</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppoinmentDetails;
