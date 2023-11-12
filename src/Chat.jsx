// TODO : Scrool smoothly to the recent message 
// TODO : Stick the input field to the end
// TODO : Loaded the online sign only on the active users and displayed all the users presented in the db ✅
//TODO   When changin users I want to add the loader to show the change of chat screens of a user with different users ✅


import { useContext, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import axios from 'axios'
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";
import Image from "./Image";

const backendHostedLink = import.meta.env.VITE_AXIOS_DEFAULTS_BASEURL;

const Chat = () => {
    const { usernameContext, idContext } = useContext(UserContext)
    const [sio, setSio] = useState(null)

    //all the online clients
    const [allConnectedClients, setAllConnectedClients] = useState([]);

    //all the  clients who have registered
    const [loader, setLoader] = useState(true)
    const [allRegisteredClients, setAllRegisteredClients] = useState([]);
    const [selectedUserInfo, setSelectedUserInfo] = useState({});
    const [newMessageText, setNewMessageText] = useState('');
    const [file, setFile] = useState();
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('')
    const lastMessageUnderDivRef = useRef(null);
    const [logoutText, setLogoutText] = useState('LogOut');

    const [fileData, setFileData] = useState({ name: null })
    // const lastMessageRef = useRef(null);
    // const [fetchedMessages, setFetchedMessages] = useState([]);

    const logout = () => {

        //This is not working , we can make a backend call to set cookie
        // axios.get("/logout").then((res) => {
        //     console.log(res)
        // })
        setSio(null)

        setLogoutText('Logging out...');
        let cookieVal = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        document.cookie = `token= ${cookieVal};expires=Thu, 01 Jan 1970 00:00:00 GMT}`;
        console.log("logout")
        window.location.reload()
    }



    useEffect(() => {
        console.log('selected user changed : ', selectedUserInfo.name)
        if (selectedUserInfo)
            // axios.get(`/messages/${selectedUserInfo.userId}`)
            axios.get(`/messages/${selectedUserInfo.name}`).then((res) => {
                // setFetchedMessages(res.data);
                console.log("res.data : ", res.data)
                setMessages(res.data)
            }).catch((err) => {
                alert(err)
            })
        // console.log(selectedUserInfo)


    }, [selectedUserInfo]);
    // const connectToSocket = () => {

    //     let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    //     console.log(cookieValue)
    //     const socket = io('http://localhost:4000', {
    //         extraHeaders: {
    //             usercookie: cookieValue
    //         }
    //     });
    //     setSio(socket);
    //     socket.on('disconnect', () => {
    //         connectToSocket();
    //     })

    // }
    const scrollToEnd = () => {
        lastMessageUnderDivRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageUnderDivRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // lastMessageUnderDivRef.current?.scrollIntoView({ behavior: 'smooth' });

        let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // console.log(cookieValue)
        const socket = io(backendHostedLink, {
            extraHeaders: {
                usercookie: cookieValue
            }
        });

        setSio(socket)
        // connectToSocket()
        // socket.on('disconnect', () => {
        //     connectToSocket();
        // })
        //getting all the connected clients

        socket.on('closed', (data) => {
            //update the connected list
            //working for close but now have to reconnect it
            setAllConnectedClients((prev) => {
                return prev.filter(item => item.userId !== data.userId)
            })
            console.log("closed : ", data.userId)
        })
        socket.on('open', (data) => {
            //update the connected list
            //working for close but now have to reconnect it
            setAllConnectedClients((prev) => [...prev, data])
            console.log("open : ", data)
        })
        //all the  clients ie people who are registered to the application
        axios.get('/allUsers').then((res) => {
            const allPeeps = [];
            res.data.forEach(({ username, _id }) => {
                if (_id != idContext)
                    allPeeps.push({ userId: _id, name: username })
            })
            console.log("allPeeps : ", allPeeps)
            setAllRegisteredClients(allPeeps);
        })

        //connected clients ie people who are online
        axios.get('/allClients').then((res) => {
            // console.log(res.data)
            const peeps = {};
            res.data.forEach(({ userId, username }) => {
                peeps[userId] = username
            })
            // console.log(peeps)
            const arr = [];
            for (let key in peeps) {
                if (key != idContext)
                    arr.push({ userId: key, name: peeps[key] })
            }
            console.log("arr : ", arr)
            setAllConnectedClients(arr)
        });



        //Getting message from the server from another client
        socket.on('messageResponse', (data) => {
            console.log("data received in frontend : ", data)
            let newMessageArr = [...messages];
            // let newMessageArr = messages.map((msgs) => msgs);
            newMessageArr.push(data);
            setMessages(newMessageArr)
            // setMessages([...messages, data])
            console.log("newMessageArr : ", messages)
        })
    }, [messages])

    //for disconnect and connection
    // setInterval(() => {
    //     sio?.on('closed', (data) => {
    //         //update the connected list
    //         //working for close but now have to reconnect it
    //         setAllConnectedClients((prev) => {
    //             return prev.filter(item => item.userId !== data.userId)
    //         })
    //         console.log("closed : ", data.userId)
    //     })
    // }, 10000);

    //same for connection
    // setInterval(() => {
    //     axios.get('/allClients').then((res) => {
    //         // console.log(res.data)
    //         const peeps = {};
    //         res.data.forEach(({ userId, username }) => {
    //             peeps[userId] = username
    //         })
    //         // console.log(peeps)
    //         const arr = [];
    //         for (let key in peeps) {
    //             if (key != idContext)
    //                 arr.push({ userId: key, name: peeps[key] })
    //         }
    //         // console.log("arr : ", arr)
    //         setAllConnectedClients(arr)
    //     });
    // }, 7000);


    // console.log(allConnectedClients);

    // const handleMessage = (e) => {
    //     console.log('new msg', e)
    // }


    const selectContact = (user) => {
        // Add loader to the chats here


        setLoader(true)

        setTimeout(() => {
            console.log("loading chats...")
            setLoader(false)
        }, 3000)



        console.log("outside")

        setSelectedUserInfo(user)
    }

    // Sending messages to the server 
    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        console.log("fileData", fileData)

        if (fileData.name != null) {
            await sio.emit('sendMessage', {
                type: "file",

                receiverID: selectedUserInfo.userId || '',
                senderID: idContext || '',
                receiverUsername: selectedUserInfo.name || '',
                senderUsername: usernameContext || '',

                // File specific data
                readerRes: fileData.result,
                message: fileData.name,
                body: fileData.body,
                mimeType: fileData.type,
            })



            // alert("file send");
            console.log({
                type: "file",

                receiverID: selectedUserInfo.userId || '',
                senderID: idContext || '',
                receiverUsername: selectedUserInfo.name || '',
                senderUsername: usernameContext || '',

                // File specific data
                readerRes: fileData.result,
                message: fileData.name,
                body: fileData.body,
                mimeType: fileData.type,
            })
            setFile();
            setNewMessageText('');
        }
        else {
            await sio.emit('sendMessage', {
                type: "text",
                receiverID: selectedUserInfo.userId || '',
                senderID: idContext || '',
                receiverUsername: selectedUserInfo.name || '',
                senderUsername: usernameContext || '',
                message: newMessageText,
                body: "",
                mimeType: "",
                fileData
            })
            setNewMessageText('');
        }
        console.log(newMessageText)


        // setSelectedUserInfo({ userId: selectedUserInfo.userId, name: selectedUserInfo.name })
    }


    const sendFile = (e) => {
        setNewMessageText(e.target?.files[0]?.name);
        setFile(e.target.files[0]);
        const body = e.target?.files[0]
        const type = e.target?.files[0].type
        const name = e.target?.files[0].name
        const blob = new Blob([body], { type })

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            console.log("Reader reasults : ", reader.result)
            setFileData({ name, body, type, result: reader.result })
        }

        console.log(e.target.files[0])
    }


    // const callBlob = () => {
    //     return "Blob"
    // }
    return (
        <div className="flex h-screen">
            <div className="bg-blue-400 w-1/3  p-4 flex justify-between  flex-col h-full" >
                <div>
                    {/* Logo */}
                    <div className="font-bold text-blue-700 flex  gap-2 text-2xl mb-4">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                        </svg>

                        MernChat
                    </div>
                    <div className="font-bold text-md flex justify-center items-center ">
                        Logged in as :
                        <div className=" flex justify-center items-center gap-1 uppercase">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>


                            <span className=" text-gray-700">{usernameContext}</span>
                        </div>
                    </div>
                    <br />
                    {selectedUserInfo.name && <div>Selected user : {selectedUserInfo.name}</div>}
                    {allRegisteredClients && allRegisteredClients.map((user) => {
                        // {allConnectedClients && allConnectedClients.map((user) => {
                        return (

                            <div onClick={() => selectContact(user)} key={user.userId}
                                // className={" text-xl py-2 border-b border-gray-400 flex  gap-2 items-center cursor-pointer" + "bg-red-900"}
                                className={` text-xl  border-b border-gray-400 flex  gap-2 items-center cursor-pointer 
                                ${selectedUserInfo.userId == user.userId ? "bg-blue-300 rounded-lg" : ''}
                        `}
                            >
                                {user.userId == selectedUserInfo.userId &&
                                    <div className="border-l border-red-600 h-14 border-4 rounded-lg">

                                    </div>}
                                <div className="p-2 flex  gap-2 items-center">
                                    {/* Here I am showing all the connected users , even though they are offline , but they have an account in the application */}
                                    {/* TODO:  */}
                                    {/* TODO:  */}
                                    {/* TODO:  */}
                                    {/* TODO:  */}
                                    {/* for offline and online we can check if the user is connected or disconnected from the socket and store that in the db */}

                                    {/* Now if the registered user is present in the allConnectedClients list then i'll show them online */}

                                    {allConnectedClients.find((peeps) => peeps.userId == user.userId) ? <Avatar online={true} userId={user.userId} username={user.name} /> : <Avatar online={false} userId={user.userId} username={user.name} />}


                                    {/* <Avatar online={true} userId={user.userId} username={user.name} /> */}
                                    {/* {user.name} */}
                                    {user.name}
                                </div>
                            </div>

                        )
                    })}
                    <div className="flex justify-center items-center my-3">

                        <button onClick={scrollToEnd} className="p-2  rounded-md bg-black text-white hover:bg-slate-700 transition duration-300 ease-in-out" >Scroll to end of messages</button>
                    </div>
                </div>
                <div className="text-center cursor-pointer mb-2 border-2 px-5 py-2 hover:bg-black hover:text-white rounded-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ">
                    {/* <div className="text-center cursor-pointer mb-2 border-2 px-5 py-2 hover:bg-black hover:text-white rounded-md transition-all duration-200 ease-in"> */}
                    <button onClick={() => logout()} className="uppercase">

                        {logoutText}
                    </button>
                </div>
            </div>
            <div className="bg-blue-300 w-2/3 p-2 flex flex-col">
                <div className="flex-grow">
                    {!selectedUserInfo.name && (
                        <div className=" flex justify-center items-center h-full text-3xl gap-2">
                            <span className="font-bold text-gray-700">



                                Select a person to start the convo</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
                                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                            </svg>
                            ...

                        </div>
                    )}

                </div>
                {/*  When changin users I want to add the loader to show the change of chat screens of a user with different users  */}
                {/* {setTimeout(() => {
                    <div>Loading chats</div>
                }, 2000)} */}

                {/* {loader && (selectedUserInfo.name) && <div>Loading chats .... 🔃</div>} */}

                {(selectedUserInfo.name) &&
                    // <div >
                    <div className="overflow-y-scroll">
                        {/* displating all the messages */}
                        {/* Take a break here*/}
                        {loader === true ? <div>Loading chats .... 🔃</div> :
                            <div className="">
                                {
                                    messages.length > 0 && messages.map((msg) => {


                                        return (msg.receiverUsername === usernameContext ?
                                            <div className="">
                                                {/* check if msg is attachment or text */}
                                                <div className=" rounded-lg my-2  p-2  flex  items-center justify-start gap-2 " key={Math.random() * 1000000}>
                                                    <div className=" bg-green-500 p-3 rounded-md ">
                                                        {/* {msg.receiverID} */}
                                                        <span className="bg-black text-white p-1.5 mr-2 rounded-md"> {msg.senderUsername} : </span>
                                                        {/* {msg.type == "file" ? <div>file</div> : <div>text</div>} */}
                                                        {/* <span className="text-bold">  {msg.message}</span> */}

                                                        {/* {msg.type == "file" ?
                                                        <a  ></a>
                                                        // const blob=new Blob()
                                                        : <span className="text-bold ">  {msg.message}</span>
                                                    } */}

                                                        {msg.type == "file" ?
                                                            <div className="flex justify-center items-center mt-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                    <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                                                                </svg>

                                                                <a className="underline" href={backendHostedLink + "/uploads/" + msg.message} target="_">{msg.message}</a>
                                                            </div>
                                                            // <a href=`http://localhost:4000/uploads/${msg.message}`  target="_">{msg.message}</a>
                                                            // const blob=new Blob()
                                                            : <span className="text-bold ">  {msg.message}</span>
                                                        }
                                                        {/* {msg.type == "file" ?
                                                        <Image fileName={msg.message} body={msg.body} type={msg.type} />
                                                        // const blob=new Blob()
                                                        : <span className="text-bold ">  {msg.message}</span>} */}
                                                    </div>
                                                </div>
                                                {/* <div ref={lastMessageUnderDivRef}></div> */}
                                            </div>
                                            : (msg.senderUsername == usernameContext ?
                                                <div className="">

                                                    <div ref={lastMessageUnderDivRef} className="rounded-lg my-2  p-2  flex  items-center justify-end gap-2 " key={Math.random() * 100}>
                                                        {/* {msg.receiverID} */}
                                                        <div className=" bg-red-500 p-3 rounded-md">

                                                            <span className="bg-black text-white p-1.5 mr-2 rounded-md"> You : </span>
                                                            {/* {msg.type == "file" ?
                                                            <Image fileName={msg.message} body={msg.body} type={msg.type} mimeType={msg.mimeType} />
                                                            // const blob=new Blob()
                                                            : <span className="text-bold ">  {msg.message}</span>
                                                        } */}
                                                            {msg.type == "file" ?
                                                                <div className="flex justify-center items-center mt-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                        <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                                                                    </svg>

                                                                    <a className="underline" href={backendHostedLink + "/uploads/" + msg.message} target="_">{msg.message}</a>
                                                                </div>                                                     // const blob=new Blob()
                                                                : <span className="text-bold ">  {msg.message}</span>
                                                            }

                                                        </div>

                                                    </div>
                                                </div>
                                                : '')
                                        )
                                    }
                                    )
                                }
                            </div>
                        }
                        <div ref={lastMessageUnderDivRef} className="h-2" />

                        {/* Input field */}
                        <form className="flex gap-2 sticky bg-red-900" onSubmit={sendMessage}>

                            <input value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} type="text" placeholder="Type Message" className="bg-white border p-2 flex-grow rounded-md" />


                            <label className="flex justify-center items-center cursor-pointer p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition-all duration-200 ease-in ">
                                <input type="file" className="hidden" onChange={sendFile} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                                </svg>

                            </label>
                            <button type="submit" className="bg-blue-500 p-2 text-white rounded-md hover:bg-blue-600 transition-all duration-200 ease-in ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>

                            </button>
                        </form>

                    </div>
                }


            </div>
        </div >
    )
}

export default Chat