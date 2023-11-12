import { useContext } from "react";
import RegisterAndLogInForm from "./RegisterAndLogInForm";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Routes() {

    const { usernameContext, idContext } = useContext(UserContext);
    if (usernameContext && idContext) {
        return <Chat/>
    }
    return (
        <RegisterAndLogInForm />
    )
}