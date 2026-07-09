import QRCode from 'react-qr-code';
import { Download } from 'lucide-react';
import Button from './Button';

const QRCodeGenerator = ({ value, size = 200, title }) => {
    const downloadQR = () => {
        const svg = document.getElementById('qr-code');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'qr-code.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            )}
            <div className="bg-white p-4 rounded-lg">
                <QRCode id="qr-code" value={value || ''} size={size} level="H" />
            </div>
            <Button variant="outline" icon={Download} onClick={downloadQR}>
                Download QR Code
            </Button>
        </div>
    );
};

export default QRCodeGenerator;
