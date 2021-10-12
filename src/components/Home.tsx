import { Switch, Route} from "react-router-dom"
import {ShowInfo} from "./ShowInfo";
import App from "../App";
// in Home component will be switching of the pages between search results page and detailed page
export const Home = ()=>{
    return (
        <main>
            <header></header>
                <section>
                    <Switch>
                        <Route path='/detailed'>
                            <ShowInfo />
                        </Route>
                        <Route path='/'>
                            <App />  
                        </Route>
                    </Switch> 
                </section>
            <footer>Coded by Olga Kiseleva</footer>
        </main>
        
    )
}