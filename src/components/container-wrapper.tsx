import { ReactNode } from 'react';

const ContainerWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="h-[calc(100vh-160px)] rounded-md bg-container-bg p-7 shadow-wrapper">
			{children}
		</div>
	);
};

export default ContainerWrapper;
