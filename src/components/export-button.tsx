import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, CloudDownload } from 'lucide-react';
import { toast } from 'sonner';

type ExportButtonProps<T> = {
	data: T[];
	fileName?: string;
	columns?: { key: keyof T; header: string }[]; // New prop for column customization
};

const ExportButton = <T extends Record<string, unknown>>({
	data,
	fileName = 'exported_data',
	columns,
}: ExportButtonProps<T>) => {
	const handleExport = <T extends Record<string, unknown>>(
		data: T[],
		format: 'csv' | 'xlsx'
	) => {
		const timestamp = new Date().getTime();
		const fullFileName = `${fileName}_${timestamp}`;

		// Preprocess data based on columns
		const processedData = columns
			? data.map((row) =>
					columns.reduce(
						(acc, col) => {
							acc[col.header] = row[col.key as keyof T];
							return acc;
						},
						{} as Record<string, unknown>
					)
				)
			: data;

		if (format === 'csv') {
			if (!processedData.length) {
				console.error('No data available to export.');
				return;
			}

			const csvData = Papa.unparse(processedData);
			const blob = new Blob([csvData], {
				type: 'text/csv;charset=utf-8;',
			});
			saveAs(blob, `${fullFileName}.csv`);
		} else if (format === 'xlsx') {
			const worksheet = XLSX.utils.json_to_sheet(processedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

			const excelBuffer = XLSX.write(workbook, {
				bookType: 'xlsx',
				type: 'array',
			});
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
			});
			saveAs(blob, `${fullFileName}.xlsx`);
		} else {
			toast.error('Export Error!');
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative flex items-center justify-between gap-2 rounded-md p-3 text-white shadow-lg [&_svg]:size-5">
					<CloudDownload />
					<span className="hidden sm:inline-block">Export</span>
					<ChevronDown className="ms-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="rounded-lg shadow-lg">
				<DropdownMenuItem onClick={() => handleExport(data, 'csv')}>
					Export as CSV
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleExport(data, 'xlsx')}>
					Export as XLSX
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ExportButton;
