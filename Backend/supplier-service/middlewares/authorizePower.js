// supplier-service/middlewares/authorizePower.js

const authorizePower = (...allowedPowers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // req.user-ൽ നിന്ന് ലഭ്യമായ power / role സ്ട്രിംഗുകളാക്കുന്നു
    const userPower = (req.user.power || '').toString().trim();
    const roleName = (req.user.roleName || req.user.role || '').toString().trim();

    // Case-Insensitive Matching (വലിയക്ഷരവും ചെറിയക്ഷരവും തമ്മിലുള്ള വ്യത്യാസം ഒഴിവാക്കുന്നു)
    const normalizedAllowed = allowedPowers.map(p => p.toLowerCase());
    
    const isPowerMatch = normalizedAllowed.includes(userPower.toLowerCase());
    const isRoleMatch = normalizedAllowed.some(p => roleName.toLowerCase().includes(p.toLowerCase()));

    // 'QualityAdmin', 'Admin' അല്ലെങ്കിൽ 'SuperAdmin' ഏതാണെങ്കിലും ആക്സസ് നൽകുന്നു
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