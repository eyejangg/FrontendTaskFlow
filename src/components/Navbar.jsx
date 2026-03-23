import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, CheckSquare } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <CheckSquare className="size-5 text-primary-600" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                TaskFlow Mini
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {authUser ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  {authUser.profilePicture ? (
                    <img src={authUser.profilePicture} className="w-8 h-8 rounded-full object-cover border border-slate-200" alt="avatar" />
                  ) : null}
                  <span className="hidden sm:inline-block">{authUser.name || authUser.fullname}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                  title="ออกจากระบบ"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline-block">ออกจากระบบ</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
