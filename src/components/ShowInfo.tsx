import { useHistory , useLocation} from 'react-router-dom';
import {useState, useEffect} from "react";
import {SeasonEpisodes} from './SeasonEpisodes';

// ShowInfo component populates deatiled page with detailed information about particular show
export const ShowInfo = () => {
    const location = useLocation();
    const history = useHistory();
    const params = new URLSearchParams(location.search);
    //id was passed in Show component through Link.search
    const id = params.get("q");
    const [mainInfo, setMainInfo] = useState<any>([])
    const [info, setInfo] = useState<any>([]);

    const [error, setError] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true);

    const getDetails = async () => {
        // to populate the page we need to make two api calls to fetch different information about the show
        // response call is made to fetch mainInfo information about show
        const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`);
        // initial call is made to fetch info about seasons of the show
        const initialRes = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`);
        if(initialRes.ok && response.ok){
            const nextResponse = await response.json();
            const responseJson = await initialRes.json();
            setMainInfo([...mainInfo, nextResponse]);
            setInfo(responseJson);
        }
    }
    useEffect(() => {
        getDetails()
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }, [])

    console.log('main info ', mainInfo)
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
        <div className="info-container">
        {/* button to go back to search results */}
        <button onClick={history.goBack} className="go-back-btn">Go back to search</button>
        {mainInfo && mainInfo.length > 0 ?
            mainInfo.map((item:any)=>{
                // delete tags from summary string
                let summary = item.summary.replace(/<[^>]*>?/gm, '');
                return (
                    <div className="main-info-container" key={item.id}>
                        <div className="info-image-holder">
                            <img
                                src={item.image !== null  ? 
                                    item.image.original 
                                    : "https://www.indiaspora.org/wp-content/uploads/2018/10/image-not-available.jpg" } 
                                alt={item.name}
                                className="info-poster"
                            />

                        </div>
                        <div className="info-holder">
                            <h1>{item.name}<span> ({item.premiered})</span></h1>
                            <p>{summary}</p>
                            {item.genres.length !== 0 ? 
                                <p>Genres: {item.genres && item.genres.map((genre:any)=>{
                                    return (
                                        <>{genre} </>
                                    )
                                })}</p>
                                : <></>
                            }
                            <p>Status: {item.status}</p>
                            {item._embedded.cast.length !== 0 ? 
                                <p>Cast: {item._embedded.cast && item._embedded.cast.map((pers:any)=>{
                                    return (
                                        <>{pers.person.name} </>
                                    )
                                })}</p>
                                : <></>
                            }
                            
                        </div>
                    </div>
                )
        })
        : (<p>Oops, try again!</p>)
        }

        {info && info.length > 0 ? 
            info.map((elem:any) => {
                console.log('season ' ,elem)
                return (
                    <div key={elem.id}>
                        <h2>Season: {elem.number}</h2>
                        <SeasonEpisodes key={elem.id} idElem={elem.id} />
                    </div>
                
                )}) 
                
                : (<p>Oops, try again!</p>)}
        </div>
    )
}