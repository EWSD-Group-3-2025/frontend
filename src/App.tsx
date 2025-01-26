import { Toaster } from '@/components/sonner';
import Router from '@/router';

function App() {
	return (
		<>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim hic
			aut ea. Sint libero voluptatum reiciendis. Impedit, a sequi ipsa, id
			corrupti pariatur incidunt nostrum aliquid blanditiis voluptatem
			porro possimus! Lorem, ipsum dolor sit amet consectetur adipisicing
			elit. Voluptatem aut eius sit quo temporibus voluptates id ea
			recusandae fugiat libero dolore rerum animi natus, laudantium
			consequuntur harum consequatur. Neque, obcaecati.
			<Router />
			<Toaster position="top-center" richColors closeButton />
		</>
	);
}

export default App;
