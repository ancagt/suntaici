export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`
}
