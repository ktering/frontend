import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-31152Q6XQQ"; // make sure this matches your gtag.js snippet

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};

export const logEvent = (action, category, label) => {
  ReactGA.event({ category, action, label });
};
