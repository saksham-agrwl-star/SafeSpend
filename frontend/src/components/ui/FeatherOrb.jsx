import { forwardRef } from 'react';

const FeatherOrb = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className={`finance-orb ${props.className || ''}`}
      style={props.style}
    >
      <div className="orb-inner-ring"></div>
      <div className="orb-symbol">₹</div>
    </div>
  );
});

FeatherOrb.displayName = 'FeatherOrb';
export default FeatherOrb;
