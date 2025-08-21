import React from 'react';
import { BsChevronDoubleLeft, BsChevronDoubleRight } from 'react-icons/bs';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
  const totalPage = Math.ceil(totalItem / parPage);

  if (totalPage <= 1) return null;

  let startPage = Math.max(1, pageNumber - Math.floor(showItem / 2));
  let endPage = startPage + showItem - 1;

  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - showItem + 1);
  }

  const createBtn = () => {
    const btns = [];
    for (let i = startPage; i <= endPage; i++) {
      btns.push(
        <li
          key={i}
          onClick={() => setPageNumber(i)}
          className={`
            ${pageNumber === i 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50 scale-110' 
              : 'bg-slate-700 text-[#d0d2d6] hover:bg-indigo-500 hover:text-white hover:shadow-md hover:shadow-indigo-500/40'
            }
            w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer 
            transition-all duration-300 text-[15px] font-semibold
          `}
        >
          {i}
        </li>
      );
    }
    return btns;
  };

  return (
    <ul className="flex gap-3 items-center">
      {/* Prev Button */}
      {pageNumber > 1 && (
        <li
          onClick={() => setPageNumber(pageNumber - 1)}
          className="w-[40px] h-[40px] flex items-center justify-center bg-slate-700 text-[#d0d2d6] hover:bg-indigo-500 hover:text-white cursor-pointer rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/40"
        >
          <BsChevronDoubleLeft size={18} />
        </li>
      )}

      {/* Page Numbers */}
      {createBtn()}

      {/* Next Button */}
      {pageNumber < totalPage && (
        <li
          onClick={() => setPageNumber(pageNumber + 1)}
          className="w-[40px] h-[40px] flex items-center justify-center bg-slate-700 text-[#d0d2d6] hover:bg-indigo-500 hover:text-white cursor-pointer rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/40"
        >
          <BsChevronDoubleRight size={18} />
        </li>
      )}
    </ul>
  );
};

export default Pagination;
