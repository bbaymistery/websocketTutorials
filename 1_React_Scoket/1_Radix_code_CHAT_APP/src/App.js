import React from 'react';
import { BrowserRouter as Router, } from 'react-router-dom';
import Layout from './Containers/layout';
// {/* If you have other Routes or components that use Router features, they should be inside this Router component */}
function App() {
  return <Router>  <Layout /> </Router>
}

export default App;
