import Router from '@/router';
import { Toaster } from './components/ui/sonner';

function App() {
	return (
		<>
			<Router />
			<Toaster position="top-center" closeButton />
		</>
	);
}

export default App;
