const Bar = (props) => {
  return (
    <div className="bar">
      <div className="bar-start">{props.start}</div>
      <div className="bar-center">{props.center}</div>
      <div className="bar-end">{props.end}</div>
    </div>
  )
};

export default Bar;