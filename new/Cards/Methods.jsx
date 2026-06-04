import React from 'react'

const Methods = ({ methods }) => {
  return (
    <div className='md:w-180'>
        <p className='font-medium text-black my-2 pl-7'>Payment methods</p>   
        <div className='p-2'>
          {methods.map(method => ( 
            <div 
              key={method.id}
              className='flex items-center gap-2 p-2 bg-white rounded-xl mb-1'
            >
              <span className={`${method.backColor} p-2 rounded-full`}>
                  <span dangerouslySetInnerHTML={{__html:method.svg}}/>
              </span>
              <div>
                  <p className='font-bold sm:text-[16px] max-sm:text-[14px]'>{method.title}</p>
                  <p className='max-sm:text-[10px]'>{method.desc}</p>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Methods
