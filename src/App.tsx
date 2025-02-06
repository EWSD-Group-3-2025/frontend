import Router from '@/router';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';

function App() {
	return (
		<>
			<ThemeProvider
				defaultTheme="system"
				storageKey="ewsd-frontend-theme"
			>
				<Router />
				<Toaster position="top-center" closeButton />
			</ThemeProvider>
		</>
	);
}

export default App;
