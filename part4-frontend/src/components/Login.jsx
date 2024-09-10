import { useState } from "react"


const Login = ({loginEntered}) =>{


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginIn = (event) =>{
        event.preventDefault()
        loginEntered({username,password})
    }

    return (
        <form onSubmit={loginIn}>
            <div className="field">
                <input 
                    type="text" 
                    name="Username" 
                    placeholder="username" 
                    onChange={({target}) => setUsername(target.value)} 
                    value={username}
                    data-testid="username"
                />
            </div>
            <div className="field">
                <input 
                    type="password" 
                    name="Password" 
                    placeholder="password" 
                    onChange={({target}) =>setPassword(target.value)} 
                    value={password} 
                    data-testid="password"
                />
            </div>
            <button>login</button>
        </form>
    )
}

export default Login