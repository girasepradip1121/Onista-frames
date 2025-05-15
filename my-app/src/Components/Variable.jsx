export const API_URL = import.meta.env.VITE_API_URL;

export const userToken = () => {
    const userData = localStorage.getItem("token");
    if (!userData) return null; // Agar data nahi hai toh null return karo
    
    try {
        return JSON.parse(userData); // Safe parse
    } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
        return null;
    }
};
