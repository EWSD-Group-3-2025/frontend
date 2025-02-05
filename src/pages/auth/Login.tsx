'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="container mx-auto flex w-full items-center justify-between px-4 py-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-x-8 gap-y-8 md:flex-row md:justify-between">
				{/* Login Form */}
				<div className="w-full max-w-md">
					<h1 className="mb-4 text-4xl font-semibold">
						Log in to Frontent
					</h1>

					<form className="space-y-4">
						<div>
							<Input
								type="email"
								placeholder="name@work-email.com"
								className="border-gray-600 bg-transparent text-white placeholder:text-gray-400"
							/>
						</div>
						<div className="relative">
							<Input
								type={showPassword ? 'text' : 'password'}
								placeholder="Password"
								className="border-gray-600 bg-transparent text-white placeholder:text-gray-400"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
							>
								{showPassword ? (
									<EyeOffIcon className="h-5 w-5" />
								) : (
									<EyeIcon className="h-5 w-5" />
								)}
							</button>
						</div>

						<div className="flex items-center justify-between text-sm text-gray-400">
							<Link
								to="/forgot-password"
								className="hover:text-white"
							>
								Forgot password?
							</Link>
						</div>

						<Button
							type="submit"
							className="w-full bg-[#F87B73] text-white hover:bg-[#ff8e87]"
						>
							Log in
						</Button>
					</form>
				</div>
				{/* Illustration */}
				<div className="w-full max-w-md">
					<div className="relative h-[400px] w-full md:h-[600px]">
						<img
							src="/img/login_img.png"
							alt="Decorative Illustration"
							className="h-full w-full object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
