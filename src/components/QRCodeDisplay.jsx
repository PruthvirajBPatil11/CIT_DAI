import { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { generateSessionId, getQRCodeURL, storeSessionData } from '../utils/qrSession';

export default function QRCodeDisplay() {
  const [sessionId, setSessionId] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef(null);

  useEffect(() => {
    // Generate a new session when component mounts
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    const url = getQRCodeURL(newSessionId);
    setQrUrl(url);
    
    // Store session data
    storeSessionData(newSessionId, {
      type: 'qr_upload',
      isActive: true
    });

    // Generate QR code with qr-code-styling
    const qrCode = new QRCodeStyling({
      width: 280,
      height: 280,
      data: url,
      image: undefined,
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        type: 'dot'
      }
    });

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qrCode.append(qrContainerRef.current);
    }
  }, []);

  const handleDownloadQR = () => {
    const qrCode = new QRCodeStyling({
      width: 280,
      height: 280,
      data: qrUrl,
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        type: 'dot'
      }
    });

    qrCode.download({ name: `upload-qr-${sessionId}`, extension: 'png' });
  };

  const handleCopyLink = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!sessionId || !qrUrl) {
    return <div className="text-center py-8 text-slate-300">Generating QR Code...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md mx-auto">
      {/* QR Code Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white text-center mb-4">
          📱 Scan to Upload from Phone
        </h3>
        
        <div 
          ref={qrContainerRef}
          className="bg-white p-4 rounded-lg flex justify-center mb-4 mx-auto w-fit"
        />

        <p className="text-center text-sm text-slate-400 mt-4">
          Scan this QR code with your phone to upload images
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownloadQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          ⬇️ Download QR Code
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </div>

      {/* Session ID Info */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          Session ID: <code className="text-slate-300">{sessionId}</code>
        </p>
      </div>
    </div>
  );
}
