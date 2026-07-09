export const TRANSACTION_TYPES={
    SEND:'send',
    RECEIVE:'receive',
    BILL_PAYMENT:'bill_payment',
    RECHARGE:'recharge',
    REQUEST:'request'
}

export const TRANSACTION_STATUS={
    PENDING:'pending',
    COMPLETED:'completed',
    FAILED:'failed'
};

export const BILL_CATEGORIES=[
    {value:'electricity',label:'Electricity',color:'yellow'},
    {value:'internet',label:'Internet',color:'blue'},
    {value:'mobile',label:'Mobile Recharge',color:'green'}

];

export const USER_ROLES={
    USER:'user',
    ADMIN:'admin'
};

export const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6'
};

export const SPENDING_CATEGORIES = [
  { value: 'transfer', label: 'Money Transfer', icon: '💸' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'internet', label: 'Internet', icon: '📡' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'other', label: 'Other', icon: '🏪' }
];

export const QUICK_AMOUNTS=[500,1000,2000,5000,10000];


export const NOTIFICATION_TYPES={
    SUCCESS:'success',
    ERROR:'error',
    WARNING:'warning',
    INFO:'info'
};

export const PAGINATION={
    DEFAULT_PAGE:1,
    DEFAULT_LIMIT:10,
    LIMIT:[10,25,50,100]
}
export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];

export const EXPORT_FORMATS={
    PDF:'pdf',
    CSV:'csv',
    EXCEL:'excel'
}