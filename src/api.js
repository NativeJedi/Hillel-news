import axios from 'axios';

const API_KEY = '184a93b7-1452-43b2-b9f4-0ae555113560';
const BASE_URL = 'https://content.guardianapis.com';

const guardianApi = axios.create({ baseURL: BASE_URL });

guardianApi.interceptors.request.use((config) => {
  const { url } = config;

  const apiKeyQuery = url.includes('?') ? `&api-key=${API_KEY}` : `?api-key=${API_KEY}`;

  return {
    ...config,
    url: `${url}${apiKeyQuery}`,
  };
});

guardianApi.interceptors.response.use((response) => {
  const { data } = response;

  return data.response;
});

export default guardianApi;
