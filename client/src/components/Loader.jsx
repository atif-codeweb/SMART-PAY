import {Loader2} from 'lucide-react';

const Loader=({size='md',fullScreen=false,text='Loading....'})=>{
    const sizes={
        sm:24,
        md:48,
        lg:72
    };
    if(fullScreen){
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
            <Loader2 className="animate-spin text-primary mx-auto mb-4" size={sizes[size]} />
            <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
            </div>
        </div>
        );
    }
    return(
        <div className="flex items-center justify-center p-8">
        <div className="text-center">
            <Loader2 className="animate-spin text-primary mx-auto mb-2" size={sizes[size]} />
            <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>
        </div>
        </div>
    );
}
export default Loader;