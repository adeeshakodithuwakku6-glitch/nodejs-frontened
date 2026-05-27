export default function ProductCard(props){
    return(
        <div className="bg-violet-950 w-60 h-96 ">
            <img src={props.image}/>
            <h2>{props.name}</h2>
            <p>$ {props.price}</p>
        </div>
    )
}