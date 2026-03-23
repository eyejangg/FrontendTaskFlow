import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import { Plus, Loader2, Trash2, Edit2, Calendar, Clock, CheckCircle, Circle, Eye, CheckSquare, X, ListTodo, AlignLeft, AlertCircle, Tag, Bot, Coffee, Flower2, PlusCircle, MinusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

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
    category: "other",
    dueDate: "",
    subTasks: [],
  });

  useEffect(() => {
    fetchTasks();
    
    // Gimmick: AI Smart Suggestion Toast
    const timer = setTimeout(() => {
      toast("🤖 AI วิเคราะห์: คุณมักจะทำงานลำดับความสำคัญสูงเสร็จเร็วขึ้นในตอนเช้า! ☕ ลองจัดตารางงาน 'ด่วน' ในวันพรุ่งนี้เลยไหม?", {
        duration: 7000,
        position: 'bottom-right',
        style: {
          background: '#fdf4ff',
          color: '#701a75',
          border: '1px solid #fbcfe8',
          padding: '16px',
        },
      });
    }, 5000); // 5 seconds after page loads
    
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        category: task.category || "other",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
        subTasks: task.subTasks || [],
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        category: "other",
        dueDate: "",
        subTasks: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const addSubTask = () => {
    setFormData({
      ...formData,
      subTasks: [...formData.subTasks, { title: "", isCompleted: false }]
    });
  };

  const removeSubTask = (index) => {
    const newSubTasks = [...formData.subTasks];
    newSubTasks.splice(index, 1);
    setFormData({ ...formData, subTasks: newSubTasks });
  };

  const handleSubTaskChange = (index, value) => {
    const newSubTasks = [...formData.subTasks];
    newSubTasks[index].title = value;
    setFormData({ ...formData, subTasks: newSubTasks });
  };

  const toggleSubTask = (task, subTaskIndex) => {
    const newSubTasks = [...task.subTasks];
    newSubTasks[subTaskIndex].isCompleted = !newSubTasks[subTaskIndex].isCompleted;
    updateTask(task._id, { subTasks: newSubTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    // Filter out empty subtasks
    const finalSubTasks = formData.subTasks.filter(st => st.title.trim() !== "");
    
    // Format date properly if exists
    const submitData = { ...formData, subTasks: finalSubTasks };
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
      case "high": return { label: "ด่วน 🔥", style: "text-rose-600 bg-rose-100 border-rose-200", borderClass: "border-l-rose-500" };
      case "medium": return { label: "ปานกลาง", style: "text-amber-600 bg-amber-100 border-amber-200", borderClass: "border-l-amber-400" };
      case "low": return { label: "ต่ำ 🌱", style: "text-emerald-600 bg-emerald-100 border-emerald-200", borderClass: "border-l-emerald-400" };
      default: return { label: priority, style: "text-slate-600 bg-slate-100", borderClass: "border-l-slate-300" };
    }
  };
  
  const getCategoryInfo = (cat) => {
    switch (cat) {
      case "work": return { label: "ทำงาน 💼", style: "bg-blue-50 text-blue-600" };
      case "personal": return { label: "ส่วนตัว 🏠", style: "bg-purple-50 text-purple-600" };
      case "study": return { label: "เรียน 📚", style: "bg-orange-50 text-orange-600" };
      default: return { label: "ทั่วไป 🌱", style: "bg-slate-50 text-slate-600" };
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
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Bot className="size-10 text-primary-500" /> แดชบอร์ดงานของฉัน 
          </h1>
          <p className="text-slate-500 mt-2 text-lg flex items-center gap-2">
            ยินดีต้อนรับกลับมา, <span className="font-semibold text-primary-600 underline decoration-primary-200 decoration-2 underline-offset-4">{authUser?.name || authUser?.fullname}</span> ☕ 🌱
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
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <CheckSquare className="size-12 text-primary-400" />
            <div className="absolute -top-2 -right-2 transform rotate-12">
              <Coffee className="size-8 text-amber-400 opacity-60" />
            </div>
            <div className="absolute -bottom-2 -left-2 transform -rotate-12">
              <Flower2 className="size-8 text-emerald-400 opacity-60" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">ยังไม่มีงานเลย 🌱 ☕</h3>
          <p className="text-slate-500 mt-2 mb-8 text-lg">สร้างงานชิ้นแรกของคุณเพื่อเริ่มต้นจัดการชีวิตให้ง่ายขึ้น</p>
          <button 
            onClick={() => handleOpenModal()}
            className="text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-6 py-3 rounded-xl transition-colors inline-block"
          >
            + เพิ่มงานแรกของฉัน
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tasks.map((task) => (
            <div key={task._id} className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200/50 border-l-[8px] ${getPriorityInfo(task.priority).borderClass} p-7 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1.5 transition-all duration-500 group flex flex-col relative overflow-hidden`}>
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-primary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-6 relative z-20">
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border border-transparent ${getCategoryInfo(task.category || 'other').style}`}>
                      {getCategoryInfo(task.category || 'other').label}
                    </span>
                    {task.status === "in-progress" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                           ⚙️ {getStatusLabel(task.status)}
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

              {/* Sub-tasks Progress */}
              {task.subTasks && task.subTasks.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
                    <span>งานย่อย ({task.subTasks.filter(st => st.isCompleted).length}/{task.subTasks.length})</span>
                    <span>{Math.round((task.subTasks.filter(st => st.isCompleted).length / task.subTasks.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-500" 
                      style={{ width: `${(task.subTasks.filter(st => st.isCompleted).length / task.subTasks.length) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    {task.subTasks.slice(0, 3).map((st, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/st cursor-pointer" onClick={() => toggleSubTask(task, idx)}>
                        {st.isCompleted ? (
                          <CheckCircle className="size-3 text-emerald-400" />
                        ) : (
                          <Circle className="size-3 text-slate-300 group-hover/st:text-primary-400" />
                        )}
                        <span className={`text-xs truncate ${st.isCompleted ? 'text-slate-300 line-through' : 'text-slate-500'}`}>{st.title}</span>
                      </div>
                    ))}
                    {task.subTasks.length > 3 && (
                      <p className="text-[10px] text-slate-400 italic mt-1">+ อีก {task.subTasks.length - 3} รายการ</p>
                    )}
                  </div>
                </div>
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
                
                <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all duration-300">
                  <Link 
                    to={`/tasks/${task._id}`}
                    className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"
                    title="รายละเอียด"
                  >
                    <Eye className="size-5" />
                  </Link>
                  <button 
                    onClick={() => handleOpenModal(task)}
                    className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all"
                    title="แก้ไข"
                  >
                    <Edit2 className="size-5" />
                  </button>
                  <button 
                    onClick={() => {
                        if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้เรถาวร?')) {
                            deleteTask(task._id);
                        }
                    }}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                    title="ลบงาน"
                  >
                    <Trash2 className="size-5" />
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
                    <option value="low">ต่ำ 🌱</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">ด่วน 🔥</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Tag className="size-4 text-slate-400" /> หมวดหมู่ (Category)
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium font-sans cursor-pointer appearance-none"
                  >
                    <option value="other">ทั่วไป 🌱</option>
                    <option value="work">ทำงาน 💼</option>
                    <option value="personal">ส่วนตัว 🏠</option>
                    <option value="study">เรียน 📚</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" /> วันที่กำหนดส่ง
                  </label>
                  <input 
                    type="datetime-local" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium cursor-text"
                  />
                </div>
              </div>

              {/* Sub-tasks Editor Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ListTodo className="size-4 text-slate-400" /> งานย่อย (Sub-tasks)
                  </label>
                  <button 
                    type="button" 
                    onClick={addSubTask}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <PlusCircle className="size-3.5" /> เพิ่มรายการ
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formData.subTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-xl">ไม่มีงานย่อย</p>
                  ) : (
                    formData.subTasks.map((st, index) => (
                      <div key={index} className="flex gap-2 items-center animate-fade-in">
                        <input 
                          type="text"
                          value={st.title}
                          onChange={(e) => handleSubTaskChange(index, e.target.value)}
                          placeholder={`งานย่อยที่ ${index + 1}...`}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm text-slate-700"
                        />
                        <button 
                          type="button"
                          onClick={() => removeSubTask(index)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <MinusCircle className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
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
