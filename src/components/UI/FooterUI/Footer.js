

import '../../styles/footer.css';

function Footer() {
    return (
        <footer className="footer">
        <div className="footer-container">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Pet Connect. All rights reserved.
          </p>
        </div>
      </footer>
  
    )
}

export default Footer;