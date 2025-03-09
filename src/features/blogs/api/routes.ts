const blogRoutes = {
	create: '/v1/blogs',
	update: '/v1/blogs',
	getBlogCommentBaseUrl: '/v1/comments',
	getBlogReactBaseUrl: '/v1/reacts',
	getBlogsForCurrentAuthUser: '/v1/blogs/mine?fetchFeed=true',
	getBlogsByCurrentAuthUser: '/v1/blogs/mine?fetchFeed=false',
};

export default blogRoutes;
