export class BaseApi {
  private uri
  private resource

  constructor(resource: string) {
    this.uri = import.meta.env.VITE_API
    this.resource = resource
  }

  async delete(id: string): Promise<void> {
    const url = `${this.uri}${this.resource}/${id}`
    const { fetchData } = useFetch(url, { method: 'DELETE' })
    await fetchData()
  }
}
