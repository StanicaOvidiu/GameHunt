import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import ConsolesPage from "./pages/ConsolesPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivacypolicyPage from "./pages/PrivacypolicyPage";
import TermsPage from "./pages/TermsPage";
import GamesPage from "./pages/GamesPage";
import PlaystationPage from "./pages/GamesPages/PlaystationPage";
import SearchPage from "./pages/SearchPage";
import XboxPage from "./pages/GamesPages/XboxPage";
import NintendoPage from "./pages/GamesPages/NintendoPage";
import PcPage from "./pages/GamesPages/PcPage";
import PSConsolePage from "./pages/ConsolesPages/PSConsolePage";
import XboxConsolePage from "./pages/ConsolesPages/XboxConsolePage";
import NintendoConsolePage from "./pages/ConsolesPages/NintendoConsolePage";
import CardsPage from "./pages/AccessoriesPages/CardsPage";
import ControllerPage from "./pages/AccessoriesPages/ControllerPage";
import HeadsetPage from "./pages/AccessoriesPages/HeadsetPage";
import Product from "./components/Product";
import SellPage from "./pages/SellPage";
import SellGames from "./pages/SellPages/SellGames";
import SellConsoles from "./pages/SellPages/SellConsoles";
import SellAccessories from "./pages/SellPages/SellAccessories";
import ForgotPassword from "./pages/ForgotPassword";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ShippingPage from "./pages/ShippingPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import Transfer from "./Transfer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("STRIPE PUBLIC KEY");

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/transfer",
        element: <Transfer />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/games",
        element: <GamesPage />,
      },
      {
        path: "/games/playstation",
        element: <PlaystationPage />,
      },
      {
        path: "/consoles",
        element: <ConsolesPage />,
      },
      {
        path: "/accessories",
        element: <AccessoriesPage />,
      },
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/privacypolicy",
        element: <PrivacypolicyPage />,
      },
      {
        path: "/admindashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "/shipping",
        element: <ShippingPage />,
      },
      {
        path: "/checkout",
        element: (
          <Elements stripe={stripePromise}>
            <CheckoutPage />
          </Elements>
        ),
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/sell",
        element: <SellPage />,
      },
      {
        path: "/searchscreen",
        element: <SearchPage />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/games/xbox",
        element: <XboxPage />,
      },
      {
        path: "/games/nintendo",
        element: <NintendoPage />,
      },
      {
        path: "/games/PC",
        element: <PcPage />,
      },
      {
        path: "/games/playstation/:slug",
        element: <Product val="games/playstation" />,
      },
      {
        path: "/games/xbox/:slug",
        element: <Product val="games/xbox" />,
      },
      {
        path: "/games/nintendo/:slug",
        element: <Product val="games/nintendo" />,
      },
      {
        path: "/games/PC/:slug",
        element: <Product val="games/pc" />,
      },
      {
        path: "/consoles/playstation",
        element: <PSConsolePage />,
      },
      {
        path: "/consoles/xbox",
        element: <XboxConsolePage />,
      },
      {
        path: "/consoles/nintendo",
        element: <NintendoConsolePage />,
      },
      {
        path: "/consoles/playstation/:slug",
        element: <Product val="consoles/playstation" />,
      },
      {
        path: "/consoles/xbox/:slug",
        element: <Product val="consoles/xbox" />,
      },
      {
        path: "/consoles/nintendo/:slug",
        element: <Product val="consoles/nintendo" />,
      },
      {
        path: "/accessories/headset",
        element: <HeadsetPage />,
      },
      {
        path: "/accessories/controller",
        element: <ControllerPage />,
      },
      {
        path: "/accessories/cards",
        element: <CardsPage />,
      },
      {
        path: "/accessories/headset/:slug",
        element: <Product val="accessories/headset" />,
      },
      {
        path: "/accessories/controller/:slug",
        element: <Product val="accessories/controller" />,
      },
      {
        path: "/accessories/cards/:slug",
        element: <Product val="accessories/cards" />,
      },
      {
        path: "/sell",
        element: <SellPage />,
      },
      {
        path: "/sell/games",
        element: <SellGames />,
      },
      {
        path: "/sell/consoles",
        element: <SellConsoles />,
      },
      {
        path: "/sell/accessories",
        element: <SellAccessories />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
