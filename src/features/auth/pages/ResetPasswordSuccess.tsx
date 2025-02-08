import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPasswordSuccessPage() {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(60); // Start from 60 seconds

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		const timeout = setTimeout(() => {
			// TODO Make redirect logic based on user role and user previous route like accessing from login screen or from profile page
			navigate('/dashboard/student');
		}, 60000); // 1 minute

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, []);

	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="max-w-[500px] md:min-w-[500px]">
				<CardHeader>
					<CheckCircle className="mx-auto mb-3 size-12 rounded-lg border p-2 hover:animate-pulse" />
					<CardTitle className="text-center text-3xl">
						Successfully reset your password
					</CardTitle>
					<CardDescription className="mt-1 text-center">
						We will redirect you to the home screen in{' '}
						<strong>{countdown} seconds</strong>. (Or) Click on
						'Back to Home' button to immediately leave.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to={'/dashboard/student'} className="w-full">
						<Button className="w-full">Back to Home</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
