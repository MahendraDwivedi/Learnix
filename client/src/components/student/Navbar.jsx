// import React, { useContext } from 'react'
// import {assets} from '../../assets/assets'
// import { Link } from 'react-router-dom'
// import { useClerk,UserButton , useUser } from '@clerk/clerk-react'
// import { AppContext } from '../../context/AppContext'
// import { toast } from 'react-toastify'
// import axios   from 'axios'

// const Navbar = () => {

//   const {navigate,isEducator , backendUrl ,setIsEducator,getToken} = useContext(AppContext)
//   const isCourseListPage = location.pathname.includes('/course-list');
  
//   const {openSignIn} = useClerk();
//   const { user } = useUser();
//   const isAdmin = user?.publicMetadata?.role === "admin";
//   const becomeEducator = async()=>{
//     try {
//       if(isEducator){
//         navigate('/educator')
//         return ;
//       }
//       const token = await getToken();
//       const {data} = await axios.get(backendUrl+`/api/educator/update-role`,{
//         headers:{
//           Authorization : `Bearer ${token}`
//         }
//       })
//       if(data.success){
//         setIsEducator(true)
//         toast.success(data.message)
//       }
//       else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   return (
//     <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-26 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-blue-100/70'}`}>
//         {/* <img onClick={()=> navigate('/')} src="{assets.logo}" alt="Logo" className='w-28 lg:w-32 cursor-pointer'/> */}
//         <h1 onClick={()=> navigate('/')} className='text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 cursor-pointer'>Learnix</h1>
//         <div className='hidden md:flex items-center gap-5 text-grey-500'>
//           <div className='flex items-center gap-5'>
//             { user &&!isAdmin &&  
//              <>
//               {<button onClick={becomeEducator}> {isEducator ? 'Educator DashBoard ':'Become Educator'} </button>}
//              | <Link to='/my-enrollments'>My Enrollments</Link>
//              </>
//              }
//              <>
//              {isAdmin && (
//           <Link
//             to="/admin"
//             className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Admin Dashboard
//           </Link>
//         )}
//              </>
//           </div>
//           { user ? <UserButton/> :
//             <button onClick={()=> openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}        </div>

//         {/* For Phone Screens */}

//         <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
//           <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
//           { user &&  
//              <>
//               <button onClick={becomeEducator}>{isEducator ? 'Educator DashBoard ':'Become Educator'} </button>  
//              | <Link to='/my-enrollments'>My Enrollments</Link> 
//              </>
//           }
//            {/* Show Admin button only if user is admin */}
        
//           </div>
//           {
//             user ? <UserButton/> : <button onClick={()=> openSignIn()}><img src={assets.user_icon}  alt="" /></button>

//           }
//         </div>

//     </div>
//   )
// }

// export default Navbar


import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ShieldCheck } from 'lucide-react' // admin icon
import { FaCrown } from "react-icons/fa";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  const isCourseListPage = location.pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + `/api/educator/update-role`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-26 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-blue-100/70'}`}>
      <h1 onClick={() => navigate('/')} className='text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 cursor-pointer'>Learnix</h1>

      {/* Desktop View */}
      <div className='hidden md:flex items-center gap-5 text-grey-500'>
        <div className='flex items-center gap-5'>
          {user && !isAdmin &&
            <>
              <button onClick={becomeEducator}>{isEducator ? 'Educator DashBoard' : 'Become Educator'}</button>
              | <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        {
          user
            ? <UserButton />
            : <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>
        }
      </div>

      {/* Mobile View */}
      <div className='md:hidden flex items-center gap-2 sm:gap-4 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {!isAdmin &&  user &&
            <>
              <button onClick={becomeEducator}>{isEducator ? 'Educator DashBoard' : 'Become Educator'}</button>
              | <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
          {isAdmin && (
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">
              <FaCrown size={20} />
            </Link>
          )}
        </div>
        {
          user
            ? <UserButton />
            : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
        }
      </div>
    </div>
  )
}

export default Navbar
