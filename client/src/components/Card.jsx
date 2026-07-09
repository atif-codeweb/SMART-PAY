const Card = ({ children, className = '', onClick }) => {
    return (
        <div onClick={onClick} className={`card ${className}`}>
            {children}
        </div>
    );
};

export default Card;
