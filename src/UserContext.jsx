import axios from "axios";
import { createContext, useEffect, useState } from "react";
// After registering the user , we created a context that will contain info about the user

export const UserContext = createContext({})

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {

    const [usernameContext, setUsernameContext] = useState(null)
    const [idContext, setIdContext] = useState(null)
    useEffect(() => {
        axios.get('/profile').then((response) => {
            console.log(response.data)
            setUsernameContext(response.data.username)
            setIdContext(response.data.userId)
        })
    }, [])

    return (
        <UserContext.Provider value={{ usernameContext, setUsernameContext, idContext, setIdContext }}>
            {children}
        </UserContext.Provider>
    )
}