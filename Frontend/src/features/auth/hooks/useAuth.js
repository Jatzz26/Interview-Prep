import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from '../services/auth.api'

const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true)
            const data = await login({ email, password })

            setUser(data.user)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    const handleGetMe = async () => {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    useEffect(() => {
        const getAndSetUser = async () => {
            const data = await getMe()
            setUser(data.user)
        }
        getAndSetUser()
    }, [])

    return {
        user,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }
}

export default useAuth