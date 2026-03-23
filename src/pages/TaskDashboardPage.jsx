import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import { Plus, Loader2, Trash2, Edit2, Calendar, Clock, CheckCircle, Circle, Eye, CheckSquare, X, ListTodo, AlignLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

const TaskDashboardPage = () => {
  const { authUser } = useAuthStore();
  const { tasks, fetchTasks, isFetching, deleteTask, createTask, updateTask, isCreating, isUpdating } = useTaskStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    // Format date properly if exists
    const submitData = { ...formData };
    if (!submitData.dueDate) delete submitData.dueDate;

    if (editingTask) {
      success = await updateTask(editingTask._id, submitData);
    } else {
      success = await createTask(submitData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const toggleStatus = (task) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    if (newStatus === "completed") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        zIndex: 200,
      });
    }
    updateTask(task._id, { status: newStatus });
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high": return { label: "สูง", style: "text-rose-600 bg-rose-100 border-rose-200", borderClass: "border-l-rose-500" };
      case "medium": return { label: "ปานกลาง", style: "text-amber-600 bg-amber-100 border-amber-200", borderClass: "border-l-amber-400" };
      case "low": return { label: "ต่ำ", style: "text-emerald-600 bg-emerald-100 border-emerald-200", borderClass: "border-l-emerald-400" };
      default: return { label: priority, style: "text-slate-600 bg-slate-100", borderClass: "border-l-slate-300" };
    }
  };
  
  const getStatusLabel = (status) => {
      switch (status) {
          case "todo": return "ต้องทำ";
          case "in-progress": return "กำลังทำ";
          case "completed": return "เสร็จสิ้น";
          default: return status;
      }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">แดชบอร์ดงานของฉัน</h1>
          <p className="text-slate-500 mt-2 text-lg">
            ยินดีต้อนรับกลับมา, <span className="font-semibold text-primary-600">{authUser?.name || authUser?.fullname}</span> 👋
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 px-6 rounded-2xl flex items-center transition-all shadow-lg shadow-primary-500/30 transform hover:-translate-y-0.5"
        >
          <Plus className="size-5 mr-2" />
          สร้างงานใหม่
        </button>
      </div>

      {isFetching && tasks.length === 0 ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="size-12 animate-spin text-primary-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center transform transition-all hover:shadow-md">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="size-12 text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">ยังไม่มีงานเลย</h3>
          <p className="text-slate-500 mt-2 mb-8 text-lg">สร้างงานชิ้นแรกของคุณเพื่อเริ่มต้นจัดการชีวิตให้ง่ายขึ้น</p>
          <button 
            onClick={() => handleOpenModal()}
            className="text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-6 py-3 rounded-xl transition-colors inline-block"
          >
            + เพิ่มงานแรกของฉัน
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className={`bg-white rounded-3xl shadow-sm border border-slate-200 border-l-[6px] ${getPriorityInfo(task.priority).borderClass} p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden`}>
              
              <div className="flex justify-between items-start mb-5 relative z-20">
                <button 
                  onClick={() => toggleStatus(task)}
                  className="mt-1 flex-shrink-0 focus:outline-none transform hover:scale-110 transition-transform"
                >
                  {task.status === "completed" ? (
                    <CheckCircle className="size-7 text-emerald-500 drop-shadow-sm" />
                  ) : (
                    <Circle className="size-7 text-slate-300 hover:text-primary-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 ml-4 overflow-hidden">
                  <Link to={`/tasks/${task._id}`}>
                    <h3 className={`font-bold text-lg leading-tight transition-all duration-500 block relative ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-800 hover:text-primary-600'}`} title={task.title}>
                      <span className="relative inline-block w-full truncate">
                        {task.title}
                        <span className={`absolute left-0 top-1/2 h-[2px] bg-slate-400 transition-all duration-300 ease-out origin-left ${task.status === 'completed' ? 'w-full scale-x-100' : 'w-full scale-x-0'}`}></span>
                      </span>
                    </h3>
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityInfo(task.priority).style}`}>
                      {getPriorityInfo(task.priority).label}
                    </span>
                    {task.status === "in-progress" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          {getStatusLabel(task.status)}
                        </span>
                    )}
                  </div>
                </div>
              </div>
              
              {task.description && (
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {task.description}
                  </p>
              )}
              
              <div className="mt-auto pt-5 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium">
                  {task.dueDate ? (
                      <>
                        <Calendar className={`size-4 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-rose-600' : ''}>
                          {new Date(task.dueDate).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                        </span>
                      </>
                  ) : (
                      <span className="text-slate-400 text-xs italic">ไม่มีกำหนด</span>
                  )}
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link 
                    to={`/tasks/${task._id}`}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                    title="รายละเอียด"
                  >
                    <Eye className="size-4.5" />
                  </Link>
                  <button 
                    onClick={() => handleOpenModal(task)}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                    title="แก้ไข"
                  >
                    <Edit2 className="size-4.5" />
                  </button>
                  <button 
                    onClick={() => {
                        if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้เรถาวร?')) {
                            deleteTask(task._id);
                        }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="ลบงาน"
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Glassmorphism Modal for Create/Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] transition-all">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100/50 bg-slate-50/50">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-2">
                {editingTask ? <Edit2 className="size-6 text-primary-500" /> : <Plus className="size-6 text-primary-500" />}
                {editingTask ? "แก้ไขงาน" : "สร้างงานใหม่"}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <X className="size-5" />
              </button>
            </div>
            
            {/* Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ListTodo className="size-4 text-slate-400" /> ชื่อเรื่อง
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="คุณต้องทำอะไรบ้าง?"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlignLeft className="size-4 text-slate-400" /> รายละเอียด (ไม่บังคับ)
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all text-slate-700"
                  rows="3"
                  placeholder="เพิ่มรายละเอียดของงานสักหน่อย..."
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <CheckCircle className="size-4 text-slate-400" /> สถานะ
                  </label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium font-sans cursor-pointer appearance-none"
                  >
                    <option value="todo">ต้องทำ</option>
                    <option value="in-progress">กำลังทำ</option>
                    <option value="completed">เสร็จสิ้น</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <AlertCircle className="size-4 text-slate-400" /> ความสำคัญ
                  </label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium font-sans cursor-pointer appearance-none"
                  >
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">สูง</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar className="size-4 text-slate-400" /> วันที่กำหนดส่ง (ไม่บังคับ)
                </label>
                <input 
                  type="datetime-local" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium cursor-text"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {isCreating || isUpdating ? <Loader2 className="size-5 animate-spin mr-2" /> : null}
                  {editingTask ? "อัปเดตงาน" : "บันทึกงานใหม่"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboardPage;
