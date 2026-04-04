import { forwardRef } from 'react';

const FeatherOrb = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="finance-orb"
      style={props.style}
    >
      {/* Dark-mode coin: screen blend removes white bg, leaving only the gold */}
      <img
        src="/coin.png"
        alt="SafeSpend Rupee Coin"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          clipPath: 'circle(44% at 50% 50%)',
          filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
        }}
      />
    </div>
  );
});

FeatherOrb.displayName = 'FeatherOrb';
export default FeatherOrb;
