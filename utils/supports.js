function isImageSupported(acceptHeader = '', extension) {
  return acceptHeader.includes(`image/${extension}`);
};

function supportsWebP(acceptHeader, extension) {
  const webpExtensions = ['jpg', 'png', 'jpeg'];
  return webpExtensions.includes(extension) && isImageSupported(acceptHeader, 'webp');
};

exports.isImageSupported = isImageSupported;
exports.supportsWebP = supportsWebP;
