import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	placeholder?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	({ placeholder, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<div className="relative">
				<Input
					type={showPassword ? 'text' : 'password'}
					placeholder={placeholder || 'Enter your password'}
					{...props}
					ref={ref}
				/>
				<Button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					variant="ghost"
					size="icon"
					className="absolute right-2 top-1/2 -translate-y-1/2 transform hover:bg-transparent"
				>
					{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
				</Button>
			</div>
		);
	}
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
