import {ArrowUpRight,ArrowDownLeft,Receipt,Smartphone,Zap,Wifi} from 'lucide-react';
import {formatCurrency,formatDateTime} from '../utils/helpers';
import {useAuth} from '../hooks/useAuth';

const TransactionCard=({transaction,onClick})=>{
    const {user}=useAuth();

    const isReceived=transaction.receiver?._id===user?.id || transaction.type==='receive';
    const isSent=transaction.sender?._id===user.id && transaction.type==='send';

    const getIcon=()=>{
        if(transaction.type==='bill_payment'){
            if(transaction.category==='electricity') return Zap;
            if(transaction.category==='internet') return Wifi;
            if(transaction.category==='mobile') return Smartphone;
            return Receipt;
        }
        return isReceived ? ArrowDownLeft : ArrowUpRight;

    };
    const getTitle=()=>{
        if(transaction.description) return transaction.description;
        if(transaction.type==='bill_payment') return `${transaction.category} Bill`;
        if(isReceived)return  `Received from ${transaction.sender?.name || 'UnKnown'}`;
        if(isSent) return `Sent to ${transaction.receiver?.name || transaction.receiverPhone}`;
        return transaction.type;
    };

    const Icon=getIcon();
    const isPositive=isReceived;

    return(
        <div
          onClick={onClick}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}
        `}>
            <Icon
              size={24}
              className={isPositive?'text-green-600':'text-red-600'}
            />
        </div>
        <div>
            <p className="font-semibold text-gray-900 dark:text-white">
                {getTitle()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(transaction.createdAt)}
            </p>
            {transaction.status!=='completed' && (
                <span className={`
                    text-xs px-2 py-1 rounded-full mt-1 inline-block
                    ${transaction.status==='pending'?'bg-yellow-100 text-yellow-800':'bg-red-100 text-red-800'}
                    `}>
                        {transaction.status}
                    </span>
            )}
        </div>

        </div>
        <div className="text-right">
            <p className={`
              font-bold text-lg
              ${isPositive ? 'text-green-600':'text-red-600'}
            `}>
                {isPositive?'+':'-'}{formatCurrency(transaction.amount)}
            </p>
            {transaction.cashback>0 && (
                <p className='text-xs text-green-600'>+{formatCurrency(transaction.cashback)} cashback</p>
            )}

        </div>

        </div>
    );

};
export default TransactionCard;