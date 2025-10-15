import axios from "axios"

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
})

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const apiService = {
  // Fetch all users
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users")
    return response.data
  },

  // Fetch all posts
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>("/posts")
    return response.data
  },

  // Fetch all todos
  async getTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>("/todos")
    return response.data
  },

  // Fetch user by ID
  async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },
}
