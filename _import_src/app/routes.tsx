import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Products } from "./components/Products";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Wishlist } from "./components/Wishlist";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { Orders } from "./components/Orders";
import { AdminDashboard } from "./components/AdminDashboard";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "wishlist", Component: Wishlist },
      { path: "login", Component: Login },
      { path: "profile", Component: Profile },
      { path: "orders", Component: Orders },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
