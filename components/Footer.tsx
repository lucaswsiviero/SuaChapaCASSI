/**
 * Footer — shown on all pages.
 */

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          SuaChapaCASSI
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xl mx-auto leading-relaxed">
          Esta ferramenta é independente e não possui vínculo com nenhuma das chapas candidatas, com o Banco do Brasil ou com a CASSI — Caixa de Assistência dos Funcionários do Banco do Brasil. Os resultados são meramente indicativos e baseados nas informações fornecidas pelo próprio usuário. Nenhum dado pessoal é coletado ou armazenado.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Eleições CASSI 2026 · Votação de 13 a 23/03/2026
        </p>
      </div>
    </footer>
  );
}
