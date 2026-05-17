const generateSixDigitNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateRefNumber = () => {
  return generateSixDigitNumber();
};

export const generateAccessId = () => {
  return generateSixDigitNumber();
};

export const generatePassword = () => {
  return generateSixDigitNumber().toString();
};