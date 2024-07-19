const Header = ({ subtitle, props, className = "" }) => {
    return (
        <h2
            className={
                `font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight ` +
                className
            }
            {...props}
        >
            {subtitle}
        </h2>
    );
};

export default Header;
