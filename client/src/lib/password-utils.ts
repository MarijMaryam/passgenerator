export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
  excludeDuplicates: boolean
}

export interface StrengthResult {
  score: number // 0-4
  label: string
  percentage: number
  crackTime: string
  factors: StrengthFactor[]
  suggestions: string[]
}

export interface StrengthFactor {
  name: string
  status: 'good' | 'warning' | 'bad'
  description: string
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIGUOUS = 'il1Lo0O'

export function generatePassword(options: PasswordOptions): string {
  let charset = ''
  
  if (options.includeUppercase) charset += UPPERCASE
  if (options.includeLowercase) charset += LOWERCASE
  if (options.includeNumbers) charset += NUMBERS
  if (options.includeSymbols) charset += SYMBOLS
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS.includes(char)).join('')
  }
  
  if (!charset) throw new Error('At least one character type must be selected')
  
  let password = ''
  const array = new Uint32Array(options.length * 2) // Generate extra to account for duplicates
  crypto.getRandomValues(array)
  
  let arrayIndex = 0
  const usedChars = new Set<string>()
  
  for (let i = 0; i < options.length; i++) {
    let char: string
    let attempts = 0
    
    do {
      if (arrayIndex >= array.length) {
        // Regenerate array if we run out
        crypto.getRandomValues(array)
        arrayIndex = 0
      }
      
      char = charset[array[arrayIndex++] % charset.length]
      attempts++
      
      // Prevent infinite loop
      if (attempts > 100) {
        if (options.excludeDuplicates && usedChars.size >= charset.length) {
          throw new Error('Cannot generate password: not enough unique characters available')
        }
        break
      }
    } while (options.excludeDuplicates && usedChars.has(char))
    
    password += char
    if (options.excludeDuplicates) usedChars.add(char)
  }
  
  return password
}

export function checkPasswordStrength(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'No password',
      percentage: 0,
      crackTime: 'instantly',
      factors: [],
      suggestions: ['Enter a password to check its strength']
    }
  }

  const factors: StrengthFactor[] = []
  const suggestions: string[] = []
  let score = 0

  // Length check
  if (password.length >= 12) {
    factors.push({
      name: `Length (${password.length} characters)`,
      status: 'good',
      description: 'Good length'
    })
    score += 1
  } else if (password.length >= 8) {
    factors.push({
      name: `Length (${password.length} characters)`,
      status: 'warning',
      description: 'Acceptable length'
    })
    suggestions.push('Consider using at least 12 characters for better security')
  } else {
    factors.push({
      name: `Length (${password.length} characters)`,
      status: 'bad',
      description: 'Too short'
    })
    suggestions.push('Use at least 8 characters, preferably 12 or more')
  }

  // Character variety
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^A-Za-z0-9]/.test(password)
  
  const varietyCount = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length
  
  if (varietyCount >= 3) {
    factors.push({
      name: 'Character variety',
      status: varietyCount === 4 ? 'good' : 'warning',
      description: varietyCount === 4 ? 'Excellent variety' : 'Good variety'
    })
    score += varietyCount === 4 ? 1 : 0.5
  } else {
    factors.push({
      name: 'Character variety',
      status: 'bad',
      description: 'Limited variety'
    })
    if (!hasUpper) suggestions.push('Add uppercase letters')
    if (!hasLower) suggestions.push('Add lowercase letters')
    if (!hasNumbers) suggestions.push('Add numbers')
    if (!hasSymbols) suggestions.push('Add symbols')
  }

  // Common patterns
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123|234|345|456|567|678|789|890/, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
    /qwerty|asdf|zxcv/i, // Keyboard patterns
  ]
  
  const hasCommonPatterns = commonPatterns.some(pattern => pattern.test(password))
  
  if (!hasCommonPatterns) {
    factors.push({
      name: 'Common patterns',
      status: 'good',
      description: 'None detected'
    })
    score += 0.5
  } else {
    factors.push({
      name: 'Common patterns',
      status: 'bad',
      description: 'Detected'
    })
    suggestions.push('Avoid common patterns like "123", "abc", or "qwerty"')
  }

  // Dictionary words (basic check)
  const commonWords = [
    'password', 'admin', 'user', 'login', 'welcome', 'hello', 'world',
    'test', 'guest', 'root', 'administrator', 'pass', 'secret', 'default'
  ]
  
  const lowerPassword = password.toLowerCase()
  const hasCommonWords = commonWords.some(word => lowerPassword.includes(word))
  
  if (!hasCommonWords) {
    factors.push({
      name: 'Dictionary words',
      status: 'good',
      description: 'None found'
    })
    score += 0.5
  } else {
    factors.push({
      name: 'Dictionary words',
      status: 'bad',
      description: 'Found common words'
    })
    suggestions.push('Avoid using common dictionary words')
  }

  // Personal information patterns (basic)
  const hasPersonalInfo = /\b(19|20)\d{2}\b|\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/.test(password)
  if (hasPersonalInfo) {
    factors.push({
      name: 'Personal information',
      status: 'bad',
      description: 'Possible dates detected'
    })
    suggestions.push('Avoid using dates or personal information')
    score -= 0.5
  }

  // Calculate final score and label
  const finalScore = Math.max(0, Math.min(4, Math.round(score)))
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const percentages = [0, 25, 50, 75, 100]
  
  // Calculate crack time
  const crackTime = calculateCrackTime(password, varietyCount)

  // Add general suggestions
  if (finalScore < 3) {
    if (password.length < 16) {
      suggestions.push('Consider using a longer password (16+ characters)')
    }
    if (!suggestions.some(s => s.includes('variety'))) {
      suggestions.push('Mix different types of characters')
    }
  }

  return {
    score: finalScore,
    label: labels[finalScore],
    percentage: percentages[finalScore],
    crackTime,
    factors,
    suggestions: [...new Set(suggestions)] // Remove duplicates
  }
}

function calculateCrackTime(password: string, varietyCount: number): string {
  // Simplified crack time calculation
  const charsetSizes = [26, 36, 62, 94] // lowercase, +numbers, +uppercase, +symbols
  const charsetSize = charsetSizes[Math.min(varietyCount - 1, 3)] || 26
  
  // Calculate entropy (simplified)
  const entropy = Math.log2(Math.pow(charsetSize, password.length))
  
  // Assume 1 billion guesses per second
  const guessesPerSecond = 1e9
  const secondsToGuess = Math.pow(2, entropy - 1) / guessesPerSecond
  
  if (secondsToGuess < 1) return 'instantly'
  if (secondsToGuess < 60) return `${Math.round(secondsToGuess)} seconds`
  if (secondsToGuess < 3600) return `${Math.round(secondsToGuess / 60)} minutes`
  if (secondsToGuess < 86400) return `${Math.round(secondsToGuess / 3600)} hours`
  if (secondsToGuess < 31536000) return `${Math.round(secondsToGuess / 86400)} days`
  if (secondsToGuess < 31536000000) return `${Math.round(secondsToGuess / 31536000)} years`
  
  const years = secondsToGuess / 31536000
  if (years < 1e6) return `${Math.round(years).toLocaleString()} years`
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`
  return `${Math.round(years / 1e12)} trillion years`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
