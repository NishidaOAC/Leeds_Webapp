
const authorizePower = (...allowedPowers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    
    const userPower = (req.user.power || '').toString().trim();
    const roleName = (req.user.roleName || req.user.role || '').toString().trim();

    const normalizedAllowed = allowedPowers.map(p => p.toLowerCase());
    
    const isPowerMatch = normalizedAllowed.includes(userPower.toLowerCase());
    const isRoleMatch = normalizedAllowed.some(p => roleName.toLowerCase().includes(p.toLowerCase()));

  
    if (isPowerMatch || isRoleMatch || userPower === 'Admin') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Security Alert: Access Denied. Insufficient privileges for power [${userPower}].`
    });
  };
};

module.exports = authorizePower;