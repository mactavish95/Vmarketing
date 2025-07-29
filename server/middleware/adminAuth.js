const adminAuth = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }

  // Check if user is active
  if (req.user.isActive === false) {
    return res.status(403).json({ 
      success: false, 
      error: 'Account is deactivated' 
    });
  }

  next();
};

module.exports = adminAuth; 