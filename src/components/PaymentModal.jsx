import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Assuming framer-motion is available based on package.json
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { CreditCard, CheckCircle, X, Lock } from 'lucide-react';

import { useParking } from '../context/ParkingContext';

const PaymentModal = ({ isOpen, onClose, onSuccess, amount = 4 }) => {
    const { addPayment } = useParking();
    const [step, setStep] = useState('input'); // input, processing, success, receipt
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setCardName('');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setPaymentData(null);
            setErrors({});
        }
    }, [isOpen]);

    const validatePayment = () => {
        const newErrors = {};

        // Card Number: Simple 16 digit check
        const cleanCardNum = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanCardNum)) {
            newErrors.cardNumber = "Invalid card number (must be 16 digits)";
        }

        // Expiry: MM/YY
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            newErrors.expiry = "Invalid format (MM/YY)";
        } else {
            const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiry = "Card expired";
            }
        }

        // CVV: 3 digits
        if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv = "Invalid CVV (3 digits)";
        }

        // Name
        if (!cardName.trim()) {
            newErrors.cardName = "Name required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = (e) => {
        e.preventDefault();

        if (!validatePayment()) {
            return;
        }

        setStep('processing');

        // Simulate API call
        setTimeout(() => {
            const newPaymentId = `PAY-${Math.floor(Math.random() * 1000000)}`;
            // Data structure for the QR code as per instruction 6
            const data = {
                id: newPaymentId,
                zone: "Zone 3 Premium",
                amount: amount,
                user: cardName,
                timestamp: new Date().toISOString(),
                status: 'Completed',
                valid: true
            };
            setPaymentData(data);
            addPayment(data);
            setStep('success');

            // Auto transition to receipt after success animation
            setTimeout(async () => {
                setStep('receipt');

                // Auto-download QR Code
                try {
                    const qrDataForDownload = JSON.stringify(data);
                    const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataForDownload)}`;

                    const response = await fetch(downloadUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `parking-pass-${newPaymentId}.png`;
                    document.body.appendChild(a);
                    a.click();

                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error("Failed to download QR code automatically", error);
                }
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    // QR Code URL (using a fast, public API for the prototype)
    const qrData = paymentData ? JSON.stringify(paymentData) : '';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}
            >
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={20} color="var(--color-primary)" />
                            Secure Payment
                        </h2>
                        {step === 'input' && (
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {step === 'input' && (
                        <form onSubmit={handlePay}>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Amount</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${amount.toFixed(2)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Premium Zone Access Fee</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <Input
                                    label="Cardholder Name"
                                    placeholder="John Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    required
                                />
                                {errors.cardName && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cardName}</div>}
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <Input
                                    label="Card Number"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={16}
                                    required
                                />
                                {errors.cardNumber && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cardNumber}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label="Expiry"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        required
                                        maxLength={5}
                                    />
                                    {errors.expiry && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.expiry}</div>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label="CVV"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        required
                                        type="password"
                                        maxLength={3}
                                    />
                                    {errors.cvv && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cvv}</div>}
                                </div>
                            </div>

                            <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                                <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                                Pay Now
                            </Button>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid var(--color-bg-app)',
                                    borderTop: '4px solid var(--color-primary)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem auto'
                                }}
                            />
                            <p style={{ color: 'var(--color-text-secondary)' }}>Processing secure payment...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ color: 'var(--color-success)', marginBottom: '1rem' }}
                            >
                                <CheckCircle size={64} />
                            </motion.div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Payment Successful!</h3>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Generating Access Pass...</p>
                        </div>
                    )}

                    {step === 'receipt' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '1rem', border: '1px solid #ddd' }}>
                                <img src={qrUrl} alt="Payment QR Code" width="150" height="150" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Payment ID</div>
                                <code style={{ background: 'var(--color-bg-app)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold' }}>
                                    {paymentData?.id}
                                </code>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Scan this at the gate or show to the attendant.
                            </p>
                            <Button onClick={onSuccess} variant="success" style={{ width: '100%' }}>
                                Continue to Navigation
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default PaymentModal;
