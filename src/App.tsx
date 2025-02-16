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
				<Toaster richColors position="top-center" closeButton />
			</ThemeProvider>
		</>
	);
}

export default App;
