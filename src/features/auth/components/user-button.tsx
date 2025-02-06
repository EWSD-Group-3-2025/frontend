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
import { type User as UserType } from '@/features/users/types';
import { LogOut, User } from 'lucide-react';

interface UserButtonProps {
	user?: UserType | null;
}

export function UserButton({ user }: UserButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative size-10 rounded-full"
				>
					<Avatar className="size-10">
						<AvatarImage src={user?.name} alt={user?.name} />
						<AvatarFallback>
							{user?.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex items-center gap-x-2">
						<Avatar className="size-8">
							<AvatarImage src={user?.name} alt={user?.name} />
							<AvatarFallback>
								{user?.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user?.name}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.email}
							</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User /> Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="bg-red-500 text-white focus:bg-red-600 focus:text-neutral-100">
					<LogOut /> Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
