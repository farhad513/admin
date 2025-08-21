
const Loading = () => {
    return (
      <div className='bg-white flex justify-center items-center w-screen h-screen relative'>
        <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src="https://i.ibb.co/Ld6LSNjq/logo-2.png"
            alt="logo"
            className="w-full h-full object-contain animate-spin-slow"
            
          />
        </div>
      </div>
    )
  }
  
  export default Loading
  