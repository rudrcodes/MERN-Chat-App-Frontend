import { useContext, useState } from "react"
import axios from 'axios'
import { UserContext } from "./UserContext"

/* 

In React, the "context" refers to a feature that allows you to share data between components without having to pass props manually through every level of the component tree. It provides a way to pass data down the component tree from a parent component to nested child components without explicitly passing the data as props.
*/

const RegisterAndLogInForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Register')

    const { setUsernameContext: setLoggedInUsername, setIdContext } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username == "" || password == "") alert("Fields can't be empty")
        console.log(username, password)
        const url = isLoginOrRegister === 'Register' ? 'register' : 'login'
        try {
            const res = await axios.post(`/${url}`, { username, password })
            console.log(res)
            if (res.data?.err?.code == 11000) {
                throw new Error("Username exists")
            }
            setIdContext(res.data.id);
            setLoggedInUsername(username)

        } catch (error) {
            alert(error)
        }
        // const { data } = await axios.post(`/${url}`, { username, password })
        // After registering the user , we will create a context that will contain info about the user

    }

    return (
        <div className="h-screen  bg-blue-50 flex items-center ">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input value={username} type="text" placeholder="Enter email" className="block w-full rounded-sm p-2 mb-2 border" onChange={(e) => setUsername(e.target.value)} />

                <input value={password} type="password" placeholder="Enter password" className="block w-full rounded-sm p-2 mb-2 border" onChange={(e) => setPassword(e.target.value)} />
                <button className="text-white block w-full bg-blue-500 rounded-sm p-2">{isLoginOrRegister}</button>
                {isLoginOrRegister == 'Register' && <div className="text-center mt-2">
                    Already a member ? <button onClick={() => setIsLoginOrRegister('LogIn')}>Login Here!</button>
                </div>}
                {isLoginOrRegister == 'LogIn' && <div className="text-center mt-2">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Don't have an account ? <button onClick={() => setIsLoginOrRegister('Register')}>Register!</button>
                </div>}

            </form>
        </div>
    )
}

export default RegisterAndLogInForm