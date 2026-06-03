import axios from 'axios'

// Taverna do Gregor (auth + gold)
export const tavernApi = axios.create({
  baseURL: 'http://localhost:5000',
})

// Empório do Rudolf (produtos, carrinho, pedidos)
export const shopApi = axios.create({
  baseURL: 'http://localhost:5252',
})

const attachToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}

tavernApi.interceptors.request.use(attachToken)
shopApi.interceptors.request.use(attachToken)
