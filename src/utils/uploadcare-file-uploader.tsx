import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

interface UploadcareFileUploaderProps {
	uploadComplete: ({
		fileType,
		fileUrl,
		storedName,
		storedUUID,
	}: {
		fileType: string;
		fileUrl: string;
		storedUUID: number;
		storedName: string;
	}) => Promise<void>;
}

export default function UploadcareFileUploader({
	uploadComplete,
}: UploadcareFileUploaderProps) {
	return (
		<div>
			<FileUploaderRegular
				className="w-full"
				multiple={false}
				pubkey={import.meta.env.VITE_UPLOADCARE_PUBLISH_KEY}
				onCommonUploadSuccess={async (e) => {
					if (!e.isUploading && e.isSuccess && !!e.successEntries) {
						// Upload to backend api after successful uploaded to Uploadcare

						await uploadComplete({
							fileUrl:
								e.successEntries[0].cdnUrl +
								e.successEntries[0].fileInfo.name,
							fileType:
								e.successEntries[0].fileInfo.contentInfo?.mime
									?.subtype || e.successEntries[0].mimeType,
							storedName: e.successEntries[0].fileInfo.name,
							storedUUID: new Date().getMilliseconds(), // TODO : Need to use actual uuid
						});
					}
				}}
			/>
		</div>
	);
}
