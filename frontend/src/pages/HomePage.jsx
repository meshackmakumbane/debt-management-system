import React from 'react'
import { Link } from 'react-router-dom'
import HomeImage from '../assets/NewHero.png'


const HomePage = () => {
  return (
    <>
      <style>
          {`
              @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
              *{ font-family: "Geist", sans-serif; }
          `}
      </style>
      <header className="relative flex flex-col items-center bg-black text-white px-4 overflow-hidden">
        <Link to="#" className="flex items-center gap-2 rounded-full border border-emerald-300 pl-1 pr-3 py-1 mt-32">
            <span className="bg-emerald-400 text-[10px] px-3 py-1 rounded-full">
                NEW
            </span>
            <span className='text-[13px]'>Faster Debt Recovery.</span>
        </Link>

        <h1 className="text-center text-[40px] leading-tight md:text-6xl mt-4 font-semibold max-w-2xl">
            Debt Management System Built for SMEs.
        </h1>
        <p className="text-center text-sm md:text-base max-w-[558px] mt-1.5">
            An intelligent platform to track debts, manage agents, and debtors and recover payments faster.
        </p>

        <div className="flex items-center gap-4 mt-8">
            <Link to="/start" className="bg-emerald-400 active:scale-95 hover:bg-emerald-500 transition px-6 py-2.5 text-sm font-medium rounded-full cursor-pointer">
                Live Demo
            </Link>
            <Link to="/features" className="border border-emerald-900 bg-emerald-950 hover:bg-emerald-900 transition rounded-full px-6 py-2.5 text-sm font-medium cursor-pointer">
                View Features
            </Link>
        </div>

        <div className="mx-auto mt-14 w-full max-w-7xl md:px-6 lg:px-10">
            <div className="relative mx-auto w-full max-w-5xl">
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[300px] bg-emerald-400 blur-[150px] opacity-80 z-0"></div>
                <img className="rounded-t-xl relative z-10 max-h-64 w-full object-cover object-top border border-emerald-950 md:max-h-80" src={HomeImage} alt="dashboard-Image" />
            </div>
        </div>
      </header>
    </>
  )
}

export default HomePage
