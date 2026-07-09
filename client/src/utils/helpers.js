export const formatCurrency=(amount)=>{
    return new Intl.NumberFormat('en-PK',{
        style:'currency',
        currency:'PKR',
        minimumFractionDigits:0,
    }).format(amount);
};

export const formatDate=(date)=>{
    return new Date(date).toLocaleDateString('en-US',{
        year:'numeric',
        month:'short',
        day:'numeric'
    });
};

export const formatDateTime=(date)=>{
    return new Date(date).toLocaleString('en-US',{
        year:'numeric',
        month:'short',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    });
};

export const validatePhone=(phone)=>{
    const phoneRegex=/^03[0-9]{9}$/;
    return phoneRegex.test(phone);
};

export const validateEmail=(email)=>{
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const generateReference=()=>{
    return 'REF' + Date.now() + Math.random().toString(36).substring(2,9).toUpperCase();

}

export const truncateText=(text,length=50)=>{
    if(text.length<=length) return text;
    return text.substring(0,length)+ '....';
}

export const getTransactionColor=(type,userId,senderId)=>{
    if(type==='receive' || senderId!==userId){
        return 'text-green-600'
    }
    return 'text-red-600';
};

export const getTransactionSign=(type,userId,senderId)=>{
    if(type=='receive' || senderId!==userId){
        return '+'
    }
    return '-';
};

export const calculatePercentage=(value,total)=>{
    if(total===0) return 0;
    return ((value/total)*100).toFixed(1);
};


//get initials from name
export const getInitials=(name)=>{
    if(!name) return 'U';
    const parts=name.split(' ');
    if(parts.length>=2){
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0,2).toUpperCase();
};


export const debounce=(func,wait)=>{
    let timeout;
    return function executedFunction(...args){
        const later=()=>{
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout=setTimeout(later,wait);
    };
};

export const groupTransactionsByDate=(transactions)=>{
    const grouped={}
    transactions.forEach(transaction=>{
        const date=formatDate(transaction.createdAt);
        if(!grouped[date]){
            grouped[date]=[];
        }
        grouped[date].push(transaction);
    });
    return grouped;
};

export const getBudgetStatus=(spent,limit)=>{
    const percentage=(spent/limit)*100;

    if(percentage>=90) return {status:'danger',color:'red'};
    if(percentage>=70) return {status:'warning',color:'yellow'};
    return {status:'good',color:'green'}
};

export const formatPhoneDisplay=(phone)=>{
    if(!phone || phone.length!==11) return phone;
    return `${phone.substring(0,4)} ${phone.substring(4,7)} ${phone.substring(7)}`;

};