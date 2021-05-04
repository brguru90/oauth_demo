import { useState, useEffect, useReducer } from "react"
import logo from './logo.svg';
import './App.css';
import * as querystring from "querystring"






function App() {

  function setAPI(state, action) {
    switch (action.type) {
      case 1:
        return "oauth_provider_api"
      case 2:
        return "oauth_client_api";
      default:
        return state == "oauth_provider_api" ? "oauth_client_api" : "oauth_provider_api"
    }
  }

  const [token, setToken] = useState(null)
  const [response, setResponse] = useState("")
  const [api, changeAPI] = useReducer(setAPI, "oauth_provider_api");




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
    fetch(`${api}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((res) => res.text())
      .then((response) => {
        localStorage.removeItem("token")
        window.location.assign(response)
      })
      .catch(err => {
        console.error(err)
        alert("Redirect error")
      })
  }

  const is_login = (_token) => {
    fetch(`/${api}/is_login/`, {
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
          return res.text()
        }
      })
      .then(response=>setResponse(response))
      .catch(err => {
        console.log(err)
        redirectToOauthServer()
      })
  }


  const get_token = (auth_code) => {
    fetch(`/${api}/retrive_token/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        code: auth_code
      })
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
      .then((response) => {
        console.log(response)
        if ("access_token" in response) {
          localStorage.setItem("token", response.access_token)
          setToken(response.access_token)
          is_login(response.access_token)
        }
        else {
          redirectToOauthServer()
        }
      })
      .catch(err => {
        console.log(err)
        redirectToOauthServer()
      })
  }


  const check_login=()=>{
    let _token = localStorage.getItem("token")
    is_login(_token)
  }


  useEffect(() => {
    try {
      
      let param = window.location.href.replace(window.location.origin + "/?", "")
      console.log("param", param)
      let query_params = query_params_to_json(param)
      if ("code" in query_params && !localStorage.getItem("token")) {
        let code = query_params["code"]
        get_token(code)
      }
      else {
        check_login()
      }

    } catch (error) {
      console.error(error)
    }
  }, [])


  const verifyLogin = () => {

    fetch(`/${api}/secret_page/`, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + token
      }
    })
      .then((res) => {
        if(res.ok) return res.text()
        return res.statusText
      })
      .then((response) => {
        setResponse(response)
      })
      .catch(err => {
        console.error(err)
        alert("error")
      })

  }

  const getIUserInfo = () => {

    fetch(`/${api}/o/userinfo/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + token,
      }
    })
      .then((res) => {
        if(res.ok) return res.text()
        return res.statusText
      })
      .then((response) => {
        setResponse(response)
      })
      .catch(err => {
        console.error(err)
        alert("error")
      })

  }



  const logout = () => {
    fetch(`/${api}/logout/`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Authorization": "Bearer " + token
      },
      body: querystring.stringify({
        token
      }),
    })
      .then((res) => res.statusText)
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
        <br /><br />
        <button onClick={() => changeAPI(0)}>Toggle API</button><br /><br />
        <button onClick={check_login}>check login</button><br /><br />
        <button onClick={verifyLogin}>Check access</button><br /><br />
        <button onClick={getIUserInfo}>getIUserInfo</button><br /><br />
        <button onClick={logout}>Logout</button><br /><br />
        <b>Current API: </b>{api}<br /><br /><br /><br />

        Access Token:{token} <br /><br /><br /><br />

        {JSON.stringify(response)}
      </center>
    </div>
  );
}

export default App;
