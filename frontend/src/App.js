import { useState, useEffect } from "react"
import logo from './logo.svg';
import './App.css';







function App() {

  const [token, setToken] = useState(null)
  const [response, setResponse] = useState("")



  const query_params_to_json = (params) => {
    let _params = params.split("&")
    let query = {}
    _params.forEach((param) => {
      let _param = param.split("=")
      query[_param[0]] = _param[1]
    })
    return query
  }




  const redirectToOauthServer = () => {
    fetch("/oauth_provider_api/", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((res) => res.text())
      .then((response) => {
        window.location.assign(response)
      })
      .catch(err => {
        console.error(err)
        alert("Redirect error")
      })
  }

  const is_login = (_token) => {
    fetch("/oauth_provider_api/is_login/", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + _token
      }
    })
      .then((res) => {
        if (!res.ok || res.status == 403) {
          redirectToOauthServer()
        }
        else {
          setToken(_token)
        }
      })
      .catch(err => {
        console.log(err)
        redirectToOauthServer()
      })
  }


  const get_token = (auth_code) => {
    fetch("/oauth_provider_api/retrive_token/?code="+auth_code, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      }
    })
      .then((res) => {
        console.log(res.status)
        if (res.ok) {         
          return res.json()
        }
        else {
          redirectToOauthServer()
        }
      })
      .then((response)=>{
        console.log(response)
        if("access_token" in response){
          localStorage.setItem("token", response.access_token)
          setToken( response.access_token)
          is_login( response.access_token)
        }
        else{
          redirectToOauthServer()
        }
      })
      .catch(err => {
        console.log(err)
        redirectToOauthServer()
      })
  }



  useEffect(() => {
    try {
      console.log(window.location)
      let param = window.location.href.replace(window.location.origin + "/?", "")
      console.log("param", param)
      let query_params = query_params_to_json(param)
      if ("code" in query_params) {
        let code = query_params["code"]
        get_token(code)
      }
      else {
        let _token = localStorage.getItem("token")
        is_login(_token)
      }

    } catch (error) {
      console.error(error)
    }
  }, [])


  const verifyLogin = () => {

    fetch("/oauth_provider_api/secret_page/", {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + token
      }
    })
      .then((res) => res.text())
      .then((response) => {
        setResponse(response)
      })
      .catch(err => {
        console.error(err)
        alert("error")
      })

  }



  const logout = () => {
    fetch("/oauth_provider_api/logout/", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + token
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setResponse(response)
      })
      .catch(err => {
        console.error(err)
        alert("error")
      })
  }




  return (
    <div className="App">
      <center>
        <button onClick={verifyLogin}>Check access</button><br />

        {JSON.stringify(response)}
      </center>
    </div>
  );
}

export default App;
