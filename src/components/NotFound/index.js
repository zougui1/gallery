import React from 'react';
import { Link } from 'react-router-dom';

import './notFound.scss';

const NotFound = () => (
  <div className="container">
    <h1 className="notFound"><Link to="/">Page not found</Link></h1>
  </div>
);

export default NotFound;
