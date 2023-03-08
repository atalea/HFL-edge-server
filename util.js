class NetworkCount {
  global
  edge_server
  local
  constructor(g,e,l) {
      if(!Number.isFinite(g)) g=0
      if(!Number.isFinite(e)) e=0
      if(!Number.isFinite(l)) l=0
      this.global = g
      this.edge_server = e
      this.local = l
  }
}

const callApi = async ({ url, method, token, body }) => {
  try {
    const options = {
      method: method ? method.toUpperCase() : "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`
    }
    const response = await fetch(`http://${url}`, options)
    const data = await response.json()
    if (data.error) throw data.error
    return data
  } catch (error) {
    console.error("ERROR: ", error.error, error.message)
    return error
  }
}

module.exports = {
  NetworkCount,
  callApi
}