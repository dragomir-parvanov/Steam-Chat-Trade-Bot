import React from "react";
import "./App.css";
import Navbar from "./components/util/Navbar";
import { Router, Route } from "react-router-dom";
import Home from "./components/util/Home";
import { createBrowserHistory } from "history";
import Login from "./components/util/Login";
import Register from "./components/util/Register";
import g_history from "./globals/g_history";
import CurrentUserInformation from "./components/util/CurrentUserInformation";
import MiningManagement from "./components/util/MiningManagement";
import UsersManagement from "./components/util/UsersManagement";
import ClientsManagement from "./components/util/client-management/ClientsManagement";
import ChatPageLoading from "./components/util/chat/ChatPageLoading";
import ClientsProxy from "./components/util/ClientsProxy";
import TradesTable from "./components/util/TradesTable";
import OffersSummary from "./components/util/OffersSummary";
import SellItemsOnMarket from "./components/util/market/SellItemsOnMarket";
function App() {
  return (
    <div className="App">
      <Navbar />
    </div>
  );
}

export const routing = (
  <Router history={g_history}>
    <div>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/chat" component={ChatPageLoading} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/currentuser" component={CurrentUserInformation} />
      <Route exact path="/miningmanagement" component={MiningManagement} />
      <Route exact path="/usersmanagement" component={UsersManagement} />
      <Route exact path="/clientsmanagement" component={ClientsManagement} />
      <Route exact path="/proxy" component={ClientsProxy} />
      <Route exact path="/trades" component={TradesTable} />
      <Route exact path="/summary" component={OffersSummary} />
      <Route exact path="/market" component={SellItemsOnMarket} />
    </div>
  </Router>
);

export default App;
