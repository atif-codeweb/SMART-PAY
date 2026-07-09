import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {ArrowLeft,User,Lock} from 'lucide-react';
import {userAPI} from '../services/api';

function Profile(){
    const {user}=useSelector((state)=>state.auth);
    const [activeTab,setActiveTab]=useState('profile');
    const [profileData,setProfileData]=useState({name:user?.name||'',email:user?.email||'',phone:user?.phone||''})
    const [passwordData,setPasswordData]=useState({currentPassword:'',newPassword:''});
    const navigate=useNavigate()

    const handleProfileUpdate=async(e)=>{
        e.preventDefault();
        try{
            await userAPI.updateProfile(profileData);
            alert('Profile Updated successfully')
        }catch(error){
            alert(error.response?.data?.message || 'Update Failed')
        }

    };
    const handlePasswordUpdate=async(e)=>{
        e.preventDefault();
        try{
            await userAPI.updatePassword(passwordData);
            alert('Password Updated Successfully')
            setPasswordData({currentPassword:'',newPassword:''})
        }catch(error){
            alert(error.response?.data?.message || 'Update Failed')
        }
    }
    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-6 text-primary">
          <ArrowLeft /> Back
        </button>

        <div className="card">
          <div className="flex gap-4 border-b dark:border-gray-700 mb-6">
            <button onClick={() => setActiveTab('profile')} className={`pb-3 px-4 font-semibold ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
              <User className="inline mr-2" size={20} />Profile
            </button>
            <button onClick={() => setActiveTab('security')} className={`pb-3 px-4 font-semibold ${activeTab === 'security' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
              <Lock className="inline mr-2" size={20} />Security
            </button>
          </div>

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" className="input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" className="input" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone</label>
                <input type="tel" className="input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary">Update Profile</button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" className="input" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" className="input" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

}
export default Profile;
