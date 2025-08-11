export const formatPhoneForDisplay = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

export const formatPhoneForInput = (phone: string): string => {
  // Remove all non-digits and limit to 10
  return phone.replace(/\D/g, '').slice(0, 10);
};

export const formatUserDisplayName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};
