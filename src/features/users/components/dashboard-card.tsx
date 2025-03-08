import { ElementType } from 'react';
import { Card } from '@/components/ui/card';

interface DashboardCardProps {
	title: string;
	value: number;
	icon: ElementType;
}

export default function DashboardCard({
	title,
	value,
	icon: Icon,
}: DashboardCardProps) {
	return (
		<Card className="flex flex-1 flex-col space-y-1 p-4">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-gray-500">
					{title}
				</span>
				<Icon className="h-5 w-5 text-gray-500" />
			</div>
			<span className="text-2xl font-semibold">{value}</span>
		</Card>
	);
}
