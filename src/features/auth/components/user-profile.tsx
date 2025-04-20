import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth.context';
import {
	CircleX,
	Clock,
	KeyRound,
	LockKeyholeOpen,
	Mail,
	MessageCircle,
	MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import UserProfileEditForm from './user-profile-edit-form';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useOpenProfileStore } from '../store/use-open-profile-store';
import { useEffect, useState } from 'react';
import { USER_ROLE } from '@/constants';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export default function UserProfile() {
	const { user } = useAuth();
	const { isOpen: isOpenProfile, setIsOpen: setIsOpenProfile } =
		useOpenProfileStore();

	const [country, setCountry] = useState(null);

	if (!user) {
		return null;
	}

	useEffect(() => {
		const fetchCountry = async () => {
			try {
				const res = await fetch('https://ipapi.co/json/');
				const data = await res.json();
				setCountry(data.country_name); // e.g., United States
			} catch (error) {
				console.error('Failed to fetch country info:', error);
			}
		};

		fetchCountry();
	}, []);

	return (
		<div className="px-5 py-4">
			<div className="flex items-center gap-x-4">
				<Avatar className="size-20 border border-gray-300 dark:border-gray-600">
					<AvatarImage src={user?.name} alt={user?.name} />
					<AvatarFallback className="text-4xl">
						{user?.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="max-w-xs truncate text-ellipsis text-2xl font-medium">
						{user?.name}
					</p>
					<p className="text-base text-muted-foreground">
						@{user?.username}
					</p>
				</div>
			</div>
			{/* Tabs */}
			<Tabs defaultValue="overview" className="mt-5 w-full">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="contact">Contact</TabsTrigger>
					<TabsTrigger value="edit">Edit</TabsTrigger>
				</TabsList>
				<TabsContent
					value="overview"
					className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<div className="mt-4 space-y-3 border px-3 py-2">
						<div className="flex items-center gap-x-3">
							<CircleX className="size-5" />{' '}
							<span className="text-sm">Last seen 5/23/24</span>
						</div>
						<Separator />
						<div className="flex items-center gap-x-3">
							<MapPin className="size-5" />
							<span className="text-sm">{country}</span>
						</div>
						<Separator />
						<div className="flex items-center gap-x-3">
							{user.roleName === USER_ROLE.ADMIN ||
							user.roleName === USER_ROLE.STAFF ? (
								<>
									<KeyRound className="size-5" />
									<span className="text-sm">
										Department: {user.departmentName}
									</span>
								</>
							) : user.roleName === USER_ROLE.TUTOR ? (
								<>
									<LockKeyholeOpen className="size-5" />
									<span className="text-sm">
										Specialization:{' '}
										{user.specializationName}
									</span>
								</>
							) : user.roleName === USER_ROLE.STUDENT ? (
								<>
									<Clock className="size-5" />
									<span className="text-sm">
										Course: {user.courseName}
									</span>
								</>
							) : null}
						</div>
					</div>
					<div>
						<span>Contact information</span>
						<div className="mt-3 flex flex-col items-center justify-between gap-x-2 gap-y-3 lg:flex-row">
							<div className="flex w-full items-center justify-between gap-x-2 bg-secondary px-2 py-1 text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80">
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className="flex cursor-pointer items-center gap-x-2"
											onClick={() => {
												navigator.clipboard.writeText(
													user?.email
												);
											}}
										>
											<Mail />
											<div className="flex flex-col items-start">
												<span className="text-xs">
													Email
												</span>
												<span className="text-sm text-blue-600">
													{user?.email}
												</span>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Click to copy the email</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<div className="flex w-full items-center justify-between gap-x-2 bg-secondary px-2 py-1 text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80">
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className="flex cursor-pointer items-center gap-x-2"
											onClick={() => {
												navigator.clipboard.writeText(
													user?.email
												);
											}}
										>
											<MessageCircle />
											<div className="flex flex-col items-start">
												<span className="text-xs">
													Chat
												</span>
												<span className="text-sm text-blue-600">
													{user?.email}
												</span>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Click to copy the email</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>
					<div>
						<span>Settings</span>
						<div className="mt-3 flex flex-col gap-y-2">
							<Link
								to={'/change-password'}
								onClick={() => {
									if (isOpenProfile) {
										setIsOpenProfile(false);
									}
								}}
							>
								<Button
									className="flex w-full items-center justify-start"
									variant={'secondary'}
								>
									<LockKeyholeOpen /> Change Password
								</Button>
							</Link>
							<Link
								to={'/forgot-password'}
								onClick={() => {
									if (isOpenProfile) {
										setIsOpenProfile(false);
									}
								}}
							>
								<Button
									className="flex w-full items-center justify-start"
									variant={'secondary'}
								>
									<KeyRound /> Forgot Password
								</Button>
							</Link>
						</div>
					</div>
				</TabsContent>
				<TabsContent
					value="contact"
					className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<div className="mt-4 space-y-3 border px-3 py-2">
						<div className="flex items-center gap-x-3">
							<CircleX className="size-5" />{' '}
							<span className="text-sm">Last seen 5/23/24</span>
						</div>
						<Separator />
						<div className="flex items-center gap-x-3">
							<Clock className="size-5" />{' '}
							<span className="text-sm">
								{format(new Date(), 'hh:mm a')} - Your local
								time
							</span>
						</div>
					</div>
					<div>
						<span>Contact information</span>
						<div className="mt-3 flex flex-col items-center justify-between gap-x-2 gap-y-3 lg:flex-row">
							<div className="flex w-full items-center justify-between gap-x-2 bg-secondary px-2 py-1 text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80">
								<div className="flex items-center gap-x-2">
									<Mail />
									<div className="flex flex-col items-start">
										<span className="text-xs">Email</span>
										<span className="text-sm text-blue-600">
											{user?.email}
										</span>
									</div>
								</div>
							</div>
							<div className="flex w-full items-center justify-between gap-x-2 bg-secondary px-2 py-1 text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80">
								<div className="flex items-center gap-x-2">
									<MessageCircle />
									<div className="flex flex-col items-start">
										<span className="text-xs">Chat</span>
										<span className="text-sm text-blue-600">
											{user?.email}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
				<TabsContent
					value="edit"
					className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<UserProfileEditForm
						name={user.name}
						username={user.username}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
