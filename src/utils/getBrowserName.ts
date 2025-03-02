export const getBrowserName = (): string => {
	const userAgent = navigator.userAgent.toLowerCase();
	const vendor = navigator.vendor?.toLowerCase() || '';

	if (
		userAgent.includes('opr') ||
		userAgent.includes('opera') ||
		vendor.includes('opera')
	) {
		return 'Opera';
	} else if (userAgent.includes('vivaldi')) {
		return 'Vivaldi';
	} else if (userAgent.includes('samsung')) {
		return 'Samsung Internet';
	} else if (userAgent.includes('yabrowser')) {
		return 'Yandex';
	} else if (userAgent.includes('edg')) {
		return 'Edge';
	} else if (userAgent.includes('brave')) {
		return 'Brave';
	} else if (userAgent.includes('chrome')) {
		return 'Chrome';
	} else if (userAgent.includes('firefox')) {
		return 'Firefox';
	} else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
		return 'Safari';
	} else if (userAgent.includes('msie') || userAgent.includes('trident')) {
		return 'Internet Explorer';
	}
	return 'Unknown';
};
