import  {Inbox} from 'lucide-react'
import Button from './Button';
const EmptyState=({
    icon:Icon=Inbox,
    title='No data found',
    description,
    actionLabel,
    onAction
})=>{
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
               <Icon size={48} className="text-gray-400"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
               {title} 
            </h3>
            {description && (
                <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-md'>
                    {description}
                </p>
            )}
            {actionLabel && onAction &&(
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}

        </div>
    )
}
export default  EmptyState;