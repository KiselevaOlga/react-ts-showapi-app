import "./App.css";
import {useState, useEffect} from "react";
import {Show} from '../src/components/Show';
import { useLocation, useHistory} from 'react-router-dom';

interface ShowsState {
  shows: {}[]
}

function App() {
  const [shows, setShows] = useState<ShowsState["shows"]>([])
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const location = useLocation();
  // date today provides current date for schedule endpoint
  const dateToday = () => {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  const getMyData = async () => {
    const params = new URLSearchParams(location.search);
    // if user already searched before for a show it will show previous search results
    if(params.has('q')){
      // get current url params and put as an endpoint
      const query = params.get("q") 
      const initialRes = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      if(initialRes.ok){
        const responseJson = await initialRes.json();
        setShows(responseJson)
      }
    } else {
      // if user just loads the page for the first time it will show schedule for current date
      const today = dateToday()
      const initialRes = await fetch(`https://api.tvmaze.com/schedule?country=GB&date=${today}`)
      if(initialRes.ok){
        const responseJson = await initialRes.json();
        setShows(responseJson)
      }
    }
  }

  useEffect (()=>{
    getMyData()
    .catch((err) => setError(err))
    .finally(() => setLoading(false));
  },[])
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)   => {
    e.preventDefault();
    // search for a shows after receiving input query string
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    if(response.ok){
      const responseJson = await response.json();
      // push query params to url so we can get it after
      history.push(`?q=${query}`)
      setShows(responseJson)
    }
    // set query to empty input
    setQuery("")
  }
  // populate the page with shows results 
  const renderList = (): JSX.Element[]=>{
    return shows && shows.map((show: any) => {

        return <Show key={show.id} props={show.show}/>

    })
  }

  if (loading) {
    return (
      <div className="load-container">
          <h2>Loading</h2>
      </div>);
  }

  if (error) {
      return(
      <div className="error-container">
          <h2>Oops, something went wrong</h2>
          <p>{ error }</p>
      </div>) ; 
  }
  return (
      <div>
        <nav className="navbar">
          <h1 className="nav-logo">Sav State</h1>
          <div className="search-holder">
            <form onSubmit={handleSubmit}>
              <img 
                src="https://cdn4.iconfinder.com/data/icons/symbol-blue-set-1/100/Untitled-2-12-128.png" 
                className="icon"
                alt="search icon"
              />
              <label>
                <input 
                  type="text" 
                  placeholder="Search for something..."
                  value={query} 
                  onChange={e => setQuery(e.target.value)}/>
              </label>
            </form>
          </div>
          
        </nav>
        <article className="shows-container">
          {shows.length===0 ? <p>Oops! Could not find anything!</p> : renderList()}
        </article>
      </div>
  );
}

export default App;