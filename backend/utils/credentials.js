const generateRandomDigits = (length = 8) => {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10)
  }

  return result
}

/*  REF NUMBER -------------------------------- */
export const generateRefNumber = () => {
  return `REF-${generateRandomDigits(8)}`
}

/* EMPLOYEE ID -------------------------------- */
export const generateEmployeeId = () => {
  return `EMP-${generateRandomDigits(8)}`
}

/* EMPLOYEE PASSWORD -------------------------------- */
export const generatePassword = () => {
  return `DH-${generateRandomDigits(8)}`
}

/* VERIFICATION CODE -------------------------------- */
export const generateVerificationCode = () => {
  return generateRandomDigits(6)
}