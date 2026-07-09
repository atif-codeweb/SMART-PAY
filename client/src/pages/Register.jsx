import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link,useNavigate} from 'react-router-dom';
import {register} from '../store/slices/authSlice';
import {Wallet} from 'lucide-react';

function Register(){
    const [formData,setFormData]=useState({name:'',email:'',phone:'',password:''});
    const [error,setError]=useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const result=await dispatch(register(formData));
        if(result.type==='auth/register/fulfilled'){
            navigate('/');
        }else{
            setError(result.payload?.message|| 'message failed');
        }
    };
    return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone</label>
            <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" className="input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;