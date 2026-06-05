export function normalizarTelefone(telefone: string): string {
  const soDigitos = telefone.replace(/\D/g, '')

  if (soDigitos.startsWith('55') && soDigitos.length >= 12) {
    return soDigitos
  }

  if (soDigitos.length === 11 || soDigitos.length === 10) {
    return `55${soDigitos}`
  }

  return soDigitos
}

export function gerarLinkWhatsApp(telefone: string, mensagem: string): string {
  const numero = normalizarTelefone(telefone)
  const texto = encodeURIComponent(mensagem)
  return `https://wa.me/${numero}?text=${texto}`
}

export function aplicarVariaveis(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`)
}

export const LINK_WA_PADRAO = `https://wa.me/5541999417269?text=${encodeURIComponent(
  'Olá Rosana, gostaria de agendar um atendimento.'
)}`
