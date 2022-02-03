import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Metaverse Marketplace</p>
          <div className="flex mt-4">
            <Link to="/">
              Home
            </Link>
            <Link to="/create-item">
              Sell Digital Asset
            </Link>
            <Link to="/my-assets">
              My Digital Assets
            </Link>
            <Link to="/creator-dashboard">
              Creator Dashboard
            </Link>
          </div>
        </nav>
        <Outlet/>
      </div>
    </>
  );
}

export default App;
