import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import ResponsiveModal from '@/components/responsive-modal';
import UserProfile from './user-profile';
import { useOpenProfileStore } from '../store/use-open-profile-store';
import { Skeleton } from '@/components/ui/skeleton';

export function UserButton() {
	const { user, logout, loading } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const { isOpen: isOpenProfile, setIsOpen: setIsOpenProfile } =
		useOpenProfileStore();

	if (!user && loading) {
		return <Skeleton className="size-10 rounded-full" />;
	}

	if (!user && !loading) {
		return null;
	}

	return (
		<>
			<ResponsiveModal
				isOpen={isOpenProfile}
				setIsOpen={setIsOpenProfile}
			>
				<UserProfile />
			</ResponsiveModal>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative size-10 rounded-full"
					>
						<Avatar className="size-10 border border-gray-300 dark:border-gray-600">
							<AvatarImage src={user?.name} alt={user?.name} />
							<AvatarFallback className="text-xl">
								{user?.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex items-center gap-x-2">
							<Avatar className="size-8 border border-gray-300 dark:border-gray-600">
								<AvatarImage
									src={user?.name}
									alt={user?.name}
								/>
								<AvatarFallback>
									{user?.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex w-40 flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{user?.name}
								</p>
								<abbr
									title={user?.email}
									className="no-underline"
								>
									<p className="overflow-hidden text-ellipsis text-xs leading-none text-muted-foreground">
										{user?.email}
									</p>
								</abbr>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setIsOpenProfile(true)}>
						<User /> Profile
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={logout}
						className="bg-red-500 text-white focus:bg-red-600 focus:text-neutral-100"
					>
						<LogOut /> Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
