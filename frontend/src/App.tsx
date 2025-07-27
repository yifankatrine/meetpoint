import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { MantineProvider, createTheme } from '@mantine/core';
import PageHeader from "./components/page/page-header/PageHeader";
import CityPage from "./pages/city/CityPage";
import EventsPage from "./pages/events/EventsPage";
import RestaurantPage from "./pages/restaurant/RestaurantPage";
import MapPage from "./pages/map/MapPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MainPage from "./pages/main/MainPage";
// import AssistantPage from "./pages/assistant/AssistantPage";
import AuthorizationPage from "./pages/authorization/AuthorizationPage";
import RegistrationPage from "./pages/registration/RegistrationPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import FormPage from "./pages/form/FormPage";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage";
import EntertainmentPage from "./pages/entertainment/EntertainmentPage";
import AboutCityPage from "./pages/about-city/AboutCityPage";
import TapePage from "./pages/tape/TapePage";
import AdminPage from "./pages/admin/AdminPage";
import {RequireAuth} from "./features/RequireAuth";
import {Bounce, ToastContainer} from "react-toastify";
import React from "react";
import MeetpointDetails from "./pages/meetpoint/[id]";


const theme = createTheme({
    colors: {
        brand: [
            '#E6F7FF',
            '#BAE7FF',
            '#91D5FF',
            '#69C0FF',
            '#40A9FF',
            '#1890FF',
            '#096DD9',
            '#0050B3',
            '#003A8C',
            '#002766',
        ],
    },
    primaryColor: 'brand',
});

const AppContent = () => {
    const location = useLocation();
    const hideHeaderPaths = ["/login", "/registration", "/form", "/admin"];
    const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

    return (
        <div className="App">


            {shouldShowHeader && <PageHeader />}

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/map" element={<MapPage />} />
                {/*<Route path="/assistant" element={<AssistantPage />} />*/}
                <Route path="/tape/*" element={<TapePage />} >
                    <Route path="recommendations" element={<RecommendationsPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="city" element={<CityPage />} />
                    <Route path="entertainment" element={<EntertainmentPage />} />
                    <Route path="restaurant" element={<RestaurantPage />} />
                    <Route path="about-city" element={<AboutCityPage />} />
                    <Route index element={<RecommendationsPage />} />
                </Route>
                <Route path="/profile" element={<ProfilePage />} />

                <Route element={<RequireAuth requiredRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>

                <Route element={<RequireAuth requiredRoles={["user", "admin"]} />}>
                    <Route path="/meetpoint/:meetpointId" element={<MeetpointDetails />} />
                </Route>



                <Route path="/login" element={<AuthorizationPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/form" element={<FormPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

function App() {
    return (
        <MantineProvider theme={theme}>
            <Router>
                <AppContent />
            </Router>
        </MantineProvider>
    );
}


export default App;