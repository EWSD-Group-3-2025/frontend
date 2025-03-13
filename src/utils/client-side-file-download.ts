export const downloadFile = async (url: string, filename: string) => {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const blobUrl = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = blobUrl;
		a.download = filename || 'download';
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error('Download failed', error);
	}
};
