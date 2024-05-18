import api from '@/lib/server/notion-api'

export async function getPostBlocks (id) {
  const pageBlock = await api.getPage(id || '412d146d60c1484590410d67bea90253')
  return pageBlock
}
