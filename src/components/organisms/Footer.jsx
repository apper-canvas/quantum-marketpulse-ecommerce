import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Shop": [
      { name: "All Products", href: "/" },
      { name: "Electronics", href: "/?category=Electronics" },
      { name: "Fashion", href: "/?category=Fashion" },
      { name: "Home", href: "/?category=Home" },
      { name: "Sports", href: "/?category=Sports" }
    ],
    "Customer Service": [
      { name: "Contact Us", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Shipping Info", href: "#" },
      { name: "Returns", href: "#" },
      { name: "Size Guide", href: "#" }
    ],
    "Company": [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Sustainability", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "YouTube", icon: "Youtube", href: "#" }
  ];

  return (
    <footer className="bg-secondary text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold font-display">
              Stay in the loop
            </h3>
            <p className="text-white/90 font-body max-w-md mx-auto">
              Get the latest updates on new products and exclusive offers
            </p>
            
            <div className="flex max-w-md mx-auto space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium font-body hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <ApperIcon name="ShoppingBag" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display">
                MarketPulse
              </span>
            </Link>
            
            <p className="text-gray-300 font-body leading-relaxed max-w-md">
              Your one-stop destination for premium products. We bring you the 
              latest trends and timeless classics with uncompromising quality.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-display font-semibold text-lg">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white font-body transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-300 font-body">
              © {currentYear} MarketPulse. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link
                to="#"
                className="text-gray-300 hover:text-white font-body transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-gray-300 hover:text-white font-body transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-gray-300 hover:text-white font-body transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;