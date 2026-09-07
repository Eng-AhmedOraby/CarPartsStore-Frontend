function WhatsAppButton({ productName, productUrl, whatsAppNumber }) {
  const message = encodeURIComponent(`عايز أطلب: ${productName}\n${productUrl}`);
  const link = `https://wa.me/${whatsAppNumber}?text=${message}`;
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
      اطلب عبر واتساب
    </a>
  );
}

export default WhatsAppButton;
