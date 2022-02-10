import React from "react"

const Loader = () => (
    <div className='absolute w-full h-4/5 flex items-center justify-center'>
        <div className="rounded-full animate-spin w-5 h-5 border-2 border-t-white border-primary">
        </div>
    </div>
)

export default Loader