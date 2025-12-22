import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Browse from './pages/Browse/Browse';
import Search from './pages/Search/Search';
import ProfileSelect from './pages/ProfileSelect/ProfileSelect';
import MyList from './pages/MyList/MyList';

function App() {
    const location = useLocation();
    const isProfilePage = location.pathname === '/profiles';

    return (
        <div className="app">
            {!isProfilePage && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profiles" element={<ProfileSelect />} />
                <Route path="/movies" element={<Browse type="movie" />} />
                <Route path="/tv-shows" element={<Browse type="tv" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/new" element={<Home />} />
                <Route path="/my-list" element={<MyList />} />
            </Routes>
        </div>
    );
}

export default App;
