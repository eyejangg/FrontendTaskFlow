import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";
import { ArrowLeft, Calendar, Flag, CheckCircle, Circle, Trash2, Edit2, Clock } from "lucide-react";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, fetchTaskById, tasks, deleteTask, updateTask } = useTaskStore();

  useEffect(() => {
    fetchTaskById(id);
  }, [id, tasks, fetchTaskById]);

  if (!currentTask) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="size-10 text-slate-300 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">ไม่พบงานนี้ หรือระบบกำลังโหลด...</h2>
        <Link to="/" className="text-primary-600 hover:bg-primary-50 font-medium px-6 py-2 rounded-xl mt-6 inline-flex items-center justify-center transition-colors">
          <ArrowLeft className="size-4 mr-2" /> กลับไปแดชบอร์ด
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานชิ้นนี้ถาวร?")) {
      await deleteTask(currentTask._id);
      navigate("/");
    }
  };

  const toggleStatus = () => {
    const newStatus = currentTask.status === "completed" ? "todo" : "completed";
    updateTask(currentTask._id, { status: newStatus });
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high": return { label: "สูง", style: "text-rose-700 bg-rose-100" };
      case "medium": return { label: "ปานกลาง", style: "text-amber-700 bg-amber-100" };
      case "low": return { label: "ต่ำ", style: "text-emerald-700 bg-emerald-100" };
      default: return { label: priority, style: "text-slate-600 bg-slate-100" };
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="text-slate-500 hover:text-primary-600 font-bold mb-8 inline-flex items-center transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
        <ArrowLeft className="size-4 mr-2" /> กลับไปหน้ารวมงาน
      </Link>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Accent top banner */}
        <div className={`h-3 w-full ${currentTask.priority === 'high' ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'}`} />
        
        <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-start gap-6">
          <div className="flex items-start gap-5">
            <button onClick={toggleStatus} className="mt-1 flex-shrink-0 focus:outline-none transform hover:scale-110 transition-transform">
              {currentTask.status === "completed" ? (
                <CheckCircle className="size-10 text-emerald-500 drop-shadow-md" />
              ) : (
                <Circle className="size-10 text-slate-300 hover:text-primary-500 transition-colors" />
              )}
            </button>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${currentTask.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {currentTask.title}
              </h1>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${getPriorityInfo(currentTask.priority).style}`}>
                  <Flag className="size-4 mr-1.5" />
                  ความสำคัญ{getPriorityInfo(currentTask.priority).label}
                </span>
                
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-100">
                  <Clock className="size-4 mr-1.5" />
                  สถานะ: {getStatusLabel(currentTask.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleDelete}
              className="p-3 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors tooltip tooltip-left"
              title="ลบงานทิ้ง"
            >
              <Trash2 className="size-6" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-slate-50/50">
          <div className="mb-10">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
               รายละเอียดงาน
            </h3>
            {currentTask.description ? (
              <p className="text-slate-700 text-lg whitespace-pre-line leading-relaxed p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                {currentTask.description}
              </p>
            ) : (
              <p className="text-slate-400 italic bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">ไม่มีคำอธิบายสำหรับงานนี้</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-5 rounded-2xl">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                <Calendar className="size-4 mr-2 text-primary-400" /> วันกำหนดส่ง
              </h3>
              <p className={`text-lg font-bold ${currentTask.dueDate && new Date(currentTask.dueDate) < new Date() && currentTask.status !== 'completed' ? 'text-rose-600' : 'text-slate-800'}`}>
                {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' }) : "ไม่ได้กำหนด"}
              </p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                <Clock className="size-4 mr-2 text-primary-400" /> สร้างเมื่อ
              </h3>
              <p className="text-slate-800 text-lg font-bold">
                {new Date(currentTask.createdAt).toLocaleDateString('th-TH', { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
