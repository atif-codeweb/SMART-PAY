import {TrendingUp,TrendingDown} from 'lucide-react';

const StatsCard=({
    title,
    value,
    icon:Icon,
    color='blue',
    trend,
    trendValue
})=>{
    const colors={
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
        yellow: 'from-yellow-500 to-yellow-600'
    };
    return (
        <div className={`card bg-gradient-to-r${colors[color]} text-white`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                {Icon &&(
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Icon size={24}/>
                    </div>
                )}

            </div>

            {trend && trendValue && (
                <div className='flex items-center gap-1 text-sm'>
                    {trend==='up' ? (
                        <TrendingUp size={16}/>
                    ):(
                        <TrendingDown size={16}/>
                    )}
                    <span>{trendValue}% from last month</span>

                </div>
            )}

        </div>
    );
};
export default StatsCard;