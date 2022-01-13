import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
const Footer = (props) => {
  return (
    <div className="footer">
      <div className="techs">
        <span>React</span>
        <span>Redux</span>
        <span>JavaScript</span>
        <span>HTML5</span>
        <span>CSS</span>
        <span>Express</span>
        <span>PostgreSQL</span>
        <span>AWS</span>
      </div>
      <div className="my-details">
        <div>©2022 Cody Lavene</div>
        <Link to="https://github.com/codylavene">GitHub</Link>
        <Link to="https://www.linkedin.com/in/codylavene/">LinkedIn</Link>
      </div>
    </div>
  );
};

export default Footer;
