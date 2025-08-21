import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { get_deactive_hospitals } from '../../store/Reducers/hospitalReducer'
import SeoHelmet from '../components/SEO'

const DeactiveHospitals = () => {
  const dispatch = useDispatch()
  const { hospitals, totalHospital } = useSelector(state => state.hospital)
  console.log(hospitals)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [parPage, setParPage] = useState(5)

  const fetchHospitals = useCallback(() => {
    dispatch(get_deactive_hospitals({
      parPage,
      page: currentPage,
      searchValue
    }))
  }, [dispatch, parPage, currentPage, searchValue])

  useEffect(() => {
    fetchHospitals()
  }, [fetchHospitals])

  const totalPages = useMemo(() => Math.ceil(totalHospital / parPage), [totalHospital, parPage])

  return (
    <div className="px-2 lg:px-7 pt-5">
      <SeoHelmet
  title="হাসপাতাল নিষ্ক্রিয় করুন | Medi Fast Health Care অ্যাডমিন"
  description="Medi Fast Health Care অ্যাডমিন ড্যাশবোর্ড থেকে হাসপাতাল সহজেই নিষ্ক্রিয় করুন। যেসব হাসপাতাল অকার্যকর বা অনুপযুক্ত তাদেরকে সিস্টেম থেকে সাময়িক বা স্থায়ীভাবে বন্ধ করুন।"
  keywords="হাসপাতাল নিষ্ক্রিয়, হাসপাতাল ডিএক্টিভ, Medi Fast Health Care অ্যাডমিন, হাসপাতাল ম্যানেজমেন্ট, নিষ্ক্রিয় হাসপাতাল"
  url="https://medifasthealthcare.com/admin/hospital/deactivate"
/>

      <div className="w-full p-4 bg-[#fff] rounded-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            value={parPage}
            className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] focus:border-indigo-500 outline-none"
          >
            {[5, 15, 25].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="সার্চ করুন..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-4 py-2 bg-[#fff] border border-slate-700 rounded-md text-[#000] focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#000]">
            <thead className="text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">ছবি</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">ইমেইল</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">জেলা</th>
                <th className="py-3 px-4">উপজেলা</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody className="text-sm font-normal">
              {hospitals.length > 0 ? hospitals.map((hospital, index) => (
                <tr key={hospital._id}>
                  <td className="py-2 px-4">{(currentPage - 1) * parPage + index + 1}</td>
                  <td className="py-2 px-4">
                    {hospital.image ? (
                      <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="w-11 h-11 rounded object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">ছবি নেই</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{hospital.name}</td>
                  <td className="py-2 px-4">{hospital.email}</td>
                  <td className="py-2 px-4">{hospital.division || 'N/A'}</td>
                  <td className="py-2 px-4">{hospital.district || 'N/A'}</td>
                  <td className="py-2 px-4">{hospital.upazila || 'N/A'}</td>
                  <td className="py-2 px-4">{hospital.status}</td>
                  <td className="py-2 px-4">
                    <div className='flex gap-4'>
                    <Link
                      to={`/admin/dashboard/hospital/details/${hospital._id}`}
                      className="p-[6px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50"
                    >
                      <FaEye />
                    </Link>
                    </div>
                    
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400">কোনো হাসপাতাল পাওয়া যায়নি।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {hospitals.length > 0 && totalPages > 1 && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalHospital}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default DeactiveHospitals
