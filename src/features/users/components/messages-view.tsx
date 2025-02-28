//! TODO Must remove ts ignore
// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { students, tutors, messages as initialMessages } from '@/data';
import { USER_ROLE } from '@/constants';

export function MessagesView() {
	const { user } = useAuth();
	const [activeChat, setActiveChat] = useState(
		user?.roleName === USER_ROLE.STUDENT ? tutors[0].id : students[0].id
	);
	const [messages, setMessages] = useState(initialMessages);
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null); // Reference for the last message

	const contacts = user?.roleName === USER_ROLE.STUDENT ? tutors : students;
	const activeContact = contacts.find((contact) => contact.id === activeChat);

	const chatMessages = messages.filter(
		(message) =>
			(message.sender.id === user?.id &&
				message.recipient.id === activeChat) ||
			(message.sender.id === activeChat &&
				message.recipient.id === user?.id)
	);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !user) return;

		const newMsg = {
			id: `msg-${Date.now()}`,
			sender: {
				id: user.id,
				name: user.name,
				avatar: user?.name || '',
			},
			recipient: {
				id: activeChat,
				name: activeContact?.name || '',
				avatar: activeContact?.avatar || '',
			},
			content: newMessage,
			timestamp: new Date().toISOString(),
			read: false,
		};

		setMessages([...messages, newMsg]);
		setNewMessage('');
	};

	// Scroll to the last message smoothly whenever messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, activeContact]);

	return (
		<div className="flex flex-col gap-6">
			<div className="h-[calc(100vh-7rem)]">
				<Card className="h-full">
					<CardContent className="flex h-full gap-x-4 p-4">
						<div className="min-w-[250px] space-y-1">
							{contacts.map((contact) => (
								<div
									key={contact.id}
									className={`flex cursor-pointer items-center gap-3 rounded-lg p-1 hover:bg-muted hover:outline hover:outline-neutral-300 dark:hover:outline-neutral-700 ${
										activeChat === contact.id
											? 'bg-muted outline outline-neutral-300 dark:outline-neutral-700'
											: ''
									}`}
									onClick={() => setActiveChat(contact.id)}
								>
									<Avatar className="h-10 w-10">
										<AvatarImage
											src={contact.avatar}
											alt={contact.name}
										/>
										<AvatarFallback>
											{contact.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 overflow-hidden">
										<p className="font-medium">
											{contact.name}
										</p>
										<p className="truncate text-sm text-muted-foreground">
											{messages.find(
												(m) =>
													(m.sender.id ===
														contact.id &&
														m.recipient.id ===
															user?.id) ||
													(m.sender.id === user?.id &&
														m.recipient.id ===
															contact.id)
											)?.content || 'No messages yet'}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="h-full w-[1.5px] bg-neutral-200 dark:bg-neutral-800" />
						<div className="flex-1">
							{activeContact ? (
								<div className="flex h-full flex-col items-center justify-center">
									{/* Chat header */}
									<div className="flex w-full items-center gap-3 border-b p-2">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={activeContact.avatar}
												alt={activeContact.name}
											/>
											<AvatarFallback>
												{activeContact.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												{activeContact.name}
											</p>
											<p className="text-sm text-muted-foreground">
												{user?.roleName ===
												USER_ROLE.STUDENT
													? 'Personal Tutor'
													: 'Student'}
											</p>
										</div>
									</div>

									{/* Chat body */}
									<div className="h-full w-full flex-1 overflow-y-auto p-4">
										<div className="h-full space-y-4">
											{chatMessages.length > 0 ? (
												chatMessages.map((message) => (
													<div
														key={message.id}
														className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
													>
														<div
															className={`max-w-[80%] rounded-lg p-3 ${
																message.sender
																	.id ===
																user?.id
																	? 'bg-primary text-primary-foreground'
																	: 'bg-muted'
															}`}
														>
															<p className="text-sm">
																{
																	message.content
																}
															</p>
															<p className="mt-1 text-xs opacity-70">
																{new Date(
																	message.timestamp
																).toLocaleTimeString(
																	[],
																	{
																		hour: '2-digit',
																		minute: '2-digit',
																	}
																)}
															</p>
														</div>
													</div>
												))
											) : (
												<div className="flex h-full flex-1 flex-col items-center justify-center">
													<p className="text-center text-muted-foreground">
														No messages yet. Start a
														conversation!
													</p>
												</div>
											)}
											{/* Scroll-to-bottom reference */}
											<div ref={messagesEndRef} />
										</div>
									</div>

									{/* Chat submit input form */}
									<form
										onSubmit={handleSendMessage}
										className="flex w-full items-center gap-2 border-t p-4"
									>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											className="h-8 w-8 shrink-0 rounded-full"
										>
											<Paperclip className="h-4 w-4" />
											<span className="sr-only">
												Attach file
											</span>
										</Button>
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
											className="h-8 w-8 shrink-0 rounded-full"
										>
											<Send className="h-4 w-4" />
											<span className="sr-only">
												Send message
											</span>
										</Button>
									</form>
								</div>
							) : (
								<div className="flex h-full items-center justify-center">
									<p className="text-center text-muted-foreground">
										Select a contact to start messaging
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
