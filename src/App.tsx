import Router from '@/router';
import { Toaster } from './components/ui/sonner';

function App() {
	return (
		<>
			<Router />
			<Toaster position="top-center" richColors closeButton />
		</>
	);
}

export default App;
