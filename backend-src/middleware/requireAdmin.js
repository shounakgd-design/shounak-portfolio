const crypto = require("crypto");

function getAdminApiKey() {
  return process.env.ADMIN_API_KEY?.trim() || "";
}

function verifyAdminApiKey(candidate) {
  const expectedBuffer = Buffer.from(getAdminApiKey());
  const providedBuffer = Buffer.from(candidate || "");

  return expectedBuffer.length > 0 &&
    expectedBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function requireAdmin(req, res, next) {
  const expectedKey = getAdminApiKey();

  if (!expectedKey) {
    return res.status(503).json({
      success: false,
      message: "CMS admin access is not configured on the server.",
    });
  }

  if (!verifyAdminApiKey(req.get("x-admin-key"))) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin key.",
    });
  }

  next();
}

module.exports = requireAdmin;
module.exports.getAdminApiKey = getAdminApiKey;
module.exports.verifyAdminApiKey = verifyAdminApiKey;