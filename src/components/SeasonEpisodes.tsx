import React, {useState, useEffect} from 'react';

type Props = {
    idElem: any;
}
// SeasonEpisodes component populates each season with episodes
export const SeasonEpisodes:React.FC<Props> = ({idElem})=>{
    const [episodes, setEpisodes] = useState<any>([]);
    const [error, setError] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true);

    const getDetails = async () => {
        const response = await fetch(`https://api.tvmaze.com/seasons/${idElem}/episodes`);
        if(response.ok){
            const nextResponse = await response.json();
            setEpisodes(nextResponse);
        }
    }
    useEffect(() => {
        getDetails()
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }, [])

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
        <div  className="episodes-container">
            {episodes && episodes.length > 0 ?
                episodes.map((item:any)=>{
                    return (
                        <div key={item.id}>
                            <img 
                            src={item.image !== null  ? 
                                item.image.medium 
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMX7GftDfA3VZ2CrsTqWqbdbTr-dwS_NOMbg&usqp=CAU" } 
                            alt={item.name}
                            style={{width: "250px", height: "140px"}}
                            />
                        </div>
                    )
            })
            : (<p>Oops, try again!</p>)
            }
            
        </div>
    )
}