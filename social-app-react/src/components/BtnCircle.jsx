
const BtnCircle = (props) => {
  return (
    <abbr title={props.tip}>
      <div className="btn-circle" onClick={props.handleClick}>
        <i className={props.fa} aria-hidden="true"></i>
      </div>
    </abbr>
  )

};

export default BtnCircle;