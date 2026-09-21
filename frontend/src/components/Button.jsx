import { forwardRef } from 'react';

const Button = forwardRef(function Button({ children, variant = 'primary', className = '', loading = false, ...props }, ref) { return <button ref={ref} className={`btn btn-${variant} ${className}`} disabled={loading || props.disabled} {...props}>{loading ? <span className="button-loader" /> : children}</button>; });
export default Button;
