import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
	return (
		<div className="h-screen bg-[#2A2A2A] text-white">
			<div className="mx-auto flex max-w-6xl items-start justify-between py-4">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-x-2">
					<img src="/vite.svg" alt="Anima Logo" className="w-8" />
					<span className="font-bold">Frontend</span>
				</Link>
			</div>
			<Outlet />
		</div>
	);
}
