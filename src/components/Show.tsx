import React from 'react';
import { Link, } from 'react-router-dom';

type Props = {
    props: {
        id: number,
        name: string,
        image: any
    };
}

export const Show:React.FC<Props> = ({props})=>{
    // destructure passed properties
    const {id, name, image} = props;
    
    return (
        <div className="show-container">
            <Link to={{
                pathname: "/detailed",
                // pass id to url params for ShowInfo component to further info fetching
                search: `?q=${id}`,
            }}>
            <img  
                src={image !== null  ? 
                    image.medium 
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAm6dU5JsOoX02Rm2pRIq0hW6uIQ8VC8h42w&usqp=CAU" } 
                alt={name}
                className="poster"
            />
            </Link>
            <div className="overlay">
                <p>{name}</p>
            </div>
        </div>
    )
}