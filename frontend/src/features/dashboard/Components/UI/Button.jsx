import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'

const Button = () => {
  const navigate = useNavigate()
  const goBack = () =>{
    navigate(-1)
  } 

  return (
    <button
        onClick={goBack}
        className="inline-flex items-center bg-gray-500 px-4 py-2 text-white text-sm rounded-full hover:bg-gray-800 transition cursor-pointer m-3"
      >
        <IoIosArrowBack size={15}/> Back 
    </button>
  )
}

export default Button
