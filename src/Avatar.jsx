
// eslint-disable-next-line react/prop-types
const Avatar = ({ userId, username, online }) => {
    const colors = ['bg-red-300', 'bg-green-300', 'bg-purple-400', 'bg-blue-500', 'bg-yellow-300', 'bg-teal-300'];
    const userIdBase10 = parseInt(userId, 16);
    // console.log(userIdBase10)
    const colorInd = Math.floor((userIdBase10 % colors.length))
    const color = colors[colorInd]
    // const colorInd = Math.floor((Math.random() * colors.length))
    // const color = colors[colorInd]

    // console.log(color)
    return (
        <div className={`w-10 h-10   rounded-full flex justify-center items-center text-bold  ${color}`}>
            <span className="opacity-60">

                {username[0]}
            </span>
            {online && <div className="relative ">
                {/* <div className=" absolute w-3 h-3 rounded-full bg-green-600 flex justify-center items-center bottom-0 left-1.5"> */}
                <div className=" absolute w-3 h-3 rounded-full bg-green-600 flex border-2 border-white justify-center items-center top-1.5 left-1.5">
                    <div className=" w-2 h-2 rounded-full bg-green-600  " />
                </div>
            </div>}
            {/* {!online && <div className="relative ">
                <div className=" absolute w-3 h-3 rounded-full bg-gray flex border-2 border-gray justify-center items-center top-1.5 left-1.5">
                    <div className=" w-2 h-2 rounded-full bg-gray  " />
                </div>
            </div>} */}


        </div>
    )
}

export default Avatar