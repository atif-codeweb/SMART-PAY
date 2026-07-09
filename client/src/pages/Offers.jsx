import {useState,useEffect} from 'react';
import {useNavigate} from  'react-router-dom';
import {ArrowLeft,Gift,Percent,Tag} from 'lucide-react';
import {adminAPI} from '../services/api';
import {formatDate} from '../utils/helpers';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Offers=()=>{
    const navigate=useNavigate();
    const [offers,setOffers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [filter,setFilter]=useState('all');

    useEffect(()=>{
        loadOffers();
    },[]);

    const loadOffers=async ()=>{
        try{
            const {data}=await adminAPI.getOffers();
            setOffers(data.offers);
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false);
        }
    };
    const filteredOffers=offers.filter(offer=>
        filter==='all' || offer.category===filter
    );
    const categories=[
        {value:'all',label:'All Offers'},
        { value: 'transfer', label: 'Money Transfer' },
        { value: 'bill_payment', label: 'Bill Payment' },
        { value: 'recharge', label: 'Recharge' }
    ];
    if(loading) return <Loader fullScreen/>
    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Gift className="text-primary" />
              Offers & Rewards
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Exclusive deals and cashback offers
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`
                px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors
                ${filter === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredOffers.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No offers available"
            description="Check back later for exciting deals and cashback offers"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer._id} className="relative overflow-hidden">
                {offer.cashback > 0 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {offer.cashback}% Cashback
                  </div>
                )}

                <div className="mb-4">
                  <div className="w-full h-32 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Percent size={48} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {offer.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {offer.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Valid till:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(offer.validTo)}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${offer.category === 'all' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }
                    `}>
                      {offer.category === 'all' ? 'All Categories' : offer.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Offers;
