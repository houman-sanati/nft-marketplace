import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <nav className="flex p-5 color-primary text-white items-center justify-between">
          <div className='flex'>
            <h2 className="text-xl font-bold">فروشگاه NFT</h2>
            <div className="grid grid-flow-col gap-4 mr-10">
              <Link to="/">
                خانه
              </Link>
              <Link to="/create-item">
                افزودن
              </Link>
              <Link to="/my-assets">
                NFT های من
              </Link>
              <Link to="/creator-dashboard">
                داشبورد
              </Link>
            </div>
          </div>
          <div>
            <button type='button' className='border-2 p-2 rounded-full shadow-lg'>اتصال کیف پول</button>
          </div>
        </nav>
        <Outlet />
      </div>
    </>
  );
}

export default App;
