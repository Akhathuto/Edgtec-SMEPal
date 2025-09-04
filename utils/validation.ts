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
    for (let i = 0; i < number.length; i++) {
        let digit = parseInt(number.charAt(i), 10);
        if (i % 2 === 0) { // odd position (1-indexed)
             sum += digit;
        } else { // even position (1-indexed)
            let evenDigit = digit * 2;
            if (evenDigit > 9) {
                evenDigit = Math.floor(evenDigit / 10) + (evenDigit % 10);
            }
            sum += evenDigit;
        }
    }
    if (sum % 10 !== 0) {
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
