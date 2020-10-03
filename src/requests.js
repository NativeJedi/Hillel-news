import guardianApi from './api';

export async function searchNews(query = '') {
  const response = await guardianApi.get(`/search?q=${query}`);

  return response.results;
}

export async function getNewsItem(apiUrl) {
  const response = await guardianApi.get(`/${apiUrl}?show-fields=body`);

  return response.content;
}
