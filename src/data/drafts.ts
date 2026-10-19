/**
 * Conteúdo marcado com `draft: true` (texto ainda "a preencher") aparece no ambiente local
 * (npm run dev) e nos previews da Vercel, para revisão, mas nunca no build de produção.
 * A Vercel define VERCEL_ENV como "production", "preview" ou "development" durante o build.
 */
export const showDrafts = import.meta.env.DEV || process.env.VERCEL_ENV === 'preview';

/** Filtra itens em rascunho conforme o ambiente. */
export const isPublished = (item: { draft?: boolean } | undefined) => !!item && (!item.draft || showDrafts);
