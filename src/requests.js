import guardianApi from './api';

export async function searchNews(page = 1, query = '') {
  return guardianApi.get(`/search?page=${page}&q=${query}`);
}

export async function getNewsItem(id) {
  const response = await guardianApi.get(`/${id}?show-fields=body`);

  return response.content;
}
