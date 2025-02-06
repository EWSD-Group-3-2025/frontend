import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth.context';
import { CircleX, Clock, Mail, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function UserProfile() {
	const { user } = useAuth();

	return (
		<div className="px-5 py-4">
			<div className="flex items-center gap-x-4">
				<Avatar className="size-16">
					<AvatarImage src={user?.name} alt={user?.name} />
					<AvatarFallback>
						{user?.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="text-xl font-medium">{user?.name}</p>
				</div>
			</div>
			{/* Tabs */}
			<Tabs defaultValue="overview" className="mt-5 w-full">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="contact">Contact</TabsTrigger>
					<TabsTrigger value="edit">Edit</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-5">
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
						<div className="mt-3 flex items-center justify-between gap-x-2">
							<div className="flex w-full items-center gap-x-2 px-2 py-1 transition-all hover:bg-neutral-100">
								<Mail />
								<div className="flex flex-col items-start">
									<span className="text-xs">Email</span>
									<span className="text-sm text-blue-600">
										{user?.email}
									</span>
								</div>
							</div>
							<div className="flex w-full items-center gap-x-2 px-2 py-1 transition-all hover:bg-neutral-100">
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
				</TabsContent>
				<TabsContent value="contact" className="space-y-5">
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
						<div className="mt-3 flex items-center justify-between gap-x-2">
							<div className="flex w-full items-center gap-x-2 px-2 py-1 transition-all hover:bg-neutral-100">
								<Mail />
								<div className="flex flex-col items-start">
									<span className="text-xs">Email</span>
									<span className="text-sm text-blue-600">
										{user?.email}
									</span>
								</div>
							</div>
							<div className="flex w-full items-center gap-x-2 px-2 py-1 transition-all hover:bg-neutral-100">
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
				</TabsContent>
				<TabsContent value="edit" className="space-y-5">
					Change your password here.
				</TabsContent>
			</Tabs>
		</div>
	);
}
