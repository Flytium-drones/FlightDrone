import Navbar from "./Nav/Nav";
import Footer from "./Foot/Foot";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <main style={{ minHeight: "80vh" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
        {children}
      </main>
    </div>
  );
};

Layout.defaultProps = {
  title: "Welcome to Flytium",
  description: "We sell the best products for cheap",
  keywords: "electronics, buy electronics, cheap electronics",
  author: "Flytium",
};

export default Layout;
