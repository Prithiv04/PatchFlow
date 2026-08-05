import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
const queryClient = new QueryClient();
export function AppProvider({ children }) {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [children, _jsx(Toaster, {})] }));
}
export default AppProvider;
