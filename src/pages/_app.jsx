import ReactHotToast from "@/core/styles/libs/react-hot-toast";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import PropTypes from "prop-types";
import { Toaster } from "react-hot-toast";
import "react-perfect-scrollbar/dist/css/styles.css";
import createEmotionCache from "../createEmotionCache";
import theme from "../theme";
import "../../styles/globals.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import store from '@/store/index';
import { Provider } from "react-redux";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // const [ isLogin, setIsLogin ] = React.useState(false);
  // const router = useRouter();

  // React.useEffect(() => {
  //   console.log(router);
  //   if (router.pathname === "/login") {
  //     setIsLogin(true);
  //   }
  // }, []);
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
          <ReactHotToast>
            <Toaster
              position={"top-right"}
              toastOptions={{ className: "react-hot-toast" }}
              reverseOrder={false}
            />
          </ReactHotToast>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
