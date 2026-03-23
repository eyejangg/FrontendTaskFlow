import { create } from "zustand";
import { axiosInstance as api } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // ❸ Check Auth → เปิดเว็บ → ส่ง Cookie ไปถาม Backend
    checkAuth: async () => {
        try {
            const res = await api.get("/user/check"); // เช็คว่ามี Cookie ไหม
            const mappedUser = res.data ? { ...res.data, name: res.data.fullname, profilePic: res.data.profilePicture } : null; 
            // map ข้อมูล ให้ตรงกับ frontend 
            set({ authUser: mappedUser }); // set ข้อมูล authUser
        } catch {
            set({ authUser: null }); // ถ้าไม่มี Cookie ให้ set authUser เป็น null
        } finally {
            set({ isCheckingAuth: false }); // set isCheckingAuth เป็น false
        }
    },

    // ❷ Register → สร้างบัญชี
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            await api.post("/user/register", data);
            // ตามโจทย์ก่อนหน้า: Register แล้ว ต้องเด้งไปหน้า Login (ไม่ให้ล็อกอินอัตโนมัติ)
            await api.post("/user/logout").catch(() => {});
            set({ authUser: null }); 
            toast.success("Account created successfully! Please login.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            await api.post("/user/login", data);
            const userRes = await api.get("/user/check");
            const mappedUser = userRes.data ? { ...userRes.data, name: userRes.data.fullname, profilePic: userRes.data.profilePicture } : null;
            set({ authUser: mappedUser });
            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await api.post("/user/logout"); 
            set({ authUser: null }); 
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await api.put("/user/update-profile", data); 
            const user = res.data.user; 
            const mappedUser = user ? { ...user, name: user.fullname, profilePic: user.profilePicture } : null;
            set({ authUser: mappedUser }); 
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));
