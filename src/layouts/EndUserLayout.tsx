import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@/features/auth/components/user-button';
import { Link, Outlet } from 'react-router-dom';

export default function EndUserLayout() {
	return (
		<div>
			<div className="mx-auto flex max-w-6xl items-start justify-between px-5 py-3">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-x-2">
					<img src="/vite.svg" alt="Anima Logo" className="w-8" />
					<span className="font-bold">Frontend</span>
				</Link>
				<div className="flex items-center gap-x-3">
					<UserButton />
					<ModeToggle />
				</div>
			</div>
			<div className="p-5">
				<Outlet />
			</div>
		</div>
	);
}
