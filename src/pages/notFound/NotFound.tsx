import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="max-w-[500px] md:min-w-[500px]">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">
						Page Not Found
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-4 text-muted-foreground">
						Sorry, the page you are looking for is not exist.
					</p>
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button variant="outline" asChild>
						<Link to="/" className="inline-flex items-center">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Go Back
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default NotFound;
