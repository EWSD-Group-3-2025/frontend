const ResponsiveTitle = ({ title }: { title: string }) => {
	return (
		<h1 className="font-roboto-slab text-xl font-semibold transition-all duration-300 ease-linear sm:text-2xl md:text-3xl">
			{title}
		</h1>
	);
};

export default ResponsiveTitle;
