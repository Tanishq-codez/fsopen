const Notification = (props)=>{
     if(props.message == null)
        return null 

     return (
        <div className="msg">
            {props.message}
        </div>
     )
}

export default Notification

