import { Toaster } from '@/components/sonner';
import Router from '@/router';

function App() {
	return (
		<>
			<Router />
			<Toaster position="top-center" richColors closeButton />
		</>
	);
}

export default App;
