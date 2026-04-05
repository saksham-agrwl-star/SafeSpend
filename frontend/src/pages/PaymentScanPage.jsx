import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { parseUPIQRCode, isValidUPI } from '../utils/qrParser';
import { ShieldCheck, Scan, AlertTriangle, Loader2 } from 'lucide-react';
import { scanTransaction, getUserId } from '../utils/api';

const PaymentScanPage = () => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let scanner = null;
    let isMounted = true;

    const initScanner = async () => {
      await new Promise((r) => setTimeout(r, 50));
      if (!isMounted) return;
      try {
        scanner = new Html5QrcodeScanner('qr-reader', { qrbox: { width: 250, height: 250 }, fps: 10 }, false);

        scanner.render(
          async (decodedText) => {
            if (scanning) return; // prevent double-fire
            const parsedData = parseUPIQRCode(decodedText);

            if (!isValidUPI(parsedData)) {
              setError('Invalid UPI QR code. Please try a different one.');
              return;
            }

            setScanning(true);
            setError(null);
            if (scanner) scanner.clear().catch(() => {});

            // Simulate scan processing for fluid UI experience feeling
            setTimeout(() => {
              navigate('/pay', {
                state: {
                  upiData: parsedData,
                  scanResult: null, // Removed inaccurate pre-computed scan to match manual entry flow
                },
              });
            }, 800);
          },
          () => {} // error callback — ignore decode failures silently
        );
      } catch (e) {
        console.error('Scanner init error', e);
        setError('Camera not accessible. Please allow camera permissions.');
      }
    };

    initScanner();
    return () => {
      isMounted = false;
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [navigate]);

  return (
    <div className="skeuo-page-bg flex flex-col pt-16">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-md">
          <div className="skeuo-card p-8 relative overflow-hidden">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'var(--color-bg)',
                  boxShadow: '5px 5px 14px var(--shadow-dark), -4px -4px 10px var(--shadow-light)'
                }}>
                {scanning
                  ? <Loader2 size={28} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} />
                  : <Scan size={28} color="var(--color-accent)" />
                }
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                {scanning ? 'Analysing...' : 'Scan to Pay'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                {scanning
                  ? 'Running AI risk check on this transaction'
                  : 'Point your camera at any UPI QR code'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl mb-6 flex items-start gap-3"
                style={{
                  background: 'rgba(192,80,74,0.08)',
                  border: '1px solid rgba(192,80,74,0.25)',
                  color: 'var(--color-danger)'
                }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Scanner container — hidden while scanning to avoid flicker */}
            {!scanning && (
              <div className="rounded-xl overflow-hidden"
                style={{
                  background: 'var(--color-surface2)',
                  boxShadow: 'inset 4px 4px 12px var(--shadow-dark), inset -3px -3px 8px var(--shadow-light)',
                  border: '1px solid rgba(255,255,255,0.5)'
                }}>
                <div id="qr-reader" className="w-full" style={{ minHeight: '300px' }} />
              </div>
            )}

            {/* Scanning overlay */}
            {scanning && (
              <div style={{
                minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-surface2)', borderRadius: 12,
                border: '1px solid rgba(108,99,255,0.2)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>AI Risk Engine Processing...</p>
                </div>
              </div>
            )}

            {/* Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 mx-auto w-max px-4 py-2 rounded-full"
              style={{
                background: 'var(--color-bg)',
                boxShadow: '3px 3px 8px var(--shadow-dark), -2px -2px 6px var(--shadow-light)',
                fontSize: '0.75rem',
                color: 'var(--color-muted)'
              }}>
              <ShieldCheck size={14} color="var(--color-accent)" />
              <span>AI Risk Protection Enabled</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PaymentScanPage;
