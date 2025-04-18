import { useState, useEffect, useRef, FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import {
	chatRoomListsByUserId,
	messagesForChatRoom,
} from '@/features/chats/api';
import { ChatRoom, ChatRoomMessage } from '@/features/chats/types';
import { format } from 'date-fns';
import { cn } from '@/utils';

export function MessagesView() {
	const { user } = useAuth();
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	const [activeChatRoom, setActiveChatRoom] = useState<number | null>(null);
	const [messages, setMessages] = useState<ChatRoomMessage[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const [showChatRooms, setShowChatRooms] = useState(true);

	useEffect(() => {
		if (!user) return;

		(async () => {
			const res = await chatRoomListsByUserId(user.id);

			setChatRooms(res.data.data);
			if (res.data.data.length > 0) {
				setActiveChatRoom(res.data.data[0].chatRoomId);
			}
		})();
	}, [user]);

	useEffect(() => {
		if (!activeChatRoom) return;

		(async () => {
			const res = await messagesForChatRoom(activeChatRoom);

			setMessages(res.data.data);
		})();
	}, [activeChatRoom]);

	useEffect(() => {
		if (!user) return;

		const socket = new WebSocket(
			import.meta.env.VITE_BACKEND_WEB_SOCKET_BASE_URL
		);
		socketRef.current = socket;

		socket.onopen = () => console.log('Connected to WebSocket');

		socket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data) as ChatRoomMessage;
			if (
				receivedMessage.chatRoomId === activeChatRoom &&
				receivedMessage.senderId !== user.id
			) {
				setMessages((prev) => [...prev, receivedMessage]);
			}
		};

		socket.onerror = (error) => console.error('WebSocket error:', error);
		socket.onclose = () => console.log('WebSocket disconnected');

		return () => socket.close();
	}, [activeChatRoom, user]);

	const handleSendMessage = (e: FormEvent) => {
		e.preventDefault();
		if (
			!newMessage.trim() ||
			!user ||
			!socketRef.current ||
			!activeChatRoom
		)
			return;

		const newMsg = {
			chatRoomId: activeChatRoom,
			senderId: user.id,
			content: newMessage,
		};

		socketRef?.current?.send(JSON.stringify(newMsg));
		setMessages([
			...messages,
			{
				...newMsg,
				id: messages.length + 1,
				senderUsername: user?.name,
				timestamp: new Date(),
			},
		]);
		setNewMessage('');
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="flex flex-col gap-6">
			<div className="h-[calc(100vh-7rem)]">
				<Card className="h-full">
					<CardContent className="flex h-full flex-col gap-4 p-4 md:flex-row">
						{/* Chat Rooms List */}

						<div
							className={cn(
								'min-w-[250px] space-y-1 overflow-auto',
								!showChatRooms && 'hidden md:block'
							)}
						>
							{chatRooms.map((room) => (
								<div
									key={room.chatRoomId}
									className={`flex cursor-pointer items-center gap-3 rounded-lg p-1 hover:bg-muted ${activeChatRoom === room.chatRoomId ? 'bg-muted' : ''}`}
									onClick={() => {
										setActiveChatRoom(room.chatRoomId);
										setShowChatRooms(false);
									}}
								>
									<Avatar className="h-10 w-10">
										<AvatarFallback className="bg-gray-700 text-xl">
											{room.receiverName
												.charAt(1)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<p className="font-medium">
										{room.receiverName}
									</p>
								</div>
							))}
						</div>
						{/* Divider */}
						<div className="h-[1.5px] w-full bg-neutral-200 dark:bg-neutral-800 md:h-full md:w-[1.5px]" />
						{/* Chat Messages */}
						<div className="flex-1">
							{activeChatRoom ? (
								<div className="flex h-full flex-col">
									{/* Chat Header */}
									<div className="flex items-center justify-between border-b p-4 md:hidden">
										<Button
											variant="ghost"
											onClick={() =>
												setShowChatRooms(!showChatRooms)
											}
										>
											{showChatRooms ? 'Hide' : 'Show'}{' '}
											Chat Rooms
										</Button>
									</div>
									{/* Messages */}
									<div className="h-full w-full flex-1 space-y-1 overflow-y-auto p-4">
										{messages.length > 0 ? (
											messages.map((message) => (
												<div
													key={message.id}
													className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
												>
													<div
														className={cn(
															`max-w-[80%] rounded-lg p-3`,
															message.senderId ===
																user?.id
																? 'bg-primary text-primary-foreground'
																: 'bg-muted'
														)}
													>
														<p className="text-sm">
															{message.content}
														</p>
														<span
															className={cn(
																'mt-2 text-xs',
																message.senderId ===
																	user?.id
																	? 'text-muted'
																	: 'text-muted-foreground'
															)}
														>
															{format(
																message.timestamp,
																'yyyy-MM-dd'
															)}
														</span>
													</div>
												</div>
											))
										) : (
											<div className="flex h-full items-center justify-center">
												<p>
													No messages yet. Start a
													conversation!
												</p>
											</div>
										)}
										<div ref={messagesEndRef} />
									</div>
									{/* Message Input */}
									<form
										onSubmit={handleSendMessage}
										className="flex w-full items-center gap-2 border-t p-4"
									>
										<Input
											placeholder="Type a message..."
											className="flex-1"
											value={newMessage}
											onChange={(e) =>
												setNewMessage(e.target.value)
											}
										/>
										<Button
											type="submit"
											size="icon"
											className="h-8 w-8"
										>
											<Send className="h-4 w-4" />
										</Button>
									</form>
								</div>
							) : (
								<div className="flex h-full items-center justify-center">
									<p>Select a chat room to start messaging</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
