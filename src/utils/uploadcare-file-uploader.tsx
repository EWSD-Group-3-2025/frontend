import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

interface UploadcareFileUploaderProps {
	handleSubmit: () => Promise<void>;
}

export default function UploadcareFileUploader({
	handleSubmit,
}: UploadcareFileUploaderProps) {
	return (
		<div>
			<FileUploaderRegular
				className="w-full"
				pubkey={import.meta.env.VITE_UPLOADCARE_PUBLISH_KEY}
				onCommonUploadSuccess={async (e) => {
					if (e.isSuccess && !!e.successEntries) {
						// Upload to backend api after successful uploaded to Uploadcare
						await handleSubmit();
					}
				}}
			/>
		</div>
	);
}
