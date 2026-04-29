import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        loadUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}