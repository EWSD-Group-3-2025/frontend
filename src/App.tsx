import Router from '@/router';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					defaultTheme="system"
					storageKey="ewsd-frontend-theme"
				>
					<Router />
					<Toaster position="top-center" closeButton />
				</ThemeProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
