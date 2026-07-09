import {useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {Link,useNavigate} from 'react-router-dom';
import {login} from '../store/slices/authSlice';
import {Wallet,Eye,EyeOff} from 'lucide-react';

function Login(){
    const [formData,setFormData]=useState({email:'',password:''});
    const [showPassword,setShowPassword]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {loading,error}=useSelector((state)=>state.auth);


    const handleSubmit=async(e)=>{
        e.preventDefault();
        const result=await dispatch(login(formData));
        if(result.type==='auth/login/fulfilled'){
            navigate('/')
        }
    };
    return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wallet className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartPay Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input pr-12"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-primary font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;