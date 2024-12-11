import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    login: () => { },
    register: () => { },
    fetchProfile: () => { },
    logout: () => { },
});

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // Manage loading state
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                try {
                    await fetchProfile(token);
                } catch (error) {
                    console.error('Failed to validate token:', error);
                    logout(); // Logout if token validation fails
                }
            }
            setLoading(false); // Finish loading after check
        };
        checkUser();
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',  // Specify the method
                headers: {
                    'Content-Type': 'application/json', // Set content type
                },
                body: JSON.stringify({ email, password }), // Convert body to JSON
            });
            const data = await response.json(); // Wait for response and parse JSON
            console.log(data);
            if (!response.ok) { // Check if response is ok
                throw new Error(data.message || 'Login failed');
            }
            const { token, user } = data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            // console.log("userId:", user._id);
            // socket?.emit('register', user._id);
            return { success: true, role: user.role }; // Return success
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response ? error.response.data : error.message }; // Return error message
        } finally {
            setLoading(false); // End loading
        }
    };

    const register = async (username, email, password) => {
        try {
            // await axios.post(`${API_URL}/user/register`, { username, email, password });
            const response = await fetch(`${API_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log(data);
            return { success: true, message: 'Your staff account has been submitted for approval' };
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const clientRegister = async (username, email, password, phone, ic) => {
        try {
            const response = await fetch(`${API_URL}/user/clientRegister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, phone, ic }),
            });
            const data = await response.json();
            console.log(data);
            return { success: true, message: 'Your client account has been submitted for approval' };
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const registerUser = async (username, email, password, phone, ic, role) => {
        try {
            const response = await fetch(`${API_URL}/user/userRegister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, phone, ic, role }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.error}, Details: ${errorData.details}`);
            }
            const data = await response.json();
            console.log(data);
            return { success: true, message: `The ${role} account has been created` };
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };


    const fetchProfile = async (authToken) => {
        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.error}, Details: ${errorData.details}`);
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error.message);
        }
    };


    const logout = async () => {
        setLoading(true);
        console.log(`Bearer ${token}`);
        try {
            //fetch
            const response = await fetch(`${API_URL}/user/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // const response = await axios.post(`${API_URL}/user/logout`, {}, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            console.log(response);
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('caseItem');
            setLoading(false);
        }
    };
    const changePassword = async ({ oldPassword, newPassword }) => {
        try {
            //fetch
            const response = await fetch(`${API_URL}/user/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            // const response = await axios.post(`${API_URL}/user/changePassword`, {
            //     oldPassword,
            //     newPassword
            // }, {
            //     headers: {
            //         Authorization: `Bearer ${token}`  // Ensure you're sending the token
            //     }
            // });
            console.log(response);
            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data.message : error.message);
            return { success: false, message: error.response ? error.response.data.message : 'Failed to change password' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            register,
            clientRegister,
            registerUser,
            fetchProfile,
            setUser,
            setToken,
            loading,
            changePassword,
            message,
            setMessage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
