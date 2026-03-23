import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  fetchTasks: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/tasks");
      set({ tasks: res.data.data || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลงาน");
    } finally {
      set({ isFetching: false });
    }
  },

  fetchTaskById: async (id) => {
    // Note: The backend doesn't currently have a dedicated GET /tasks/:id route in task.route.js
    // We can filter from the existing tasks array for now
    const { tasks } = get();
    const task = tasks.find((t) => t._id === id);
    if (task) {
      set({ currentTask: task });
    } else {
      set({ currentTask: null });
    }
  },

  createTask: async (taskData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/tasks", taskData);
      set((state) => ({ tasks: [res.data.data, ...state.tasks] }));
      toast.success("สร้างงานใหม่สำเร็จ! 🚀");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ไม่สามารถสร้างงานได้ โปรดลองอีกครั้ง");
      return false;
    } finally {
      set({ isCreating: false });
    }
  },

  updateTask: async (id, taskData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? res.data.data : task
        ),
      }));
      
      // Contextual Toast Message based on action
      if (Object.keys(taskData).length === 1 && taskData.status) {
        if (taskData.status === "completed") {
          toast.success("ทำเสร็จสิ้นไปอีกหนึ่งงาน! 🎉");
        } else if (taskData.status === "todo") {
          toast.success("ย้อนกลับมารอดำเนินการ ⏳");
        } else if (taskData.status === "in-progress") {
          toast.success("กำลังดำเนินการ! ⚙️");
        }
      } else {
        toast.success("บันทึกการแก้ไขงานเรียบร้อย 📝");
      }
      
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ไม่สามารถอัปเดตงานได้ โปรดลองอีกครั้ง");
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteTask: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
      toast.success("ลบงานออกจากระบบแล้ว 🗑️");
    } catch (error) {
      toast.error(error.response?.data?.message || "ไม่สามารถลบงานได้");
    } finally {
      set({ isDeleting: false });
    }
  },
}));
