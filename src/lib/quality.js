// The minimum-quality check for the QR card incentive: the sender has to say
// one specific thing. Here that means a handful of real words, not "thanks!!".
export function countWords(text) {
  return (text.trim().match(/[A-Za-z0-9’']{2,}/g) || []).length;
}

export function isSpecific(text, minWords) {
  return countWords(text) >= minWords;
}
