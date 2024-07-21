import { useRoutes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar';
import routes from './routes';
import Footer from './components/Footer/footer';
import AuthProvider from './hooks/AuthProvider';

function App() {
  const routeResult = useRoutes(routes);
  return (
    <>
    <div className="min-h-screen flex flex-col overflow-auto">
        {/* <ReactReduxProvider store={store}> */}
            <AuthProvider>
                <Navbar />
                <div className="flex-1">{routeResult}</div>
                <Footer />
            </AuthProvider>
        {/* </ReactReduxProvider> */}
    </div>

</>
  );
}

export default App;
