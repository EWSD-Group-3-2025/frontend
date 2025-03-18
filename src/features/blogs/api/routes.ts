const blogRoutes = {
	create: '/v1/blogs',
	update: '/v1/blogs',
	getBlogCommentBaseUrl: '/v1/comments',
	getBlogReactBaseUrl: '/v1/reacts',
	adminBlog: '/v1/blogs',
	// ! TODO HERE remove mine
	getBlogsForCurrentAuthUser: '/v1/blogs?fetchFeed=true',
	getBlogsByCurrentAuthUser: '/v1/blogs?fetchFeed=false',
};

export default blogRoutes;
