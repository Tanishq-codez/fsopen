const Notification = (props) => {
  if (!props.message) return null;

  return <div className="msg">{props.message}</div>;
};

export default Notification;
