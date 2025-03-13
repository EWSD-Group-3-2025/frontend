import { ComponentType } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardCardProps {
	title: string;
	description?: string;
	value?: number;
	icon?: ComponentType<{ className?: string }>;
	loading?: boolean;
}

export default function DashboardCard({
	title,
	value,
	description,
	icon: Icon,
	loading,
}: DashboardCardProps & { loading?: boolean }) {
	return (
		<Card className="flex flex-1 flex-col space-y-1 p-4">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-gray-400">
					{loading ? <Skeleton className="h-4 w-24" /> : title}
				</span>
				{!loading && Icon ? (
					<Icon className="h-5 w-5 text-gray-400" />
				) : (
					<Skeleton className="h-5 w-5 rounded-full" />
				)}
			</div>
			<span className="text-2xl font-semibold">
				{loading ? <Skeleton className="h-8 w-16" /> : value}
			</span>
			<span className="text-xs font-medium text-gray-500">
				{loading ? (
					<Skeleton className="h-4 w-24" />
				) : (
					(description ?? '')
				)}
			</span>
		</Card>
	);
}
