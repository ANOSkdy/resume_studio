const React = require('react');

const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);

const cache = new Map();
function createMotion(tag) {
  if (cache.has(tag)) return cache.get(tag);
  const MotionComponent = React.forwardRef(function MotionComponent({ children, ...rest }, ref) {
    return React.createElement(tag, Object.assign({ ref }, rest), children);
  });
  cache.set(tag, MotionComponent);
  return MotionComponent;
}

const motion = new Proxy({}, {
  get: (_, key) => createMotion(key),
});

module.exports = {
  AnimatePresence,
  motion,
  default: { AnimatePresence, motion },
};
