/**
 * Validates a South African ID number or a Passport number.
 * @param type - The type of identification ('SA ID' or 'Passport').
 * @param number - The identification number string.
 * @returns An error message string if invalid, or null if valid.
 */
export const validateIdNumber = (type: 'SA ID' | 'Passport', number: string): string | null => {
  if (!number) {
    return 'ID number is required.';
  }

  if (type === 'SA ID') {
    // 1. Basic format check
    if (!/^\d{13}$/.test(number)) {
      return 'SA ID must be 13 digits long.';
    }

    // 2. Date of birth check
    try {
      const year = parseInt(number.substring(0, 2), 10);
      const month = parseInt(number.substring(2, 4), 10);
      const day = parseInt(number.substring(4, 6), 10);
      
      const currentCentury = new Date().getFullYear().toString().substring(0, 2);
      const currentYearInCentury = new Date().getFullYear() % 100;
      const fullYear = year > currentYearInCentury ? parseInt(`${parseInt(currentCentury, 10) - 1}${year.toString().padStart(2,'0')}`) : parseInt(`${currentCentury}${year.toString().padStart(2,'0')}`);
      
      const dob = new Date(fullYear, month - 1, day);
      if (dob.getFullYear() !== fullYear || dob.getMonth() !== month - 1 || dob.getDate() !== day || dob > new Date()) {
          return 'Invalid date of birth in ID number.';
      }
    } catch (e) {
        return 'Invalid date of birth in ID number.';
    }

    // 3. Citizenship check (simple)
    const citizenship = parseInt(number.substring(10, 11), 10);
    if (citizenship !== 0 && citizenship !== 1) {
        return 'Invalid citizenship digit.';
    }

    // 4. Luhn algorithm checksum
    let sum = 0;
    let digits = number.split('').map(Number);
    let checkDigit = digits.pop()!;
    digits.reverse();
    
    let luhnSum = digits.reduce((acc, val, i) => {
        if (i % 2 === 0) {
            let doubled = val * 2;
            return acc + (doubled > 9 ? doubled - 9 : doubled);
        }
        return acc + val;
    }, 0);

    if ((luhnSum + checkDigit) % 10 !== 0) {
        return 'Invalid SA ID. Please double-check the number.';
    }

    return null; // Valid
  }

  if (type === 'Passport') {
    if (!/^[A-Z0-9]{6,15}$/i.test(number)) {
      return 'Passport number should be 6-15 alphanumeric characters.';
    }
    return null; // Valid
  }

  return 'Invalid identification type.';
};

/**
 * Validates a credit card number using the Luhn algorithm.
 */
const isValidCardNumber = (cardNumber: string): boolean => {
    const sanitized = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) {
        return false;
    }
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
};

/**
 * Validates a credit card expiry date (MM/YY).
 */
const isValidExpiryDate = (expiryDate: string): boolean => {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    const year = parseInt(`20${match[2]}`, 10);
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

/**
 * Validates a CVC number.
 */
const isValidCvc = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
};

export interface PaymentValidationErrors {
    cardholderName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
}

export const validatePaymentDetails = (details: { cardholderName: string; cardNumber: string; expiryDate: string; cvc: string; }): PaymentValidationErrors => {
    const errors: PaymentValidationErrors = {};

    if (!details.cardholderName.trim()) {
        errors.cardholderName = "Cardholder name is required.";
    } else if (details.cardholderName.trim().length < 3) {
        errors.cardholderName = "Please enter a full name.";
    }
    
    if (!isValidCardNumber(details.cardNumber)) {
        errors.cardNumber = "Please enter a valid card number.";
    }

    if (!isValidExpiryDate(details.expiryDate)) {
        errors.expiryDate = "Please enter a valid future expiry date (MM/YY).";
    }

    if (!isValidCvc(details.cvc)) {
        errors.cvc = "Please enter a valid CVC (3 or 4 digits).";
    }
    
    return errors;
}